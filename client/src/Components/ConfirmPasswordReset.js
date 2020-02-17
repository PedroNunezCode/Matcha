import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/authActions';
import { Redirect } from 'react-router-dom';
 
class ConfirmPasswordReset extends Component {
  constructor(){
    super();

    this.state = {
      password: '',
      passwordV: '',
    }
    this.resetPassword = this.resetPassword.bind(this);
  }

  changeStateFromField = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  resetPassword = (event) =>{
    event.preventDefault();

    const data = {
        token: this.props.match.params.token,
        email: this.props.match.params.email,
        password: this.state.password,
        passwordV: this.state.passwordV
    }
    this.props.dispatch(actions.confirmPasswordReset(data));
  }

  checkAuthState = () => {
    const { isAuth } = this.props.auth;

    if(isAuth){
      return (
        <Redirect to="/profile"/>
      )
    }
  }

  render() {
    const { password, passwordV } = this.state;  
    return (
      <div className="password-reset-container">
        {this.checkAuthState()}
        <div className="container">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="text-center" style={{paddingTop:'20px'}}>
                    <h3><i style={{color:'red'}} className="fa fa-lock fa-5x lock-icon-color" /></h3>
                    <h2 className="text-center">Confirm Password Change</h2>
                    <div className="panel-body" style={{paddingTop:'20px'}}>
                      <form onSubmit={this.resetPassword}>
                        <div className="form-field">
                            <label className="form-field-label" htmlFor="password">New Password</label>
                            <input  onChange={this.changeStateFromField} type="password" id="password" className="form-field-input" placeholder="Enter new password" name="password" value={password} />
                        </div>
                        <div className="form-field">
                            <label className="form-field-label" htmlFor="passwordV">Confirm New Password</label>
                            <input  onChange={this.changeStateFromField} type="password" id="passwordV" className="form-field-input" placeholder="Confirm new password" name="passwordV" value={passwordV} />
                        </div>
                        <span className="input-group-addon"><i className="match-form glyphicon glyphicon-envelope color-blue"/></span>
                        
                        <button className="btn btn-danger" style={{marginTop: '10px'}}type="submit">Reset Password</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(ConfirmPasswordReset);