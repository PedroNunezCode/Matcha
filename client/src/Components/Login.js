import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/authActions';

class Login extends Component {
	constructor() {
		super();

		this.state = {
			email: '',
			password: '',
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();



		this.props.dispatch(actions.login(this.state));
	}

	changeInputState = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	checkAuthState = () => {
		const { isAuth } = this.props.auth;
		if (isAuth) {
			return <Redirect to='/profile' />
		}
	}

	renderErrors = (desc) => {
		return (
			<div style={{ width: '39vw' }} className="alert alert-danger">
				<p>{desc}</p>
			</div>
		)

	}

	checkRedirectState = () => {
		if (this.props.location.state && this.props.location.state.successfullRegister) {
			return (
				<div style={{ width: '39vw' }} className='alert alert-success'>
					<p>You have successfully registered! Please verify your account. We sent you an email.</p>
				</div>
			)
		} else if (this.props.location.state && this.props.location.state.reason) {
			return (
				<div style={{ width: '39vw' }} className='alert alert-danger'>
					<p>{this.props.location.state.reason}</p>
				</div>
			)
		}
	}

	render() {
		const { email, password } = this.state;
		const { errors } = this.props.auth;
		return (
			<div align="center" className="container">
				{this.checkAuthState()}
				<div className="Register-form">
					<div className="form-title">
						<Link style={{ textDecoration: 'none', color: 'red' }} to="/login" className="form-title-link form-title-link-active">Sign In </Link>
						or <Link style={{ textDecoration: 'none', color: 'red' }} to='/register' className="form-title-link">Sign Up</Link>
					</div>
					<div className="form-center">
						<form className="form-field" onSubmit={this.handleSubmit}>
							<div className="form-field">
								{this.checkRedirectState()}
								{errors.length > 0 &&
									this.renderErrors(errors[0].description)
								}
								<label className="form-field-label" htmlFor="email">Email</label>
								<input onChange={this.changeInputState} type="email" id="email" className="form-field-input" placeholder="Enter Email Address" name="email"
									value={email} />
							</div>

							<div className="form-field">
								<label className="form-field-label" htmlFor="password">Password</label>
								<input onChange={this.changeInputState} type="password" id="password" className="form-field-input" placeholder="Enter Password" name="password"
									value={password} />
							</div>

							<div className="form-field">
								<button type="submit" className="form-field-button">Login</button>
								<Link style={{ textDecoration: 'none' }} to="/register" className="form-field-link">Create an account</Link>
							</div>
							<div align="center">
								<Link style={{ color: 'black' }} to='/forgotpassword'>Forgot Password?</Link>
							</div>
						</form>
					</div>

				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	}
}

export default connect(mapStateToProps)(Login);