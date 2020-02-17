import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ProfileAndSearch extends Component {

    render() {
        const { userProfileImage } = this.props.profile;

        return (
            <div className="message-profile-panel">
                <div style={{ display: 'flex' }}>
                    <img className="profile-panel-profile-image" src={userProfileImage} alt="current user profile" />
                    <h4 className="my-profile-header"><Link to="/profile" style={{ color: 'white' }}>My Profile</Link></h4>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile
    }
}

export default connect(mapStateToProps)(ProfileAndSearch);