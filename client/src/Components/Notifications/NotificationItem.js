import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { deleteNotification } from '../../actions/profileActions';
import { connect } from 'react-redux';

import {
    DropdownItem,

} from 'reactstrap';

class NotificationItem extends Component {

    constructor() {
        super();

        this.state = {
            redirect: false,
            userId: '',
            messageRedirect: false,
            messageUser: {}
        }
    }

    RedirectUserToProfile(viewedMyProfile, likedMyProfile, matched, unmatched, messagedMe) {
        const { profileId } = this.props.profile;

        if (viewedMyProfile) {
            const data = { type: 'visitedMyProfileNotifications', user: viewedMyProfile, id: profileId };

            this.props.dispatch(deleteNotification(data))
                .then(() => {
                    this.setState({ redirect: true, userId: viewedMyProfile.visitorProfileId });
                });

        } else if (likedMyProfile) {
            const data = { type: 'likedMyProfileNotification', user: likedMyProfile, id: profileId };

            this.props.dispatch(deleteNotification(data))
                .then(() => {
                    this.setState({ redirect: true, userId: likedMyProfile._id });
                });

        } else if (matched) {
            const data = { type: 'matchNotifications', user: matched, id: profileId };

            this.props.dispatch(deleteNotification(data))
                .then(() => {
                    this.setState({ redirect: true, userId: matched._id });
                })
        } else if (unmatched) {
            const data = { type: 'unmatchedProfileNotification', user: unmatched, id: profileId };

            this.props.dispatch(deleteNotification(data))
                .then(() => {
                    this.setState({ redirect: true, userId: unmatched._id });
                })
        } else if (messagedMe) {
            const data = { type: 'messageNotification', user: messagedMe._id, id: profileId };

            this.props.dispatch(deleteNotification(data))
                .then((res) => {
                    this.setState({ messageRedirect: true, messageUser: res });
                })
        }
    }

    displayLikedMyProfile = () => {
        const { likedMyProfile } = this.props;
        const { profileImage, firstName, lastName } = likedMyProfile;
        const fullName = firstName + ' ' + lastName;

        return (
            <div>
                <DropdownItem onClick={this.RedirectUserToProfile.bind(this, null, likedMyProfile, null)}>
                    <div className="notification-item-container">
                        <img className="notification-profile-image" src={profileImage} alt="users profile"></img>
                        <h5 className="notification-name"> {fullName} liked your profile.</h5>
                    </div>
                </DropdownItem>
            </div>
        )
    }

    displayViewedMyProfile = () => {
        const { viewedMyProfile } = this.props;
        const { profileImage, fullName } = viewedMyProfile;

        return (
            <div>
                <DropdownItem onClick={this.RedirectUserToProfile.bind(this, viewedMyProfile, null, null)}>
                    <div className="notification-item-container">
                        <img className="notification-profile-image" src={profileImage} alt="users profile"></img>
                        <h5 className="notification-name"> {fullName} viewed your profile.</h5>
                    </div>
                </DropdownItem>
            </div>
        )
    }

    displayMatched = () => {
        const { matchedProfile } = this.props;
        const { firstName, lastName, profileImage, } = matchedProfile;

        return (
            <div>
                {/* This drop down menu will have a very specific onclick event once the chat is built */}
                <DropdownItem onClick={this.RedirectUserToProfile.bind(this, null, null, matchedProfile)}>
                    <div className="notification-item-container">
                        <img className="notification-profile-image" src={profileImage} alt="users profile"></img>
                        <h5 className="notification-name"> You and {firstName} {lastName} have matched!</h5>
                    </div>
                </DropdownItem>
            </div>
        )
    }

    displayUnmatchedProfile = () => {
        const { unmatchedMyProfile } = this.props;
        const { fistName, lastName, profileImage } = unmatchedMyProfile;

        return (
            <div>
                {/* This drop down menu will have a very specific onclick event once the chat is built */}
                <DropdownItem onClick={this.RedirectUserToProfile.bind(this, null, null, null, unmatchedMyProfile)}>
                    <div className="notification-item-container">
                        <img className="notification-profile-image" src={profileImage} alt="users profile"></img>
                        <h5 style={{ color: 'red' }} className="notification-name"> <b>{fistName} {lastName} disconnected from you!</b></h5>
                    </div>
                </DropdownItem>
            </div>
        )
    }

    displayMessageNotification = () => {
        const { messagedMe } = this.props;
        const { fistName, lastName, profileImage } = messagedMe;

        return (
            <div>
                {/* This drop down menu will have a very specific onclick event once the chat is built */}
                <DropdownItem onClick={this.RedirectUserToProfile.bind(this, null, null, null, null, messagedMe)}>
                    <div className="notification-item-container">
                        <img className="notification-profile-image" src={profileImage} alt="users profile"></img>
                        <h5 style={{ color: 'blue' }} className="notification-name"> <b>{fistName} {lastName} sent you a message.</b></h5>
                    </div>
                </DropdownItem>
            </div>
        )
    }

    render() {

        if (this.state.messageRedirect) {
            const { messageUser } = this.state;

            return <Redirect to={{
                pathname: '/',
                state: { messageUser: messageUser }
            }}
            />
        }
        if (this.state.redirect) {
            const { userId } = this.state;
            return <Redirect to={`/userprofile/${userId}`} />
        }

        const { matchedProfile, likedMyProfile, viewedMyProfile, unmatchedMyProfile, messagedMe } = this.props;

        if (likedMyProfile) {
            return (this.displayLikedMyProfile());
        } else if (viewedMyProfile) {
            return (this.displayViewedMyProfile());
        } else if (matchedProfile) {
            return (this.displayMatched());
        } else if (unmatchedMyProfile) {
            return (this.displayUnmatchedProfile());
        } else if (messagedMe) {
            return (this.displayMessageNotification());
        }
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(NotificationItem);