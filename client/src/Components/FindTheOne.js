import React, { Component } from 'react';
import { connect } from "react-redux";
import ProfileAndSearch from './Landing/ProfileAndSearch';
import MessagesAndMatches from './Landing/MessagesAndMatches';
import BrowsePeople from './Landing/BrowsePeople';
import NotEligibleToBrowse from './Landing/NotEligibleToBrowse';

class FindTheOne extends Component {
    render() {
        const { userProfileImage, interestedIn, interests, bio, age } = this.props.profile;

        if (!userProfileImage || interestedIn === 'Choose' || interests.length < 5 || !bio || !age) {
            return (
                <NotEligibleToBrowse />
            )
        } else {
            return (
                <div className="row">
                    <div className="col-md-4 profile-matches-messages-container">
                        <div className="profile-and-search">
                            <ProfileAndSearch />
                            <MessagesAndMatches />
                        </div>
                    </div>

                    <div className="col-md-8" style={{ background: '#EFF3F6', marginBottom: '20px' }}>
                        <BrowsePeople />
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(FindTheOne);