import React, { Component } from 'react';
import axios from 'axios';

import { Heart } from 'react-feather';

// Styles
import './entry.css';

// Imports
//import Navigation from '../components/navigation';

export default class PageEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            payload: null,
            loading: true
        };
    }

    componentDidMount() {
        document.title = 'DH Photos - Post';

        this.loadEntry();
    }

    render() {
        return (
            <div>
                <div id="container">
                    { this.renderContainer() }
                </div>
            </div>
        );
    }

    renderContainer = () => {
        if (this.state.loading) {
            return this.renderLoading();
        } else if (this.state.payload) {
            return this.renderContent();
        } else {
            return this.renderError();
        }
    }

    renderLoading = () => {
        return (
            <div>

            </div>
        );
    }

    renderContent = () => {
        const payload = this.state.payload;

        const entry = payload.entry;
        const meta = payload.meta;
        const user = payload.user;

        document.title = `DH Photos - ${ entry.content.title }`;

        //                                    <span className="entry-meta-date-label entry-meta-extra entry-extra-label">Posted 10/28/18</span>

        return (
            <div id={ `component-entry-${ entry.legend.badge }` } className="component-individual-entry component">
                <div className="entry-flex-wrapper flex-wrapper">
                    <div className="entry-center-wrapper center-wrapper">
                        <div className="entry-detail-header entry-detail">
                            <div className="flex-wrapper">
                                <span className="entry-header-label entry-header-item">{ entry.content.title }</span>
                                { this.renderHeart() }
                            </div>
                        </div>
                        <div className="entry-detail-image entry-detail">
                            <img className="entry-image" height={ entry.content.upload.size.y } width={ entry.content.upload.size.x } src={ entry.content.upload.link } alt={ entry.content.title }></img>
                        </div>
                        <div className="entry-detail-extras entry-detail">
                            <div className="entry-extra-meta">
                                <span className="entry-meta-likes-label entry-meta-extra entry-extra-label">{ meta.likes } { meta.likes == 1 ? 'like' : 'likes' }</span>
                                <span className="entry-meta-views-label entry-meta-extra entry-extra-label">{ meta.views } { meta.views == 1 ? 'view' : 'views' }</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderHeart = () => {
        if (this.likeable()) {
            return (
                <Heart className="entry-header-heart entry-header-item unselected" onClick={ this.doLike } />
            );
        } else {
            return (
                <Heart className="entry-header-heart entry-header-item selected" />
            );
        }
    }

    renderError = () => {
        return (
            <div>

            </div>
        );
    }

    likeable = () => {
        if (this.state.loading) {
            return false;
        }

        return this.state.payload.user.likeable;
    }

    doLike = () => {
        if (this.state.loading) {
            return;
        }

        if (this.state.payload.user.likeable) {
            const { post } = this.props.match.params;

            axios.post(`/posts/${ post }/do/like`, {
                vtoken: this.getSessionToken()
            }).then(res => {
                this.handleLikeResult(res);
            });
        }
    }

    handleLikeResult = (res) => {     
        const data = res.data;

        if (data && data.index) {
            const vtoken = data.index.vtoken;
            this.setSessionToken(vtoken);

            const state = this.state;

            const newState = {
                payload: {
                    ...state.payload,
                    meta: {
                        ...state.payload.meta,
                        likes: state.payload.meta.likes + (data.index.payload.content.success ? 1 : 0)
                    },
                    user: {
                        ...state.payload.user,
                        likeable: !data.index.payload.content.success
                    }
                }
            }

            this.setState(newState);            
        }
    }

    loadEntry = () => {
        const { post } = this.props.match.params;

        axios.post(`/posts/${ post }`, {
            vtoken: this.getSessionToken()
        }).then(res => {
            this.handleEntry(res);
        });
    }

    handleEntry = (res) => {
        const data = res.data;

        if (data && data.error) {
            this.setState({
                payload: null,
                loading: false
            });

            return;
        }

        if (data && data.index) {
            const vtoken = data.index.vtoken;
            this.setSessionToken(vtoken);

            this.setState({
                payload: data.index.payload,
                loading: false
            });

            return;
        }
    }

    getSessionToken = () => {
        return localStorage.getItem('_id');
    }

    setSessionToken = (token) => {
        localStorage.setItem('_id', token);
    }

}