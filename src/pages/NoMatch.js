import React, { Component, Fragment } from 'react';
import {Header} from '../components';
import '../styles/NoMatch.css'

export class NoMatch extends Component {
    render() {
        return (
            <Fragment>
            <Header />
                <div className="content">
            <div className="no-match-container">
                <h4>Ouh là y a rien ici !</h4>
            </div>
                </div>
            </Fragment>

        );
    }
}