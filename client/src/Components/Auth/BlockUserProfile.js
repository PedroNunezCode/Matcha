import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import { blockUser } from '../../actions/profileActions';
import { Link } from 'react-router-dom';

class BlockUserProifle extends Component {

    state = {
        reasoning: '',
        redirect: false
    }

    updateReasoning = (event) => {
        this.setState({ reasoning: event.target.value })
    }

    blockUser = () => {

        const { user, profileIdToBeDeleted } = this.props.location.state;

        const { reasoning } = this.state;
        const data = {profileIdToBeDeleted, profileId: this.props.profile.profileId, reasoning, user};

        blockUser(data)
            .then((res) => { 
                if(res === 200){
                    toast.success(`Successfully blocked ${user.firstName} ${user.lastName}`);
                    setTimeout(() => {
                       this.setState({redirect: true}); 
                    }, 3000);
                }
            })
    }

    render() {
        const { user, profileIdToBeDeleted } = this.props.location.state;
        

        if(!this.props.auth.isAuth){
            return <Redirect to="/check-account-activity"/>
        }
        if(this.state.redirect){
            return <Redirect to="/check-account-activity" />
        }
        return (
            <div className="container block-user-wrapper">
                <ToastContainer/>
                <div className="row justify-content-md-center">
                    <div className="col col-lg-2"></div>
                    <div className="col-md-auto">
                        <img className="block-user-profile-image" src={user.profileImage} alt="Block user"></img>
                    </div>
                    <div className="col col-lg-2"></div>
                </div>
                <div className="block-user-body-wrapper">

                </div>
                <h2>You are about to <span style={{ color: 'red' }}>block</span> {user.firstName} {user.lastName}</h2>
                <h4 style={{ marginTop: '20px' }}>There is a couple things you should know:</h4>
                <ul style={{ marginTop: '40px', listStyleType: 'none', display: 'inline-block', textAlign: 'left' }}>
                    <li>1. If you simply want to disconnect, you can do <Link to={`/userprofile/${profileIdToBeDeleted}`}>that</Link> instead.</li>
                    <li>2. You will no longer be able to see eachother.</li>
                    <li>3. If connected, You will no longer be able to chat.</li>
                    <li>4. The user will no longer produce notifications.</li>
                    <li>5. Blocking the user, will also flag his account.</li>
                    <li>6. The blocked user will appear in your history.</li>
                    <li>7. All other history interactions will be removed.</li>
                </ul>
                <div style={{ marginTop: '60px', display: 'block'}} align="center">
                    <h2>Please provide reason:</h2>
                    <textarea className="block-user-text-area" onChange={this.updateReasoning}></textarea>
                    <button onClick={this.blockUser} style={{margin: 'auto', display: 'block', marginTop: '40px', marginBottom: '50px'}} disabled={this.state.reasoning.length < 1} className="btn btn-danger">Block User</button>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(BlockUserProifle);