import React, { Component } from 'react';

import axios from 'axios';

export default class AdminPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showDelete: false
        };
    }

    render() {
        return (
            <article style={{ border: '1px solid grey' }}>
                <p>{ this.props.entry.entry.legend.badge }</p>
                <h5 style={{ color: 'white' }}>{ this.props.entry.entry.content.title }</h5>
                <img src={ this.props.entry.entry.content.upload.link } style={{ width: '125px' }} alt={ this.props.entry.entry.content.title }></img>
                <span>{ this.props.entry.meta.likes } likes, { this.props.entry.meta.views } views</span>
                <br></br>
                { this.renderDelete() }
            </article>
        );
    }

    renderDelete = () => {
        if (this.state.showDelete) {
            return (
                <section className='section-delete'>
                    <button style={{ color: 'green' }} onClick={ this.hideDelete }>Cancel</button>
                    <button style={{ color: 'red' }} onClick={ this.doDelete }><span>Delete for real.</span></button>
                </section>
            );
        } else {
            return (
                <section className='section-delete'>
                    <button style={{ color: 'red' }} onClick={ this.showDelete }>Delete</button>
                </section>
            );
        }
    }

    showDelete = () => {
        this.setState({
            showDelete: true
        });
    }

    hideDelete = () => {
        this.setState({
            showDelete: false
        });
    }

    doDelete = () => {
        const badge = this.props.entry.entry.legend.badge;

        axios.post(`/admin/do/delete`, {
            atoken: this.getLoginToken(),
            badge: badge
        }).then(res => {
            this.handleDeleteResult(res);
        });
    }

    handleDeleteResult = (res) => {     
        const data = res.data;

        if (data && data.index) {
            this.props.update();
        }
    }

    getLoginToken = () => {
        return sessionStorage.getItem('atoken');
    }

}