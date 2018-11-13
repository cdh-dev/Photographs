import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './theme.css';

import PageEntry from './pages/entry';
import PageLogin from './pages/login';
import PageAdmin from './pages/admin';
import PageHome from './pages/home';

// <Route exact path="/" component={ PageHome }
// <Route component={ PageNotFound }

ReactDOM.render(
    (
        <BrowserRouter>
            <div>
                <Switch>
//                    <Route path="/posts/:post" component={ PageEntry } />
                    <Route path="/login" component={ PageLogin } />
                    <Route path="/admin" component={ PageAdmin } />
                    <Route component={ PageHome } />
                </Switch>
            </div>
        </BrowserRouter>
    ),
    document.getElementById('root')
);