import React, { Component } from 'react';

class Unlucky extends Component {
    render() {
        return (
            <div className="user-profile-matching">
                <div className="display-profile-image-container">
                    <img style={{height: '100%', width: '100%'}} alt="user profiles"
                        src="https://media.giphy.com/media/13qZohZRwWBSwM/giphy.gif"/>
                </div>

                <div className="display-profile-stats-container">
                    <div className="display-profile-name-and-age">
                    </div>
                    <div className="display-profile-bio">
                    </div>
                    <div className="display-profile-like-dislike-buttons-container">
                        <div className="display-profile-like-dislike-buttons">
                            <h4 align="center">Come back tomorrow... or next month... or next year...</h4>
                        </div>
                    </div>
                </div> 
            </div>
        );
    }
}

export default Unlucky;