const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const webpush = require("web-push");
const {retrieveTalks, retrieveTalkById} = require('./data/talks');
const {retrieveSpeakers} = require('./data/speakers');
const moment = require('moment');
const expressValidator = require('express-validator');
const compression = require('compression');
moment.locale('fr');
const app = express();
const subscriptions = [];
let talkSubscribers = new Map();

const publicVapidKey =
    "BFwbGBPX9ggNKmMPMtn8a_eYfMaU28iGv8-fy8PwxoMPwZZQQKaq96RMTCBkdUvVDjgJPZ6wtBeZ2p2i09ZMihY";
const privateVapidKey = "-UfSss_RgRG9keikyYIjZYx1UTbUIdAf9yWPwqt_jTM";

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

app.use(compression());
app.enable('trust proxy');
app.use(function (req, res, next) {
    if (req.secure) {
        next();
    } else {
        if (process.env.MODE === 'DEV') {
            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    }
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/api/talks', function (req, res) {
        retrieveTalks().then(data => {
            res.setHeader('Content-Type', 'application/json');
            res.json(data)
        })
    }
);

app.get('/api/speakers', function (req, res) {
        retrieveSpeakers().then(data => {
            res.setHeader('Content-Type', 'application/json');
            res.json(data)
        })
    }
);

app.post('/api/subscribe', function (req, res) {
    const subscription = req.body;
    console.log('subscription', subscription);
    if (subscriptions.filter(sub => sub && sub.endpoint && (sub.endpoint === subscription.endpoint)).length === 0) {
        subscriptions.push(subscription);
    }
    res.json({});
});

app.post('/api/syncFavorites', function (req, res) {
    const subscription = req.body.subscription;
    // remove subscription from all previous talks
    const talks = req.body.talks;
    [...talkSubscribers.keys()]
        .forEach(talkId => {
                talkSubscribers.set(talkId,
                    talkSubscribers.get(talkId)
                        .filter(sub => sub.endpoint === subscription.endpoint)
                )
            }
        );
    // add subscription to new starred talks
    talks.forEach(talk => {
        let subscribers = talkSubscribers.get(talk.id) || [];
        let found = subscriptions.find(sub => sub.endpoint === subscription.endpoint);
        found && subscribers.push({subscription: found, notified: false});
        talkSubscribers.set(talk.id, subscribers);
    });
    res.json({});
});

app.post('/api/syncRatings', function (req, res) {
    const ratings = req.body.ratings;
    res.json({});
});

app.get('/*', function (req, res) {
    if (process.env.MODE === 'PROD') {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
});

app.post('/api/notify', function (req, res) {
    const talkId = req.body.talkId;
    console.log('_talkId...', talkId);
    Promise.all(
        (talkSubscribers.get(talkId) || [])
        .map(_sub => {
            console.log('talkSubscribers Ids...', [...talkSubscribers.keys()]);
           return retrieveTalkById(talkId)
               .then(talk => {
                   console.log('_sub...', _sub);
                   const payload = JSON.stringify({
                       title: 'Ce talk ve démarrer dans moins de 15 minutes',
                       body: talk.title,
                       icon: '/images/logo.png',
                       data: {talkId: talk.id}
                   });
                   _sub.notified=true;
                   return webpush
                       .sendNotification(_sub.subscription, payload)
                       .catch(err => console.error('err', err));
               })
        }))
        .then(() => res.json({}))
        .catch(error => console.log(error));
});


setInterval(() => {
    [...talkSubscribers.keys()]
        .map(talkId => {
            retrieveTalkById(talkId)
                .then(talk => {
                    let period = talk.time.split('-');
                    if (moment().add(15, 'minutes').isBetween(moment(period[0], "hh:mm"), moment(period[1], "hh:mm"))) {
                        return Promise.all(talkSubscribers.get(talkId)
                            .filter(_sub => !_sub.notified)
                            .map(_sub => {
                                const payload = JSON.stringify({
                                    title: 'Ce talk ve démarrer dans moins de 15 minutes',
                                    body: talk.title,
                                    icon: '/images/logo.png',
                                    data: {talkId: talk.id}
                                });
                                _sub.notified=true;
                                return webpush
                                    .sendNotification(_sub.subscription, payload)
                                    .catch(err => console.error('err', err));
                            })
                        )
                    }
                    return Promise.resolve({})
                }).catch(error => console.log(error))
        })
}, 60 * 1000);


module.exports = app;
