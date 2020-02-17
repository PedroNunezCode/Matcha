import React, { Component } from 'react';

class NoMatchesYet extends Component {

    render() {
        return (
            <div className="no-matches-yet">
                <img src="https://miro.medium.com/max/800/0*9BYGa20RkF4rTpJU.png" 
                    alt="forever alone" className="foreveralone-image"/>
                <h1>No matches just yet...</h1>
                <p>You currently have no matches. Browse through and start liking people. Once you match with someone, they will appear in this section.</p>
            </div>
        );
    }
}

export default (NoMatchesYet);