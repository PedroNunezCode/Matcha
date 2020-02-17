import React, { Component } from 'react';
import { visitUsersProfile } from '../../actions/profileActions';
import LoadingAnimation from '../../services/loadingAnimation';
import { connect } from 'react-redux';
import DisplayUserProfile from './displayUserProfile';
import BlockedUser from './blockedUser';
import 'moment-timezone';

class VisitUserProfile extends Component {

    state = {
        userProfile: [],
    }

    componentWillReceiveProps(props) {
        if (this.state.userProfile.length === 0) {

            const { match: { params } } = this.props;
            const { profileId, userProfileImage, fullName } = props.profile;
            const data = { visitorProfileId: profileId, profileImage: userProfileImage, fullName: fullName, id: params.profileId };

            visitUsersProfile(data)
                .then((res) => {
                    this.setState({ userProfile: res });
                });
        }
    }

    componentDidMount() {
        const { profileId } = this.props.profile;

        if (this.state.userProfile.length === 0 && profileId !== "") {

            const { match: { params } } = this.props;
            const { profileId, userProfileImage, fullName } = this.props.profile;
            const data = { visitorProfileId: profileId, profileImage: userProfileImage, fullName: fullName, id: params.profileId };

            visitUsersProfile(data)
                .then((res) => {
                    this.setState({ userProfile: res });
                });
        }
    }

    isUserBlocked =  () => {
        const { match : { params } } = this.props;
        const id = params.profileId;
        const { blockedMyProfile } = this.props.profile;

        const blocked = blockedMyProfile.includes(id);
        if(blocked){
            return true;
        }else{
            return false;
        }
    }

    render() {
        if (this.state.userProfile.length === 0) {
            return <LoadingAnimation />
        }

        if(this.props.profile.blockedMyProfile.length > 0){
            const blocked = this.isUserBlocked();

            if(blocked){
                return <BlockedUser/>
            }
        }

        const { match: { params } } = this.props;

        return (
            <div>
                <DisplayUserProfile user={this.state.userProfile} id={params.profileId} currentUserMatches={this.props.profile.matches}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile
    }
}

export default connect(mapStateToProps)(VisitUserProfile);