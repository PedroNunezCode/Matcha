import React, { Component } from 'react';

class MyMessage extends Component {
    render() {
        const { message, profileImage } = this.props;
        return (
            <div className="my-message">
                <img src={profileImage} alt="match profile " className="messages-profile-image"></img>
                <p style={{textDecoration: 'underline'}}>{message}</p>
            </div>
        );
    }
}

export default MyMessage;