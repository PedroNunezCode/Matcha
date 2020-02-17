import React, { Component } from 'react';
import { Provider, } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import './styles/main.scss';
/**
 * These will be the components that make up the whole page.
 */
import Header from './Components/shared/Header';
import Footer from './Components/shared/Footer';
import Login from './Components/Login';
import Register from './Components/Register';
import ValidateLogin from './Components/ValidateLogin';
import PasswordReset from './Components/PasswordReset';
import About from './Components/About';
import Profile from './Components/Profile';
import ConfirmPasswordReset from './Components/ConfirmPasswordReset';
import AuthenticatedLanding from './Components/Auth/AuthenticatedLanding';
import EmailAndLocation from './Components/EmailandLocation';
import CheckAccountActivity from './Components/CheckAccountActivity';
import BlockUserProfile from './Components/Auth/BlockUserProfile';

import { ProtectedRoute } from './Components/shared/Auth/ProtectedRoute';
import * as actions from './actions/authActions';
import {  getBasicDetails } from './actions/profileActions';
import ChangeEmailAddress from './Components/ChangeEmailAddress';
import VisitUserProfile from './Components/ProfileComponents/VisitUserProfile';
import ChatAndSearch  from './Components/Landing/Search/ChatAndSearch';


const store = require('./reducers').init();

class App extends Component {
	componentWillMount() {
		this.checkAuthState();
		this.getBasicDetails();
	}

	checkAuthState() {
		store.dispatch(actions.checkAuthState());
	}

	getBasicDetails(){
		if(store.getState().auth.isAuth){
			store.dispatch(getBasicDetails());
		}
	}

	render() {
		return (
			<Provider store={store}>
				<div>
					<Router>
						<Header />
						<Route path='/' exact component={AuthenticatedLanding} />
						<Route path='/login' exact component={Login} />
						<Route path='/register' exact component={Register} />
						<Route path='/validatelogin/:email/:token' exact component={ValidateLogin} />
						<Route path='/about' exact component={About} />
						<ProtectedRoute exact path='/profile' component={Profile} />
						<ProtectedRoute exact path='/editprofileinformation' component={EmailAndLocation} />
						<ProtectedRoute exact path='/changeuseremailaddress/:id/:token' component={ChangeEmailAddress} />
						<Route path='/forgotpassword' exact component={PasswordReset} />
						<Route path='/forgotpassword/:token/:email' exact component={ConfirmPasswordReset} />
						<ProtectedRoute exact path='/check-account-activity' component={CheckAccountActivity}/>
						<ProtectedRoute exact path='/userprofile/:profileId' component={VisitUserProfile}/>
						<ProtectedRoute exact path='/block-user-profile' component={BlockUserProfile}/>
						<ProtectedRoute exact path='/search' component ={ChatAndSearch} />
						<Footer />
					</Router>
				</div>
			</Provider>
		);
	}
}

export default App;
