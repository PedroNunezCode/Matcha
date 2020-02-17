import React, { Component } from 'react';
import ReactTyped from 'react-typed';

class LandingPage extends Component {

    constructor(){
        super();

        this.information = [
            'Welcome to matcha!',
            'Make the first move...',
            'Over 1,000 singles on matcha.',
            'Find men,',
            'Find women,',
            'or Find both?',
            'Sign up or Login to browse!',
        ]
    }
    render() {
        return (
            <div className="container page-contents">
                <div align="center" className="page-content-align-background-image">
                    <h1 align="center" style={{color:'red'}}className="landing-page-content-header">
                        <ReactTyped
                            loop
                            typeSpeed={30}
                            backSpeed={30}
                            strings={this.information}
                            backDelay={1000}
                            loopCount={0}
                            showCursor
                            className="self-typed"
                            cursorChar="|"
                        /> 
                    </h1>

                    <div align="center" className="fit-landing-page-buttons">
                        <a className="landing-page-buttons" href="/login">Login</a>
                        <a className="landing-page-buttons" href="/register">Register</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default LandingPage;