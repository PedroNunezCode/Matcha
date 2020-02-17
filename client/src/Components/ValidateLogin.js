import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/authActions';

class ValidateLogin extends Component {
	/**
	 * This function will handle all the necessary things for the confirmation of an email address.
	 */
	validateData = (e) => {
		const { email, token } = this.props.match.params;
		const data = { email: email, token: token };

		this.props.dispatch(actions.validateLogin(data));
	}

	componentDidMount() {
		this.validateData();
	}

	render() {

		const { verifiedAccount, errors } = this.props.auth;

		return (
			<div align="center" className="container">
				{ verifiedAccount && 
					<Redirect to={{
						pathname:'/profile',
						state: {verifiedAccount: true}
					}}/>
				}
				{
					errors.length > 0 && errors[0].description === 'Account already verified.' &&
					<div style={{width: '39vw', paddingBottom:'20px'}} align="center" className='container alert alert-danger'> 
                    	<p>Your account is already verified, Navigate to <Link to="/login">Login</Link> to access your account.
                    	</p>
                	</div>
				}
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		auth: state.auth
	}
}

export default connect(mapStateToProps)(ValidateLogin);