import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { dislikeUser, likeUser } from '../../actions/profileActions';
import { connect } from 'react-redux';

class DisplayUserBrowser extends Component {

    dislikeUser = () => {
        const { userId } = this.props.auth;
        const { _id } = this.props.user;

        const data = {userId: userId, profileId: _id};
        dislikeUser(data)
            .then(() => {
                this.props.callback();
            })
    }

    likeUser = () => {
        // console.log(this.props.profile);
        const { profileId } = this.props.profile;
        const { _id, profileImage, firstName, lastName } = this.props.user;
        const data = {currentProfileId: profileId, likedProfileId: _id,  profileImage, firstName, lastName};

        this.props.dispatch(likeUser(data))
            .then(() => {
                this.props.callback();
            });
    }

    render() {

        const { user } = this.props;
        const { bio, _id } = user;
        const fullName = user.firstName + ' ' + user.lastName;


        return (
            <div className="user-profile-matching">
                <div className="display-profile-image-container">
                    <img style={{height: '100%', width: '100%'}} alt="user profiles" src={user.profileImage}/>
                </div>
                <div className="display-profile-stats-container">
                    <div className="display-profile-name-and-age">
                        <Link to={`/userprofile/${_id}`}><h3 style={{float:'left'}}>{fullName}, {user.age}</h3></Link>
                    </div>
                    <div className="display-profile-bio">
                        <p>{bio}</p>
                    </div>
                    <div className="display-profile-like-dislike-buttons-container">
                        <div className="display-profile-like-dislike-buttons">
                            <div style={{width: '50%'}}>
                                <i onClick={this.dislikeUser} style={{color: 'red'}} className="fa fa-times-circle responsive-browsing-icon"></i>
                            </div>
                            <div style={{width: '50%'}}>
                                <i onClick={this.likeUser} style={{color: '#F83A65'}}className="fa fa-heart responsive-browsing-icon"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        auth: state.auth,
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(DisplayUserBrowser);