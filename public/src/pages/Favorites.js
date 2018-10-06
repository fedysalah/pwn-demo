import React, {PureComponent, Fragment} from 'react';
import {FavoriteRow, Header} from '../components';
import '../styles/Favorites.css';
import '../styles/collections.css';
import {all} from '../storages/store';

export class Favorites extends PureComponent {

    state = {
        talks: []
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        all().then(talks => {
            this.setState({
                talks,
            })
        })
    };

    render() {
        return (
            <Fragment>
                <Header title={"Favoris"}/>
                <div className="content">
                    <div className="favorites-container collections-container">
                        <ul className="collection with-header">
                            <li className="collection-header"><h4>Favoris</h4></li>
                        </ul>
                        <div className="row">
                            <div className="col s12 l6">
                                <div className="program-container">
                                    <ul className="collection">
                                        { this.state.talks.map((talk, idx) => {
                                            return (
                                                <FavoriteRow key={idx} talk={talk}/>
                                            )
                                        })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}