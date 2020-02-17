import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/authActions';
import { Redirect } from 'react-router-dom';


class PasswordReset extends Component {
  constructor(){
    super();

    this.state = {
      email: '',
    }
    this.resetPassword = this.resetPassword.bind(this);
  }

  changeStateFromField = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  resetPassword = (event) =>{
    event.preventDefault();

    const email = {
      email: this.state.email
    }
    this.props.dispatch(actions.resetPassword(email));
  }

  passwordEmailSent = (passwordResetEmailSent) => {
    if(passwordResetEmailSent){
      return(
        <div  className="alert alert-success">
          <p>We have sent you an email. Follow those instructions to reset your password.</p>
        </div>
      )
    }
  }

  render() {
    const { sentEmail, passwordResetEmailSent } = this.props.auth;
    const { email } = this.state;


    if (sentEmail) {
      return <Redirect to={{pathname: '/reglog', state: { successPassword: true }}} />
    }
    return (
      <div className="password-reset-container">
        <div className="container">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="text-center" style={{paddingTop:'20px'}}>
                    {this.passwordEmailSent(passwordResetEmailSent)}
                    <h3><i style={{color:'red'}} className="fa fa-lock fa-5x lock-icon-color" /></h3>
                    <h2 className="text-center">Forgot Password?</h2>
                    <p>Please provide your email:</p>
                    <div className="panel-body" style={{paddingTop:'20px'}}>
                      <form onSubmit={this.resetPassword}>
                        <div className="form-field">
                            <label className="form-field-label" htmlFor="email">Email</label>
                            <input  onChange={this.changeStateFromField} type="email" id="email" className="form-field-input" placeholder="Enter Email" name="email" value={email} />
                        </div>
                        <span className="input-group-addon"><i className="match-form glyphicon glyphicon-envelope color-blue"/></span>
                        
                        <button className="btn btn-danger" style={{marginTop: '10px', backgroundColor: '#FF0000'}}type="submit">Reset Password</button>
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

export default connect(mapStateToProps)(PasswordReset);