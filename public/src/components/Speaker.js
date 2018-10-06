import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

export class Speaker extends Component {

    render() {
        const { name, bio, picture } = this.props.speaker;
        return (
            <div className="speaker-container">
                <div className="speaker-header">
                    <h4>&nbsp;{name}</h4>
                </div>
                <div className="speaker-infos">
                    <div className="row">
                        <div className="col s12 m4 l6">
                            <img className="speaker-picture" src={picture} alt={name}/>
                        </div>
                        <div className="col s12 m8 l6">
                            <div className="speaker-content">
                                {bio}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
