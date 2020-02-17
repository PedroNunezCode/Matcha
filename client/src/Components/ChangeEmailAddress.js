import React, { Component } from 'react';
import { getCurrentUserInformation } from '../actions/profileActions';
import { connect } from "react-redux";
import { changeEmailAddress } from "../actions/profileActions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from "react-router-dom";
import DisplayResponse from "./shared/displayResponse";

class ChangeEmailAddress extends Component {
    constructor() {
        super();

        this.state = {
            userInformation: [],
            newEmail: '',
            confirmNewEmail: '',
        }
    }

    componentDidMount() {
        this.getUserInformation();
    }

    getUserInformation = () => {
        getCurrentUserInformation(this.props.auth.userId)
            .then(res => this.setState({ userInformation: res }));
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    updateEmailAddress = () => {
        const { newEmail, confirmNewEmail } = this.state;

        if (newEmail !== confirmNewEmail) {
            toast.error('Emails don\'t match...');
        } else if (newEmail === this.state.userInformation.email) {
            toast.error('You requested an email change. Now change it...')
        } else {
            const data = { newEmail: newEmail, id: this.props.auth.userId, token: this.props.match.params.token };
            this.props.dispatch(changeEmailAddress(data))
        }
    }

    checkForRedirect = () => {
        if (this.props.auth.changedEmailAddress) {
            return <Redirect to="/profile" />
        }
    }

    render() {
        if (this.state.userInformation.length === 0) return (<div></div>);
        const { newEmail, confirmNewEmail } = this.state;
        const { errors } = this.props.auth;

        return (
            <div className="container">
                {this.checkForRedirect()}
                <ToastContainer />
                <div className="change-email-address-wrapper">
                    <i className="fa fa-paper-plane fa-4x"></i>
                    <h1><b>Change Email Address</b></h1>
                    <br></br>
                    <p><b>You're current email address is: {this.state.userInformation.email}</b></p>
                    <div align="center">
                        {errors.length > 0 &&
                            <DisplayResponse errors={errors} />
                        }
                    </div>

                    <div className="align-input-mobile">
                        <label className="form-field-label edit-information-label">New Email Address</label>
                        <input name="newEmail" style={{ textAlign: "center" }} onChange={this.handleChange} type="text" className="form-field-input" value={newEmail} ></input>
                    </div>
                    <div className="align-input-mobile">
                        <label className="form-field-label edit-information-label">Confirm New Email Address</label>
                        <input name="confirmNewEmail" style={{ textAlign: "center" }} onChange={this.handleChange} type="text" className="form-field-input" value={confirmNewEmail} ></input>
                    </div>
                    <div style={{ paddingTop: '50px' }}>
                        <button onClick={this.updateEmailAddress} className="btn update-email-btn">Update Email</button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(ChangeEmailAddress);