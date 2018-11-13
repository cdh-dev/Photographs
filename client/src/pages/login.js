import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

// Styles
import './login.css';

export default class PageLogin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            verifying: true,
            redirect: false,
            username: null,
            password: null,
            problem: false,
            error: false
        };
    }

    componentDidMount() {
        document.title = `DH Photos - Login`;

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
                        redirect: true
                    });
                    return;
                } else {
                    this.setLoginToken(null);
                }
            }

            this.setState({
                verifying: false
            });
        });
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect to='/admin'></Redirect>)
        }

        if (this.state.verifying) {
            return this.renderVerifying();
        } else {
            return this.renderLogin();
        }
    }

    renderVerifying = () => {
        return (
            <h5>Verifying...</h5>
        );
    }

    renderLogin = () => {
        return (
            <div>
                <form onSubmit={ this.doLogin }>
                    <label>
                        Username:
                        <input type="text" name="username" id="username" value={ this.state.username } onChange={ this.updateUsername }></input>
                    </label>
                    <br></br>
                    <label>
                        Password:
                        <input type="password" name="password" id="pass" value={ this.state.password } onChange={ this.updatePassword } required></input>
                    </label>
                    <br></br>
                    <input type="submit" value="Login"></input>
                    <br></br>
                    { this.renderProblem() }
                    { this.renderError() }
                </form>
            </div>
        );
    }

    renderProblem = () => {
        if (this.state.problem) {
            return (
                <p style={{ color: 'red' }}>You must enter a username and password!</p>
            );
        } else {
            return (
                <p style={{ display: 'none' }}></p>
            );
        }
    }

    renderError = () => {
        if (this.state.error) {
            return (
                <p style={{ color: 'red' }}>Invalid username or password!</p>
            );
        } else {
            return (
                <p style={{ display: 'none' }}></p>
            );
        }
    }

    updateUsername = (event) => {
        this.setState({
            username: event.target.value,
            problem: false,
            error: false
        });
    }

    updatePassword = (event) => {
        this.setState({
            password: event.target.value,
            problem: false,
            error: false
        });
    }

    doLogin = (event) => {
        event.preventDefault();

        if (this.state.username == null || this.state.username == "" || this.state.password == null || this.state.password == "") {
            this.setState({
                problem: true,
            });
            return;
        }

        axios.post(`/auth/login`, {
            username: this.state.username,
            password: this.state.password
        }).then(res => {
            this.handleLoginResult(res);
        });
    }

    handleLoginResult = (res) => {     
        const data = res.data;

        if (data && data.index) {
            const success = data.index.payload.success;
            const atoken = data.index.atoken;

            if (!success) {
                this.setState({
                    username: "",
                    password: "",
                    problem: false,
                    error: true
                });
                return;
            }

            this.setLoginToken(atoken);

            this.setState({
                redirect: true
            });
        }
    }

    getLoginToken = () => {
        return sessionStorage.getItem('_a');
    }

    setLoginToken = (token) => {
        sessionStorage.setItem('_a', token);
    }

}