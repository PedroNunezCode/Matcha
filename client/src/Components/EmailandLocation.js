import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentProfileById, changeUserDetails, sendUserEmailChange } from '../actions/profileActions';
import { toast, ToastContainer } from 'react-toastify';

class EmailandLocation extends Component {
    constructor() {
        super();

        this.state = {
            userInformation: [],
            firstName: '',
            lastName: '',
            location: '',
            success: false,
            emailSent: false
        }
    }

    componentDidMount() {
        this.getUserInformation();
    }

    getUserInformation = () => {
        getCurrentProfileById(this.props.auth.userId)
            .then(res => {
                if (res.customLocation) {
                    return this.setState({ userInformation: res, firstName: res.firstName, lastName: res.lastName, location: res.customLocation });
                } else {
                    this.setState({ userInformation: res, firstName: res.firstName, lastName: res.lastName, location: res.location });
                }
            });
    }

    handleChange = (event) => {
        if (this.state.success === true) {
            this.setState({ success: false })
        }
        this.setState({ [event.target.name]: event.target.value });
    }

    displaySaveButton = () => {
        const { firstName, lastName } = this.state.userInformation;
        let location;
        if(this.state.userInformation.customLocation){
            location = this.state.userInformation.customLocation;
        }else{
            location = this.state.userInformation.location.name;
        }

        if (this.state.firstName !== firstName || this.state.lastName !== lastName || location !== this.state.location ) {
            return (
                <div style={{ textAlign: 'center', paddingTop: '15px' }}>
                    <button onClick={this.sendChangesToDb} className="btn update-information-button">Update Information</button>
                </div>

            )
        } else {
            return (<div></div>)
        }
    }

    sendChangesToDb = () => {
        const details = {
            first: this.state.firstName,
            last: this.state.lastName,
            location: this.state.location,
            id: this.state.userInformation._id
        };

        changeUserDetails(details)
            .then(res => {
                if (this.state.location === res.customLocation) {
                    this.getUserInformation();
                    this.setState({ success: true })
                }
            });
    }

    checkSuccessStatus = () => {
        if (this.state.success) {
            return (
                <div style={{ width: '100%', paddingBottom: '20px' }} align="center" className="alert alert-success">
                    <p>Successfully changed profile information</p>
                </div>
            )
        }
    }

    changeEmailSend = () => {
        if (this.state.emailSent) {
            toast.error('We already sent you an email.');
        } else {
            sendUserEmailChange(this.props.auth.userId)
                .then(res => {
                    if (res === 200) {
                        this.setState({ emailSent: true });
                        toast.success('An email has been sent.');
                    }
                });
        }

    }

    render() {
        if (this.state.userInformation.length === 0) {
            return (
                <div></div>
            )
        } else {
            const { firstName, lastName, location } = this.state;
            return (
                <div className="container email-location-wrapper">
                    <ToastContainer />
                    <h1 align="center" style={{}}><b><u>Edit Profile Information</u></b></h1>
                    <div>

                        {this.checkSuccessStatus()}
                    </div>
                    <div className="full-name-change-wrapper">


                        <div className="align-full-name-forms">
                            <div className="align-input-mobile">

                                <label className="form-field-label edit-information-label" htmlFor="firstName">First Name</label>
                                <input style={{ textAlign: "center" }} onChange={this.handleChange} type="text" className="form-field-input" name="firstName" value={firstName}></input>
                            </div>
                            <div className="align-input-mobile">
                                <label className="form-field-label edit-information-label" htmlFor="firstName">Last Name</label>
                                <input style={{ textAlign: "center" }} onChange={this.handleChange} type="text" id="firstName" className="form-field-input" value={lastName} name="lastName"></input>
                            </div>
                        </div>
                    </div>

                    <div className="change-location-wrapper">
                        <label className="form-field-label edit-information-label" htmlFor="location">Location</label>
                        <input style={{ textAlign: "center" }} name="location" onChange={this.handleChange} type="text" value={location} className="form-field-input"></input>
                        <p style={{ fontSize: '10px', paddingTop: '6px', color: 'red' }}>Please note that matcha is currently handling your location. By inputing your own location, Matcha will no longer keep track
                            of city / state changes. You will manually have to change it every time.
                    </p>
                    </div>

                    {this.displaySaveButton()}

                    <div className="change-email-container">
                        <button onClick={this.changeEmailSend} className="btn custom-change-email-button">Change Email Address</button>
                        <p style={{ paddingTop: '7px' }}>We will send you an email to confirm this action.</p>
                    </div>

                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(EmailandLocation);