import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "../styles/Talk.css";
import marked from 'marked';
import {NavLink, withRouter} from 'react-router-dom';
import {rate, rating} from '../storages/store';
import { favouritesEnabled } from './utils';

export class Talk extends Component {

    state = {
        rate: undefined
    };

    static propTypes = {
        talk: PropTypes.object.isRequired,
    };

    componentDidMount() {
        rating(this.props.talk.id)
            .then(rating => {
                rating && this.setState({rate: rating.rate})
            })
    }

    componentWillReceiveProps(nextProps) {
        rating(nextProps.talk.id)
            .then(rating => {
                rating && this.setState({rate: rating.rate})
            })
    }



    onRateChange = (event) => {
        this.setState({
            rate: event.target.value
        }, () => {
            rate({id: this.props.talk.id, rate: this.state.rate})
        })
    };

    render() {
        const {title, description, author, type, room, time} = this.props.talk;
        return (
            <div className="talk-container">
                <div className="talk-header">
                    <h4>{title}</h4>
                </div>
                <div className="talk-content">
                    <div dangerouslySetInnerHTML={{__html: marked(description)}}/>
                </div>
                <div className="talk-info">
                    <span className="talk-author">{
                        author.map((a, idx) => {
                            const suffix = idx === author.length - 1 ? '' : ' - ';
                            return (
                                <NavLink to={`/speakers/${a.id}`} key={a.id}>{a.name}{suffix}</NavLink>
                            )
                        })
                    }</span>
                    <span className="talk-type">{type}</span>
                    <span className="talk-room"><i className="fa fa-map-marker"/>&nbsp;{room}</span>&nbsp;-&nbsp;<span
                    className="talk-time"><i className="fa fa-clock-o"/>&nbsp;{time}</span>
                </div>
                {
                    favouritesEnabled && 
                (<div className="talk-rating">
                    <h6>Comment vous avez trouvé ce talk ?</h6>
                    <fieldset className="rating">
                        <input type="radio" id="star5" name="rating" value="5" checked={this.state.rate === "5"}
                               onChange={this.onRateChange}/><label className="full" htmlFor="star5"
                                                                    title="Awesome - 5 stars"/>
                        <input type="radio" id="star4half" name="rating" value="4 and a half"
                               checked={this.state.rate === "4 and a half"} onChange={this.onRateChange}/><label
                        className="half" htmlFor="star4half" title="Pretty good - 4.5 stars"/>
                        <input type="radio" id="star4" name="rating" value="4" checked={this.state.rate === "4"}
                               onChange={this.onRateChange}/><label className="full" htmlFor="star4"
                                                                    title="Pretty good - 4 stars"/>
                        <input type="radio" id="star3half" name="rating" value="3 and a half"
                               checked={this.state.rate === "3 and a half"} onChange={this.onRateChange}/><label
                        className="half" htmlFor="star3half" title="Meh - 3.5 stars"/>
                        <input type="radio" id="star3" name="rating" value="3" checked={this.state.rate === "3"}
                               onChange={this.onRateChange}/><label className="full" htmlFor="star3"
                                                                    title="Meh - 3 stars"/>
                        <input type="radio" id="star2half" name="rating" value="2 and a half"
                               checked={this.state.rate === "2 and a half"} onChange={this.onRateChange}/><label
                        className="half" htmlFor="star2half" title="Kinda bad - 2.5 stars"/>
                        <input type="radio" id="star2" name="rating" value="2" checked={this.state.rate === "2"}
                               onChange={this.onRateChange}/><label className="full" htmlFor="star2"
                                                                    title="Kinda bad - 2 stars"/>
                        <input type="radio" id="star1half" name="rating" value="1 and a half"
                               checked={this.state.rate === "1 and a half"} onChange={this.onRateChange}/><label
                        className="half" htmlFor="star1half" title="Meh - 1.5 stars"/>
                        <input type="radio" id="star1" name="rating" value="1" checked={this.state.rate === "1"}
                               onChange={this.onRateChange}/><label className="full" htmlFor="star1"
                                                                    title="Sucks big time - 1 star"/>
                        <input type="radio" id="starhalf" name="rating" value="half"
                               checked={this.state.rate === "half"} onChange={this.onRateChange}/><label
                        className="half" htmlFor="starhalf" title="Sucks big time - 0.5 stars"/>
                    </fieldset>
                </div>)}
            </div>
        );
    }
}