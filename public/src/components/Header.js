import React, {Component, Fragment} from 'react';
import logo from '../images/logo-summercamp.png';
import '../styles/Header.css'
import {NavLink, withRouter} from "react-router-dom";
import {getDevice, Devices, classSet, favouritesEnabled} from './utils';


const encanLat = 46.1519906;
const encanLon = -1.1528218;

class _Header extends Component {

    onProgramTab = (match, location) => {
        const {pathname} = location;
        return pathname === '/' || pathname.startsWith('/program/')
    }

    reload = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        window.location.reload(true);
    }

    back = () => {
        // on voit si y a qq chose dans l'historique sinon back to program ou speaker
        if (this.props.history.length > 1) {
            this.props.history.goBack();
        } else {
            if (this.props.defaultBackRoute) {
                this.props.history.replace(this.props.defaultBackRoute)
            }
        }
    };

    goToProgram = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault()
        }
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        this.props.history.push(`/`);
    }

    render() {
        const device = getDevice();
        let goToUrl = `https://www.google.com/maps/dir/?api=1&destination=${encanLat},${encanLon}`;
        if (device && device === Devices.ios) {
            goToUrl = `http://maps.apple.com/?daddr=${encanLat},${encanLon}&dirflg=d`
        } else if (device && device === Devices.android) {
            goToUrl = `google.navigation:q=${encanLat},${encanLon}`
        }

        return (
            <Fragment>
            <nav>
                <div className="nav-wrapper">
                    {this.props.back &&
                    <div className="back" onClick={this.back}><i className="fa fa-angle-left"/>&nbsp;</div>}
                    <div className="brand-logo right">
                        <span className="brand-title">JugSummercamp</span>
                        <span className="navigation-title">{this.props.title || ''}</span>
                        <a href={goToUrl} className="location-container">
                            <i className="fa fa-location-arrow location"/>
                        </a>
                        <img src={logo} onClick={this.goToProgram} id="jug" className={classSet({"jug-logo": true, "offline": !navigator.onLine})} alt="JugSummercamp"/>

                    </div>

                    <ul id="nav-mobile" className="left">
                        <li><NavLink exact to="/" isActive={this.onProgramTab}><div className="tab"><i className="fa fa-tasks" aria-hidden="true"/></div></NavLink></li>
                        <li><NavLink to="/speakers"><div className="tab"><i className="fa fa-users" aria-hidden="true"/></div></NavLink></li>
                        {favouritesEnabled && <li><NavLink to="/favorites"><div className="tab"><i className="fa fa-heart" aria-hidden="true"/></div></NavLink></li>}
                        <li id="new-version-mobile" style={{"display": "none"}}>
                            <div className="tab" onClick={this.reload}><i className="fa fa-repeat"></i><span className="new badge"
                                                                                             data-badge-caption="">1</span>
                            </div>
                        </li>
                    </ul>

                    <ul id="nav-desktop" className="left">
                        <li><NavLink exact to="/" isActive={this.onProgramTab}>Programme</NavLink></li>
                        <li><NavLink to="/speakers">Speakers</NavLink></li>
                        {favouritesEnabled && <li><NavLink to="/favorites">Favoris</NavLink></li>}
                        <li id="new-version-desktop" style={{"display": "none"}}>
                            <div onClick={this.reload}><i className="fa fa-repeat"></i><span className="new badge"
                                                                                             data-badge-caption="">1</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
            <div id="offline-message" className="connection-message offline" style={{"opacity": 0}}>Vous êtes hors ligne</div>
            <div id="online-message" className="connection-message" style={{"opacity": 0}}>Vous êtes en ligne</div>
            </Fragment>
        );
    }
}

export const Header = withRouter(_Header);
