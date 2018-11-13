import React, { Component } from 'react';
import axios from 'axios';

import { Heart } from 'react-feather';

// Styles
import './post.css';

export default class Post extends Component {

    constructor(props) {
        super(props);

        this.state = {
            entry: props.entry,
            imageLoaded: false
        };
    }

    componentDidMount() {
        this.loadImage();
    }

    loadImage = () => {
        const src = this.state.entry.entry.content.upload.link;

        const downloadImage = new Image();
        downloadImage.onload = () => {
            this.setState({
                imageLoaded: true
            });
        };
        downloadImage.src = src;
    }

    render() {
        const payload = this.state.entry;

        const entry = payload.entry;
        const meta = payload.meta;
        const user = payload.user;

        return (
            <article id={ `component-post-${ entry.legend.badge }` } className="component-post">
                <div className="post-header">
                    <div className="flex-wrapper">
                        <span className="post-header-title post-header-item font-header">{ entry.content.title }</span>
                        { this.renderHeart() }
                    </div>
                </div>
                { this.renderImage() }
                <div className="post-extras">
                    <div className="post-extras-meta">
                        <span className="post-extras-meta-likes post-extras-meta">{ meta.likes } { meta.likes == 1 ? 'like' : 'likes' }</span>
                        <span className="post-extras-meta-views post-extras-meta">{ meta.views } { meta.views == 1 ? 'view' : 'views' }</span>
                    </div>
                </div>
            </article>
        );
    }

renderImage = () => {
    const elementName = `component-post-${ this.state.entry.entry.legend.badge }`;

    const src = this.state.entry.entry.content.upload.link;
    const width = this.state.entry.entry.content.upload.size.x;
    const height = this.state.entry.entry.content.upload.size.y;

    const ratio = (height / width) * 100;

    const style = {
        'padding-top': `${ ratio }%`,
        'max-width': `${ width }px`
    };

    if (this.state.imageLoaded) {
        style["background-image"] = `url("${ src }")`;        
    }

    return (
        <div className="post-image" style={{ 'max-width': `${ width }px` }}>
            <div className="post-image-frame" style={ style }></div>
        </div>
    );
}

renderHeart = () => {
    if (this.likeable()) {
        return (
            <Heart className="post-header-heart post-header-item unselected" onClick={ this.doLike } />
        );
    } else {
        return (
            <Heart className="post-header-heart post-header-item selected" />
        );
    }
}

likeable = () => {
    return this.state.entry.user.likeable;
}

doLike = () => {
    if (this.state.entry.user.likeable) {
        const post = this.state.entry.entry.legend.badge;

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
            entry: {
                ...state.entry,
                meta: {
                    ...state.entry.meta,
                    likes: state.entry.meta.likes + (data.index.payload.content.success ? 1 : 0)
                },
                user: {
                    ...state.entry.user,
                    likeable: !data.index.payload.content.success
                }
            }
        };

        this.setState(newState);            
    }
}

getSessionToken = () => {
    return localStorage.getItem('vtoken');
}

setSessionToken = (token) => {
    localStorage.setItem('vtoken', token);
}

}