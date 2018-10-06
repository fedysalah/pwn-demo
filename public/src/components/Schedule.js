import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import "../styles/Schedule.css";
import "../styles/collections.css";
import { NavLink, withRouter } from "react-router-dom";
import { favouritesEnabled } from './utils';

class _ScheduleRow extends Component {

    static propTypes = {
        row: PropTypes.shape({
            talk: PropTypes.shape({
                title: PropTypes.string.isRequired,
                author: PropTypes.array.isRequired,
                type: PropTypes.string.isRequired,
                room: PropTypes.string.isRequired,
                time: PropTypes.string.isRequired,
            }),
            starred: PropTypes.bool.isRequired,
            onStarr: PropTypes.func.isRequired,
            rank: PropTypes.number.isRequired,
        })
    };

    goToSpeaker = (e, id) => {
        if (e && e.preventDefault) {
            e.preventDefault()
        }
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        this.props.history.push(`/speakers/${id}`);
    }

    render() {
        const {starred, onStarr, talk, rank} = this.props.row;
        const {id, title, author, type, room, time} = talk;
        return (
            <li className="collection-item">
                <NavLink className="schedule-item collection-item-row" to={`/program/${id}`}>
                    <p className="title">{title}</p>
                    <p className="talk-info">
                    <span className="talk-author">{
                        author.map((a, idx) => {
                            const suffix = idx === author.length - 1 ? '' : ' - ';
                            return (
                                <span onClick={(e) => this.goToSpeaker(e, a.id)} key={a.id}>{a.name}{suffix}</span>
                            )
                        })
                    }</span><br />
                        <span className="talk-type">{type}</span><br/>
                        <span className="talk-room"><i className="fa fa-map-marker"/>&nbsp;{room}</span>&nbsp;
                        -&nbsp;<span className="talk-time"><i className="fa fa-clock-o"/>&nbsp;{time}</span>
                    </p>

                    { favouritesEnabled && 
                    (<span className="secondary-content" onClick={onStarr(talk, rank)}><i
                        className={`fa ${starred ? ' fa-heart' : 'fa-heart-o'}`}/></span>)}
                </NavLink>
            </li>
        )
    }
}

const ScheduleRow = withRouter(_ScheduleRow);

class FetchingRow extends Component {
    render() {
        return (
            <li className="collection-item">
                <div className="fake-item">
                </div>
            </li>
        )
    }
}

export class Schedule extends Component {

    render() {
        return (
            <ul className="collection">
                {
                    this.props.fetching && (
                        <Fragment>
                            <FetchingRow />
                            <FetchingRow />
                            <FetchingRow />
                            <FetchingRow />
                            <FetchingRow />
                            <FetchingRow />
                        </Fragment>
                    )
                }
                {
                    this.props.rows.map((row, idx) => {
                        return (
                            <ScheduleRow key={idx} row={row}/>
                        )
                    })
                }
            </ul>
        );
    }
}