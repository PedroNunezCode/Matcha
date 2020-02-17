import React, { Component } from 'react';
import { connect } from "react-redux";

import FindTheOne from '../FindTheOne';
import LandingPage from '../LandingPage';

class AuthenticatedLanding extends Component {

    returnCorrespondingLandingPage = () => {
        const { isAuth } = this.props.auth;

        if (isAuth) {
			return (
				<FindTheOne/>
			)
		} else {
			return (
				<LandingPage/>
			)
		}
    }

    render() {
        return (
            <div>
                {this.returnCorrespondingLandingPage()}
            </div>
        );
    }
}

function stateToProps(state){
    return {
        auth: state.auth
    }
}

export default connect(stateToProps)(AuthenticatedLanding);