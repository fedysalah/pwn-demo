import React, {PureComponent} from 'react';
import {NavLink, withRouter} from "react-router-dom";

class _FavoriteRow extends PureComponent {

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
        const {title, author, type, room, time} = this.props.talk;
        return (
            <li className="collection-item">
                <a className="schedule-item collection-item-row">
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
                </a>
                <span/>
            </li>
        )
    }
}

export const FavoriteRow = withRouter(_FavoriteRow);