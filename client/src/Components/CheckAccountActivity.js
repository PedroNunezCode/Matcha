import React, { Component } from 'react';
import { connect } from 'react-redux';

class CheckAccountActivity extends Component {

    renderHistory = () => {

        // console.log(this.props.profile.userHistory)

        const byDate = this.props.profile.userHistory.reverse();

        return byDate.map((history, key) => {

            if (history.reason === 'Visited your profile.') {
                return (
                    <div key={key} className="history-item">
                        <div style={{ display: 'inline-block', margin: 'auto' }}>
                            <img className="profile-panel-profile-image" src={history.profileImage} alt="current user profile" />
                            <h4>{history.fullName} visited your profile.</h4>
                        </div>
                    </div>
                )
            } else if (history.reason === 'liked your profile.') {
                return (
                    <div key={key} className="history-item">
                        <div style={{ display: 'inline-block', margin: 'auto' }}>
                            <img className="profile-panel-profile-image" src={history.profileImage} alt="current user profile" />
                            <h4>{history.firstName} {history.lastName} {history.reason}</h4>
                        </div>
                    </div>
                )
            } else if (history.reason === 'have liked eachother!') {
                return (
                    <div key={key} className="matched-history-item">
                        <div style={{ display: 'inline-block', margin: 'auto' }}>
                            <img className="profile-panel-profile-image" src={history.profileImage} alt="current user profile" />
                            <h4>You and {history.firstName} {history.lastName} matched.</h4>
                        </div>
                    </div>
                )
            } else if (history.reason === 'disconnected from you.') {
                return (
                    <div key={key} className="unmatched-history-item">
                        <div style={{ display: 'inline-block', margin: 'auto' }}>
                            <img className="profile-panel-profile-image" src={history.profileImage} alt="current user profile" />
                            <h4>{history.fistName} {history.lastName} disconnected from you.</h4>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div key={key} className="history-item">
                        <div style={{ display: 'inline-block', margin: 'auto' }}>
                            <img className="profile-panel-profile-image" src={history.profileImage} alt="current user profile" />
                            <h4>{history.reason} {history.firstName} {history.lastName}'s profile.</h4>
                        </div>
                    </div>
                )
            }
        });
    }

    render() {

        return (
            <div align="center" className="container">
                {this.renderHistory()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(CheckAccountActivity);