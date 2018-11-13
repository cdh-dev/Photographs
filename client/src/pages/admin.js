import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import AdminPost from './admin/admin-post';

// Styles
import './admin.css';

export default class PageLogin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            verifying: true,
            needsLogin: false,

            username: null,

            uploadTitle: null,
            uploadLink: null,
            uploadWidth: null,
            uploadHeight: null,

            loadingEntries: true,
            entries: []
        };
    }

    componentDidMount() {
        document.title = 'DH Photos - Admin';
        
        axios.post('/auth/validate', {
            atoken: this.getLoginToken()
        }).then(res => {
            const data = res.data;

            if (data && data.index) {
                const success = data.index.payload.success;
                const atoken = data.index.atoken;

                if (success) {
                    this.setLoginToken(atoken); // Successfully logged in from session.

                    this.setState({
                        verifying: false,
                        username: data.index.payload.username
                    });
                    return;
                } else {
                    this.setLoginToken(null);
                }
            }

            this.setState({
                verifying: false,
                needsLogin: true
            });
        });

        this.fetchPosts();
    }

    fetchPosts = () => {
        axios.post('/posts', {
            vtoken: this.getViewerToken()
        }).then(res => {
            const data = res.data;

            if (data && data.index) {
                const vtoken = data.index.vtoken;
                this.setViewerToken(vtoken);

                const posts = data.index.payload;
                this.setState({
                    loadingEntries: false,
                    entries: posts
                });
            } else {
                this.setState({
                    loadingEntries: false,
                    entries: []
                });
            }
        });
    }

    render() {
        if (this.state.needsLogin) {
            return (
                <Redirect to='/login'></Redirect>
            );
        }

        if (this.state.verifying) {
            return this.renderVerifying();
        } else {
            return this.renderAdmin();
        }
    }

renderVerifying = () => {
    return (
        <h5>Verifying...</h5>
    );
}

renderAdmin = () => {
    return (
        <div>
            <section style={{ border: '1px solid white' }}>
                <h3>Logged in as { this.state.username }</h3>
                <button onClick={ this.doLogout } name="Logout" title="Logout" value="Logout">Logout</button>
            </section>
            <section style={{ border: '1px solid white' }}>
                <h4>New Post</h4>
                <form onSubmit={ this.doSubmitImage }>
                    <label>
                        Title: <input type='text' title="Title" value={ this.state.uploadTitle } onChange={ this.updateUploadTitle } required></input>
                        <br></br>
                        Link: <input type='url' title="Link" value={ this.state.uploadLink } onChange={ this.updateUploadLink } required></input>
                        <br></br>
                        Width: <input type="number" title="Width" value={ this.state.uploadWidth } onChange={ this.updateUploadWidth } required></input>
                        <br></br>
                        Height: <input type="number" title="Height" value={ this.state.uploadHeight } onChange={ this.updateUploadHeight } required></input>
                        <br></br>
                        <input type="submit" value="Submit"></input>
                    </label>
                </form>
            </section>
            { this.renderPosts() }
        </div>
    );
}

renderPosts = () => {
    if (this.state.loadingEntries) {
        return (
            <section style={{ border: '1px solid white' }}>
                Loading posts...
            </section>
        );
    } else if (this.state.entries.length === 0) {
        return (
            <section style={{ border: '1px solid white' }}>
                No posts to display.
            </section>
        );
    } else {
        return (
            <section style={{ border: '1px solid white' }}>
                {
                    this.state.entries.map((item) => {
                        return (
                            <AdminPost entry={ item } update={ this.fetchPosts }></AdminPost>
                        );
                    })
                }
            </section>
        );
    }
}

doLogout = (event) => {
    event.preventDefault();

    this.setLoginToken(null);

    this.setState({
        needsLogin: true
    });
}

doSubmitImage = (event) => {
    event.preventDefault();

    const title = this.state.uploadTitle;
    const link = this.state.uploadLink;
    const width = this.state.uploadWidth;
    const height = this.state.uploadHeight;

    axios.post('/admin/do/upload', {
        atoken: this.getLoginToken(),
        payload: {
            title: title,
            link: link,
            size: {
                x: width,
                y: height
            }
        }
    }).then(res => {
        const data = res.data;

        if (data && data.index) {
            if (data.index.payload.success) {
                this.fetchPosts();
            }
        }
    });

    this.setState({
        uploadTitle: '',
        uploadLink: '',
        uploadWidth: '',
        uploadHeight: '',
    });
}

updateUploadTitle = (event) => {
    const value = event.target.value;

    this.setState({
        uploadTitle: value
    });
}

updateUploadLink = (event) => {
    const value = event.target.value;

    this.setState({
        uploadLink: value
    });
}

updateUploadWidth = (event) => {
    const value = event.target.value;

    this.setState({
        uploadWidth: value
    });
}

updateUploadHeight = (event) => {
    const value = event.target.value;

    this.setState({
        uploadHeight: value
    });
}

getViewerToken = () => {
    return localStorage.getItem('_id');
}

setViewerToken = (token) => {
    localStorage.setItem('_id', token);
}

getLoginToken = () => {
    return sessionStorage.getItem('_a');
}

setLoginToken = (token) => {
    sessionStorage.setItem('_a', token);
}

}