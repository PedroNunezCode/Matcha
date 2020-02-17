import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearNotifications } from '../../actions/profileActions';
import NotificationItem from './NotificationItem';


import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
} from 'reactstrap';

class NotificationBell extends Component {

    renderProfileLikesNotifications = () => {
        const { likedMyProfileNotifications } = this.props.profile;

        return likedMyProfileNotifications.map((profile, index) => {
            return <NotificationItem likedMyProfile={profile} key={index} />
        });

    }
    renderProfileViewedNotifications = () => {
        const { viewedMyProfileNotifications } = this.props.profile;

        return viewedMyProfileNotifications.map((profile, index) => {
            return <NotificationItem viewedMyProfile={profile} key={index} />
        });
    }

    renderProfileMatchesNotifications = () => {
        const { matchNotifications } = this.props.profile;

        return matchNotifications.map((notification, index) => {
            return <NotificationItem matchedProfile={notification} key={index} />
        })
    }

    returnCorrectNotificationNumber = (notifications) => {

        if (notifications > 0) {
            return (
                <div id="notification-bell">
                    <span className="p1 fa-stack fa-1x has-badge" data-count={notifications}>
                        <i className="p2 fa fa-circle fa-stack-2x"></i>
                        <i className="p3 fa fa-bell fa-stack-1x fa-inverse"></i>
                    </span>
                </div>
            )
        } else {
            return (
                <div id="notification-bell">
                    <span className="p1 fa-stack fa-1x has-badge">
                        <i className="p2 fa fa-circle fa-stack-2x"></i>
                        <i className="p3 fa fa-bell fa-stack-1x fa-inverse"></i>
                    </span>
                </div>
            )
        }
    }

    renderUnmatchedNotifications = () => {

        const { unmatchedNotifications } = this.props.profile;

        return unmatchedNotifications.map((profile, index) => {
            return <NotificationItem unmatchedMyProfile={profile} key={index} />
        });
    }

    renderMessageNotifications = () => {
        const { messageNotifications } = this.props.profile;

        return messageNotifications.map((profile, index) => {
            return <NotificationItem messagedMe={profile} key={index}/>
        });
    }

    clearNotifications = () => {
        const { profileId } = this.props.profile;
        this.props.dispatch(clearNotifications(profileId));
    }

    returnCorrectNotificationMenu = () => {

        const { likedMyProfileNotifications, viewedMyProfileNotifications, matchNotifications, unmatchedNotifications, messageNotifications } = this.props.profile;
        const notifications = likedMyProfileNotifications.length + viewedMyProfileNotifications.length
            + matchNotifications.length + unmatchedNotifications.length + messageNotifications.length;

        if (notifications > 0) {
            return (
                <div>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav>
                            {this.returnCorrectNotificationNumber(notifications)}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem header>Notification ({notifications})</DropdownItem>
                            {this.renderProfileLikesNotifications()}
                            {this.renderProfileViewedNotifications()}
                            {this.renderProfileMatchesNotifications()}
                            {this.renderUnmatchedNotifications()}
                            {this.renderMessageNotifications()}
                            <DropdownItem divider />
                            <DropdownItem onClick={this.clearNotifications}>
                                <h5 style={{ textAlign: 'center' }}>Clear All Notifications</h5>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        } else {
            return (
                <div>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav>
                            {this.returnCorrectNotificationNumber(notifications)}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                <p style={{ textAlign: 'center' }}>You have no notifications</p>
                            </DropdownItem>

                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.returnCorrectNotificationMenu()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(NotificationBell);