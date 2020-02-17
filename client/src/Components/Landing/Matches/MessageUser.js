import React, { Component } from 'react';

class MessageUser extends Component {
    render() {
        const { user, callback } = this.props;
        return (
            <div className="match-message-container" align="center" onClick={callback}>
                <h1>Your are now messaging, {user.firstName} {user.lastName}</h1>
                <p>Click here to close.</p>
            </div>
        );
    }
}

export default MessageUser;