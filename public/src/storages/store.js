import Dexie from 'dexie';

const db = new Dexie("JugSummercampDatabase");

db.version(1).stores({
    favorites: "id,title,author,type,room,time,description,rank",
    ratings: "id,rate",
});

export const rate = (talk) => {
    console.log('rating talk  : ', talk);
    return db.ratings.where('id')
        .equals(talk.id)
        .count()
        .then(count => {
            if (count == 0) {
                return db.ratings.add(talk)
                    .then(() => requestSync('ratings_updated'))
            } else {
                return db.ratings.update(talk.id, {rate: talk.rate})
                    .then(() => requestSync('ratings_updated'))
            }
        });
};

export const rating = (id) => {
    return db.ratings.get(id)
};

export const starrUnStarr = (talk, rank) => {
    console.log('starring talk  : ', talk);
    return db.favorites.where('id')
        .equals(talk.id)
        .count()
        .then(count => {
            if (count == 0) {
                return db.favorites.add({...talk, rank})
                    .then(() => requestSync('favorites_updated'))
                    .then(() => db.favorites.toArray())
            } else {
                return db.favorites.where('id')
                    .equals(talk.id)
                    .delete()
                    .then(() => requestSync('favorites_updated'))
                    .then(() => db.favorites.toArray())
            }
        });
};

export const all = () => {
    return db.favorites.orderBy('rank').toArray()
};

const requestSync = (evt) => navigator.serviceWorker.ready
    .then(swRegistration => {
        if (window.SyncManager) {
            return swRegistration.sync.register(evt)
        } else {
            return Promise.resolve({});
        }
    });
