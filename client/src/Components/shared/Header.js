import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/authActions';
import NotificationBell from '../Notifications/NotificationBell';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavLink,
	NavItem,
} from 'reactstrap';

import MatchaHeart from '../../images/MatchaHeart.png';


class Header extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);

		this.state = {
			isOpen: false,
		}
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}

	renderAuthButtons = () => {
		const { isAuth, username } = this.props.auth;


		if (!isAuth) {
			return (
				<div className="responsive-header">
					<NavItem>
						<NavLink className="header-nav-link-mobile" href="/about">About</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="header-nav-link-mobile" href="/login">Login</NavLink>
					</NavItem>
				</div>

			)
		} else {
			return (
				<div className="responsive-header">
					<NotificationBell/>
					<NavItem>
						<NavLink className="header-nav-link-mobile" href="/" style={{ color: 'red' }}>Find The One</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="header-nav-link-mobile" href="/profile">{username}</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="header-nav-link-mobile" ><div style={{ cursor: 'pointer' }} onClick={this.logout}>Logout</div></NavLink>
					</NavItem>
				</div>

			)
		}
	}

	logout = () => {
		this.props.dispatch(actions.logout())
	}

	render() {
		return (
			<div>
				<Navbar color="transparent" className="port-navbar port-default absolute" light expand="md">
					<NavbarBrand href="/">
						<div className="navbar-brand">
							<img src={MatchaHeart} height="50" width="100" alt="matcha logo" style={{ paddingRight: '5px' }}></img>
							<span style={{ color: 'red', fontSize: '35px', fontFamily: 'Dancing Script, cursive' }}>Matcha</span>
						</div>
					</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />

					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							{this.renderAuthButtons()}
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		profile: state.profile
	}
}

export default connect(mapStateToProps)(Header);