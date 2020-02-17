import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

class BlockedUser extends Component {
    render() {
        return (
            <div className="container" align="center" style={{textAlign: 'center', marginTop: '16vh', marginBottom: '50vh'}}>
                <FontAwesomeIcon color="red" size="7x" icon={faBan} />
                <h2 style={{marginTop: '3vh'}}>Sorry, you have been blocked</h2>
                <br></br>
                <p>The user you are trying to visit has permanently blocked you.</p>
                <p>Their action is irreversible. Please continue <Link to="/">browsing.</Link></p>
            </div>
        );
    }
}

export default BlockedUser;