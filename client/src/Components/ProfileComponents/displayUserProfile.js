import React, { Component } from 'react';
import ProfileImageCarousel from './profileImageCarousel';
import { reportAsFakeAccount, disconnectFromUser } from '../../actions/profileActions';
import { toast, ToastContainer } from 'react-toastify';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { likeUser } from '../../actions/profileActions';
import moment from 'moment';


class DisplayUserProfile extends Component {

    state = {
        isMatch: null,
        redirect: false,
    }

    renderInterests = () => {
        if (this.props.user.interests.length > 0) {
            return this.props.user.interests.map((interest, key) => {
                return <li key={key}>{interest}</li>
            })
        }
    }

    renderCorrespondingGender = () => {

        const { user: { gender } } = this.props;

        if (gender === 'male') {
            return (
                <div>
                    <i className="fa fa-male stats-font-size male-blue"> Male</i>
                </div>
            )
        } else if (gender === 'female') {
            return (
                <div>
                    <i className="fa fa-female stats-font-size female-pink"> Female</i>
                </div>
            )
        } else if (gender === 'other') {
            return (
                <div>
                    <i className="fa fa-genderless stats-font-size" style={{ color: '#BE4BDB' }}>ther</i>
                </div>
            )
        }
    }

    renderCorrespondingInterestedGender = () => {

        const { user: { interestedIn } } = this.props;

        if (interestedIn === 'men') {
            return (
                <div>
                    <i className="fa fa-male stats-font-size male-blue"> Men</i>
                </div>
            )
        } else if (interestedIn === 'women') {
            return (
                <div>
                    <i className="fa fa-female stats-font-size female-pink"> Women</i>
                </div>
            )
        } else if (interestedIn === 'both') {
            return (
                <div>
                    <span className="stats-font-size" style={{ color: '#BE4BDB' }}>B<i className="fa fa-genderless">th</i></span>
                </div>
            )
        }
    }

    renderCorrectLocation = () => {
        const { user } = this.props;

        if (user.customLocation) {
            return user.customLocation
        } else {
            return user.location.name
        }
    }

    disconnectFromUser = () => {
        const { id } = this.props;
        const { profileId } = this.props.profile;

        const data = { currentUserProfileId: profileId, profileIdToBeDeleted: id };

        this.props.dispatch(disconnectFromUser(data))
            .then(res => {
                if (res === 200) {
                    toast.success('Successfully disconnected from user');
                    setTimeout(() => {
                        this.setState({ redirect: true })
                    }, 2800);
                }
            })
    }

    checkProfileMatch = () => {
        const { id, currentUserMatches } = this.props;
        var match = false;

        if (currentUserMatches.length > 0) {
            //This for loop take care of mapping through the users matches to see if the two users are matched.
            for (var i = currentUserMatches.length - 1; i <= currentUserMatches.length - 1; i++) {
                if (currentUserMatches[i]._id.toString() === id) {
                    match = true;
                    break;
                }
            }
        }

        if (match) {
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>
                        <b>You are currently connected to this user. Clicking the button below will disconnect you from them and you will
                        no longer be able to send them messages or interact with them.
                        </b>
                    </p>
                    {!this.state.redirect &&
                        <button onClick={this.disconnectFromUser} className="btn btn-danger">Disconnect from user.</button>
                    }
                </div>
            )
        } else {
            return (
                <div>
                </div>
            )
        }
    }

    reportFakeAccount = () => {
        const { username } = this.props.user;

        reportAsFakeAccount(username)
            .then((res) => {
                if (res === 200) {
                    toast.success('User account has been flagged. Thanks for your feedback.')
                }
            })
    }

    checkIfUserIsLiked = () => {


    }

    likeUser = () => {
        const { profileId } = this.props.profile;
        const { profileImage, firstName, lastName } = this.props.user;
        const { id } = this.props;
        
        const data = { currentProfileId: profileId, likedProfileId: id, profileImage, firstName, lastName };

        this.props.dispatch(likeUser(data))
            .then(() => {
                toast.success('Successfully like the user.');
                setTimeout(() => {
                    this.setState({ likedUser: true });
                }, 3000);
            });
    }

    renderLikeButton = () => {
        const { id } = this.props;
        const { liked } = this.props.profile;

        const likedProfile = liked.includes(id);

        if (!likedProfile && !this.state.likedUser) {
            return (
                <div style={{ marginTop: '10px' }} className="container" align="center">
                    <button className="btn like-user-from-profile-button" onClick={this.likeUser}>
                        Like User <i className="fa fa-thumbs-up"></i>
                    </button>
                    <p style={{ marginTop: '5px' }}>By clicking the "Like User" button, You will attemp to connect to this user.</p>
                </div>
            )
        }else{
            return (
                <div  style={{ marginTop: '10px' }} className="container" align="center">
                    <p style={{color: 'green'}}> You have already liked this user.</p>
                </div>
            )
        }


    }

    renderCorrectStatus = () => {

        const { lastOnline } = this.props.user;
        const currentTime = moment().utc();
        const lastLogin = moment(lastOnline);
        let hours = lastLogin.diff(currentTime, 'hours');
        const date = lastLogin.format('MMM Do YY');
        
        if(hours === 0){
            return (
                <div style={{paddingBottom: '10px'}}>
                    <p style={{color: 'green'}}>User is currently online.</p>
                </div>
            )
        }else{
            return (
                <div style={{paddingBottom: '10px'}}>
                    <p style={{color: 'green'}}>Last Login: {date}</p>
                </div>
            )
        }
    }

    render() {
        const { user, id } = this.props;

        if (this.state.redirect) {
            return <Redirect to='/check-account-activity' />
        }

        return (
            <div className="container">
                <ToastContainer autoClose={2500} />
                <div className="row">
                    <div className="col-lg-6">
                        <ProfileImageCarousel userInformation={this.props.user} />
                        {this.renderLikeButton()}
                    </div>
                    <div className="col-lg-6">
                        <div className="profile-information-wrapper">
                            <h1 style={{ textDecoration: 'underline' }}>{user.firstName} {user.lastName}</h1>
                            <p>({user.username})</p>
                            {this.renderCorrectStatus()}
                            <h6>Gender: {this.renderCorrespondingGender()}</h6>
                            <br></br>
                            <h6>Interested in: {this.renderCorrespondingInterestedGender()}</h6>
                            <br></br>
                            <h6>Location: {this.renderCorrectLocation()}</h6>
                            <br></br>
                            <h4>{user.bio}</h4>
                            <br></br>
                            <h4>Age: {user.age}</h4>
                            <br></br>
                            <h4>Fame Rating: {user.fameRating}</h4>
                            <br></br>
                            <div className="profile-section-interests">
                                <h4>Interests: </h4>
                                <div >
                                    <ul>
                                        {this.renderInterests()}
                                    </ul>
                                </div>
                            </div>
                            {this.checkProfileMatch()}
                        </div>
                    </div>

                </div>

                <div style={{ textAlign: 'center', paddingTop: '25vh', paddingBottom: '5vh' }}>
                    <ul style={{ listStyleType: 'none' }}>
                        <li style={{ display: 'inline' }}><Link to={{ pathname: '/block-user-profile', state: { user: user, profileIdToBeDeleted: id } }} className="block-account-button" >Block User</Link></li>
                        <li className="report-fake-account-button" onClick={this.reportFakeAccount}>Report Fake Account</li>
                    </ul>

                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile
    }
}

export default connect(mapStateToProps)(DisplayUserProfile);