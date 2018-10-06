import React, {Component, Fragment} from 'react';
import '../styles/Speaker.css';
import '../styles/collections.css';
import {Speaker, Header} from '../components';
import {retrieveSpeakers} from '../services/speakers';
import {chunk, classSet} from '../components/utils';
import {NavLink} from 'react-router-dom';


class FakeSpeaker extends Component {
    render() {
        return (
            <div className="card speaker fake">
                <div className="card-image">
                    <div className="fake-img">
                    </div>
                </div>
            </div>
        )
    }
}

class SpeakerItem extends Component {
    render() {
        const {picture, name, id} = this.props.speaker;
        return (
            <NavLink to={`/speakers/${id}`} className="card speaker hoverable">
                <div className="card-image">
                    <img src={picture} alt={name}/>
                </div>
                <div className="card-content">
                    <p>{name}</p>
                </div>
            </NavLink>
        );
    }
}


export class Speakers extends Component {

    state = {
        speakers: [],
        currentSpeaker: undefined,
        fetching: true,
    }

    componentDidMount() {
        retrieveSpeakers()
            .then(speakers => {
                let currentSpeaker = undefined;
                if (this.props.speakerId) {
                    currentSpeaker = (speakers || []).find(sp => sp.id === this.props.speakerId);
                }
                this.setState({
                    speakers,
                    currentSpeaker,
                    fetching: false,
                })
            })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.speakerId !== this.props.speakerId) {
            let currentSpeaker = undefined;
            if (nextProps.speakerId) {
                currentSpeaker = this.state.speakers.find(sp => sp.id === nextProps.speakerId);
            }
            this.setState({
                currentSpeaker
            })
        }
    }

    render() {
        const chunks = chunk(4, this.state.speakers);

        return (
            <Fragment>
                <Header back={this.state.currentSpeaker} title={this.state.currentSpeaker ? 'Speaker' : 'Speakers'} defaultBackRoute="/speakers"/>
                <div className="content">
                    <div className={classSet({
                        "collections-container": true,
                        "speaker-detail": this.state.currentSpeaker !== undefined
                    })}>
                        <ul className="collection with-header">
                            <li className="collection-header"><h4>Speakers</h4></li>
                        </ul>
                        <div className="row">
                            <div className="col s12 m7">
                                <div className="speakers-container">
                                    {
                                        this.state.fetching && (
                                            <Fragment>
                                                <div className="row">
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                    <div className="col s12 m3">
                                                        <FakeSpeaker />
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                    {   !this.state.fetching &&
                                    chunks.map((row, idx) => {
                                        return (
                                            <div key={idx} className="row">
                                                {
                                                    row.map(sp => {
                                                        return (
                                                            <div key={sp.id} className="col s12 m3">
                                                                <SpeakerItem speaker={sp}/>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                            {
                                this.state.currentSpeaker &&
                                (
                                    <div className="col s12 m5">
                                        <Speaker speaker={this.state.currentSpeaker}/>
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