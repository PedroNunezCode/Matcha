import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions/authActions';
import DisplayResponse from './shared/displayResponse';

class Register extends Component {

	constructor() {
		super();

		this.state = {
			username: '',
			email: '',
			password: '',
			passwordV: '',
			firstName: '',
			lastName: '',
			gender: 'Select Gender'
		}
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.dispatch(actions.register(this.state));
	}

	changeInputState = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	changeGenderSelection = (e) => {
		this.setState({ gender: e.target.value });
	}

	checkForErrors = () => {
		const { errors } = this.props.auth;

		if (errors.length > 0) {
			return (
				<DisplayResponse errors={errors} />
			)
		}
	}

	render() {
		const { successfullRegister } = this.props.auth;
		const { username, email, password, passwordV, gender, firstName, lastName } = this.state;

		return (
			<div style={{ paddingBottom: '70px' }} align="center" className="container">
				{/* <Navbar/> */}
				<div className="Divive-Screen"></div>
				<div className="Register-form">
					{/* This div helps the page stay in place */}
					<div className="page-switcher">
					</div>
					{/* Navigation buttons on screen */}
					<div className="form-title">
						<Link style={{ textDecoration: 'none', color: 'red' }} to="/login" className="form-title-link">Sign In </Link> or <Link style={{ textDecoration: 'none', color: 'red' }} to="/register" className="form-title-link form-title-link-active">Sign Up</Link>
					</div>

					{/* Forms */}
					<div className="form-center">
						<form className="form-field" onSubmit={this.handleSubmit}>
							<div className="form-field">
								{successfullRegister &&
									<Redirect to={{
										pathname: '/login',
										state: { successfullRegister: true }
									}} />
								}
								<label className="form-field-label" htmlFor="username">Username</label>
								<input onChange={this.changeInputState} type="text" id="username" className="form-field-input" placeholder="Enter Username" name="username" value={username} required />
							</div>

							<div className="form-field">
								<label className="form-field-label" htmlFor="firstName">First Name</label>
								<input onChange={this.changeInputState} type="text" id="firstName" className="form-field-input" placeholder="Enter Fisrt Name" name="firstName" value={firstName} required />
							</div>
							<div className="form-field">
								<label className="form-field-label" htmlFor="lastName">Last Name</label>
								<input onChange={this.changeInputState} type="text" id="lastName" className="form-field-input" placeholder="Enter Last Name" name="lastName" value={lastName} required />
							</div>
							<div className="form-field">
								<label className="form-field-label" htmlFor="email">Email Address</label>
								<input onChange={this.changeInputState} type="text" id="email" className="form-field-input" placeholder="Enter Valid Email" name="email" value={email} required />
							</div>

							<div className="form-field">
								<label className="form-field-label" htmlFor="password">Password</label>
								<input onChange={this.changeInputState} type="password" id="password" className="form-field-input" placeholder="Enter Password" name="password" value={password} required />
							</div>

							<div className="form-field">
								<label className="form-field-label" htmlFor="passwordV">Confirm Password</label>
								<input onChange={this.changeInputState} type="password" id="passwordV" className="form-field-input" placeholder="Enter Password" name="passwordV" value={passwordV} required />
							</div>
							<div className="form-field custom-select-dropdown">
								<label className="form-field-label" htmlFor="passwordV">Gender</label>
								<select value={gender} onChange={this.changeGenderSelection} required>
									<option value="selectGender"> Select Gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="other">other</option>
								</select>
							</div>
							<div>
								{this.checkForErrors()}
							</div>
							{/* Reister button */}
							<div className="form-field">
								<button type="submit" className="form-field-button">Sign Up</button> <Link style={{ textDecoration: 'none' }} to="/login" className="form-field-link">I'm already a member</Link>
							</div>

						</form>
					</div>
				</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		auth: state.auth
	}
}
export default connect(mapStateToProps)(Register);