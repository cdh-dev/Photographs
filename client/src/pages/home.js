import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import Header from '../components/header';
import Post from '../components/post';
import Roller from '../components/roller';

// Styles
import './home.css';

export default class PageHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            entries: null
        };
    }

    componentDidMount() {
        document.title = `DH Photos`;

        this.fetchPosts();
    }

    fetchPosts = () => {
        axios.post('/posts', {
            vtoken: this.getViewerToken()
        }).then(res => {
            const data = res.data;

            if (data && data.index) {
                const vtoken = data.index.vtoken;
                const entries = data.index.payload;

                this.setViewerToken(vtoken);

                this.setState({
                    loading: false,
                    entries: entries
                });

                return;
            }

            this.setState({
                loading: false
            });
        });
    }

    render() {
        if (this.state.loading) {
            return this.renderLoading();
        } else if (this.state.entries === null) {
            return this.renderNoEntries();
        } else {
            return this.renderEntries();
        }
    }

renderLoading = () => {
    return (
        <div id="container" style={{ height: '100vh' }}>
            <Header dummy={ false } collapse={ false }></Header>
            <div className="flex-wrapper">
                <div className="centered">
                    <Roller></Roller>
                </div>
            </div>
        </div>
    );
}

renderNoEntries = () => {
    return (
        <div>
            An error occurred.
        </div>
    );
}

renderEntries = () => {
    return (
        <div id="container">
            <Header dummy={ true } collapse={ true }></Header>
            <ul className="entry-list">
                {
                    this.state.entries.map((item) => {
                        return (
                            <li className="entry-list-item">
                                <Post entry={ item }></Post>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

getViewerToken = () => {
    return localStorage.getItem('_id');
}

setViewerToken = (token) => {
    localStorage.setItem('_id', token);
}

}