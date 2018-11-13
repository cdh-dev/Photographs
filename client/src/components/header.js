import React, { Component } from 'react';

// Styles
import './header.css';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            yp: 0,
            v: true,
            r: false
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    render() {
        return (
            <nav id="component-header" className="component-header">
                <section id="header-powered" className="header-combine">
                    <div className="flex-wrapper">
                        <div className="header-branding header-segment">
                            <span id="header-branding-name" className="font-header">Dylan Hanson</span>
                            <span id="header-branding-title" className="font-script">Photographs</span>
                        </div>
                    </div>
                </section>
                { this.renderDummy() }
            </nav>
        );
    }

    renderDummy = () => {
        if (this.props.dummy) {
            return (
                <section id="header-dummy" className="header-combine">
                </section>
            );
        } else {
            return (<div></div>);
        }
    }

    handleScroll = (event) => {
        const state = this.state;
        let yp = state.yp;
        let v = state.v;

        const yc = window.scrollY;

        if (yc < yp && !v) { // Need to show
            document.getElementById('component-header').classList.remove('collapsed');
            v = true;
        } else if (yc > 0 && yc > yp && v) { // Need to hide
            document.getElementById('component-header').classList.add('collapsed');
            v = false;
        }

        yp = yc;

        this.setState({
            yp: yp,
            v: v
        });
    }

}