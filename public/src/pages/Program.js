import React, {PureComponent, Fragment} from 'react';
import {Schedule, Header} from '../components';
import {Talk} from '../components/Talk';
import {classSet} from '../components/utils';
import {retrieveTalks} from '../services/talks';
import {starrUnStarr, all} from '../storages/store';

export class Program extends PureComponent {

    state = {
        talks: [],
        starredTalks: [],
        currentTalk: undefined,
        fetching: true,
    };

    componentDidMount() {
        Promise.all([retrieveTalks(), all()])
            .then(data => {
                let currentTalk = undefined;
                if (this.props.talkId) {
                    currentTalk = data[0].find(item => item.id === this.props.talkId)
                }
                this.setState({
                    talks: data[0],
                    currentTalk,
                    fetching: false,
                    starredTalks: data[1]
                })
            })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.talkId !== this.props.talkId) {
            let currentTalk = undefined;
            if (nextProps.talkId) {
                currentTalk = this.state.talks.find(item => item.id === nextProps.talkId)
            }
            this.setState({
                currentTalk
            })
        }
    }

    onStarr = (talk, rank) => {
        return (e) => {
            e.preventDefault();
            starrUnStarr(talk, rank)
                .then(starredTalks => {
                    this.setState({
                        starredTalks,
                    })
                })
        }
    };

    render() {
        const rows = this.state.talks.map((talk, index) => ({
            talk,
            onStarr: this.onStarr,
            rank: index,
            starred: this.state.starredTalks.filter(_talk => _talk.id === talk.id).length > 0
        }));
        return (
            <Fragment>
                <Header back={this.state.currentTalk} title={this.state.currentTalk ? 'Talk' : 'Planning'} defaultBackRoute="/program"/>
                <div className="content">
                    <div className={classSet({
                        "collections-container": true,
                        "talk-detail": this.state.currentTalk !== undefined
                    })}>
                        <ul className="collection with-header">
                            <li className="collection-header"><h4>Programme</h4></li>
                        </ul>
                        <div className="row">
                            <div className="col s12 m6">
                                <div className="program-container">
                                    <Schedule rows={rows} fetching={this.state.fetching}/>
                                </div>
                            </div>
                            {
                                this.state.currentTalk && (
                                    <div className="col s12 m6">
                                        <Talk talk={this.state.currentTalk}/>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {this.state.fetching && (
                        <div className="loader"></div>
                    )}
                </div>
            </Fragment>
        );
    }
}