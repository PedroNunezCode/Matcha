import React, { Component } from 'react';
import {
    changeUserBio, getCurrentProfileById, changeUsersLocation,
    changeProfileImage, uploadImage, makeProfileImage, uploadInterest,
    deleteInterest, changeAge, getBasicDetails
} from '../actions/profileActions';
import { getCurrentLocation } from "../actions/authActions";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CorrectGender } from '../services/correctGender';
import InterestedIn from '../services/interestedIn';
import '../customhover.css';
import LoadingAnimation from '../services/loadingAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { locationsEqual } from '../util/location';

class Profile extends Component {

    constructor(props) {
        super(props);

        this.getUserProfile();
        this.state = {
            userInformation: {},
            bio: '',
            hasChangedTheirLocation: false,
            location: '',
            selectedProfileImage: null,
            interest: '',
            ageOptions: [
                18, 19,
                20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
                50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
                70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
                80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
                90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
                100.]
        }
    }

    componentDidUpdate(){
        if (!this.state.userInformation.customLocation) {
            this.getUsersLocation();
            this.updateUsersLocation();
        }
    }

    getUserProfile = () => {
        getCurrentProfileById(this.props.auth.userId)
            .then(res => {
                this.setState({ userInformation: res, bio: res.bio });
            });
    }

    getUsersLocation = () => {
        const { coordinates }= this.props.location;
        if (coordinates.length === 0)
            this.props.dispatch(getCurrentLocation());
    }

    updateUsersLocation = () => {
        const currentLocation = this.props.location;
        const { location } = this.state.userInformation;
        const { userId } = this.props.auth;

        if (!locationsEqual(location, currentLocation) && currentLocation.name > 3) {
            const locationToSave = { name: currentLocation.name, coordinates: currentLocation.coordinates };
            changeUsersLocation({ location: locationToSave, userId })
                .then(res => {
                    if (location.name !== currentLocation.name) {
                        this.getUserProfile();
                    }
                })
        }
    }

    checkValidation = () => {
        if (this.props.location.state && this.props.location.state.verifiedAccount === true) {
            return (
                <div style={{ width: '39vw', paddingBottom: '20px' }} align="center" className='container alert alert-success'>
                    <p>Your account was verified. Please start by updating as much as your profile as you can. If you don't have an image,
                        you will not be able to interact with the community.
                    </p>
                </div>
            )
        }
    }

    updateBiography = (event) => {
        const { value } = event.target;
        this.setState({ bio: value });
    }

    changeBio = () => {
        const { bio } = this.state;
        const { userId } = this.props.auth;

        const data = { bio, userId };
        changeUserBio(data)
            .then(res => {
                if (res === bio) {
                    this.getUserProfile();
                }
            });

    }

    checkBioDifference = () => {
        const { bio } = this.state;
        if (bio !== this.state.userInformation.bio) {
            return (
                <div className="bio-button-wrapper">
                    <button onClick={this.changeBio} className="btn btn-success bio-change-button">Update Biography</button>
                </div>

            )
        }
    }

    recieveDataFromInterestedComponent = (dataFromChild) => {
        if (dataFromChild) {
            this.getUserProfile();
        }
    }

    renderLocation = () => {
        let { location } = this.state.userInformation;

        location = location || {};
        if (this.state.userInformation.customLocation) {
            return (
                <i className="fa fa-compass stats-font-size"> {this.state.userInformation.customLocation}</i>
            )
        } else {
            return (
                <i className="fa fa-compass stats-font-size"> {location.name}</i>
            )
        }
    }

    changeProfileImage = (event) => {
        if (event.target.files) {
            const selectedImage = event.target.files[0];
            this.setState({ selectedProfileImage: selectedImage });
        }
    }

    checkProfileImage = () => {
        const { selectedProfileImage } = this.state;

        if (selectedProfileImage !== null) {
            const { _id } = this.state.userInformation;
            const data = { image: selectedProfileImage, id: _id };
            changeProfileImage(data)
                .then(() => {
                    this.setState({ selectedProfileImage: null })
                    this.getUserProfile();
                })
                .then(() => {
                    toast.success('You\'re profile image was updated!');
                });
        }
    }

    renderCorrectProfileImage = () => {
        const { profileImage } = this.state.userInformation;

        if (profileImage) {
            return (
                <img className="profile-image-styling"
                    src={profileImage}
                    alt="profile images" />
            )
        } else {
            return (
                <img className="profile-image-styling"
                    src="http://www.buckinghamandcompany.com.au/wp-content/uploads/2016/03/profile-placeholder-300x300.png"
                    alt="profile images" />
            )
        }
    }

    changeOtherProfileImage = (event) => {
        const number = event.target.name;
        const index = Number(number);

        const data = { image: event.target.files[0], number: index, id: this.state.userInformation._id };

        uploadImage(data)
            .then(() => {
                this.getUserProfile()
            })
    }

    makeProfileImage = (event) => {
        const selectedImage = event.target.id;

        if (!this.state.userInformation[selectedImage]) {
            toast.error('You need to upload an image first!');
        } else if (!this.state.userInformation.profileImage) {
            toast.error('Please upload profile image before you attempt to change your profile image.');
        } else {
            makeProfileImage({ image: this.state.userInformation[selectedImage], id: this.state.userInformation._id, index: selectedImage })
                .then(() => {
                    this.getUserProfile();
                })
        }
    }

    renderCorrectProfileImages = (index) => {

        const imageIndex = `profileImage${index}`;

        if (!this.state.userInformation[imageIndex]) {
            return (
                <img className="other-profile-images-styling" src="http://www.buckinghamandcompany.com.au/wp-content/uploads/2016/03/profile-placeholder-300x300.png"
                    alt="profile images" />
            )
        } else {
            return (
                <img className="other-profile-images-styling" src={this.state.userInformation[imageIndex]} alt="profile images" />
            )
        }

    }

    inputInterestChange = (event) => {
        const { value } = event.target;

        this.setState({ interest: value });
    }

    addInterestToUserProfile = () => {
        const { interest } = this.state;
        /**
         * I need to map the array of interest here. If the interest already exists in the array. Then it should not be submitted.
         */
        if (!interest) {
            toast.error('Input interest before you attempt to add it to you list.');
        } else {
            uploadInterest({ interest: interest, id: this.state.userInformation._id })
                .then(() => {
                    this.setState({ interest: '' });
                    this.getUserProfile();
                })
        }
    }

    changeAge = (event) => {

        const { value } = event;
        const { profileId } = this.props.profile;

        const data = { value, profileId };
        changeAge(data)
            .then(() => {
                toast.success('Age changed successfully');
            })
    }

    displayInterests = () => {

        const { interests } = this.state.userInformation;

        if (interests) {
            return (
                interests.map((interest, key) => {
                    return (
                        <li style={{ display: 'inline', paddingLeft: '10px' }} id={interest} className="interest-wrapper" key={key}>{interest}
                            <i id={interest} style={{ paddingLeft: '10px' }} className="fa fa-times-circle delete-interest-icon" onClick={this.deleteInterest}></i></li>
                    )
                })
            )
        }
    }

    deleteInterest = (event) => {
        const { id } = event.target;
        const { _id } = this.state.userInformation;

        deleteInterest({ interest: id, id: _id })
            .then(() => {
                this.getUserProfile();
            });
    }

    componentWillMount(){
        this.props.dispatch(getBasicDetails());
    }

    render() {
        if (this.state.userInformation.length === 0) {
            return (
                <div>
                    <LoadingAnimation />
                </div>
            )
        }

        const { gender, fameRating, interestedIn } = this.state.userInformation;
        const { age } = this.props.profile;
        const { bio } = this.state;

        if (!this.props.auth.isAuth) {
            return <Redirect to='/login' />
        } else {
            return (
                <div className="container" style={{ paddingBottom: '130px' }}>
                    {this.checkValidation()}
                    <ToastContainer />
                    <div className="row">
                        {/* Profle image */}
                        <div align="center" className="col-md-12">
                            <div id="profile-image-container">
                                {this.renderCorrectProfileImage()}
                                {this.checkProfileImage()}
                                <div id="change-profile-image-button">
                                    <label htmlFor="upload" className="change-profile-image-label">
                                        <span aria-hidden="true">Change profile photo</span>
                                        <input type="file" id="upload" style={{ display: 'none' }} accept='.jpg, .png, .jpeg' onChange={this.changeProfileImage} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Other profile images */}
                    <div className="row" style={{ paddingTop: '30px' }}>
                        <div align="center" className="col-md-3">
                            <div id="other-profile-images-container">
                                {this.renderCorrectProfileImages(0)}
                                <div id="change-other-images-button">
                                    <label htmlFor="first" className="change-profile-image-label">
                                        <span aria-hidden="true">Edit</span>
                                        <input type="file" id="first" name="0" style={{ display: 'none' }} accept='.jpg, .png, .jpeg' onChange={this.changeOtherProfileImage} />
                                    </label>
                                </div>
                                <div onClick={this.makeProfileImage} id="change-other-images-button-right">
                                    <label htmlFor="makefirstprofile" className="change-profile-image-label">
                                        <span id="profileImage0" aria-hidden="true">Make profile</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div align="center" className="col-md-3">
                            <div id="other-profile-images-container">
                                {this.renderCorrectProfileImages(1)}
                                <div id="change-other-images-button">
                                    <label htmlFor="second" className="change-profile-image-label">
                                        <span aria-hidden="true">Edit</span>
                                        <input type="file" id="second" name="1" style={{ display: 'none' }} accept='.jpg, .png, .jpeg' onChange={this.changeOtherProfileImage} />
                                    </label>
                                </div>
                                <div onClick={this.makeProfileImage} id="change-other-images-button-right">
                                    <label htmlFor="makesecondprofile" className="change-profile-image-label">
                                        <span id="profileImage1" aria-hidden="true">Make profile</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div align="center" className="col-md-3">
                            <div id="other-profile-images-container">
                                {this.renderCorrectProfileImages(2)}
                                <div id="change-other-images-button">
                                    <label htmlFor="thrid" className="change-profile-image-label">
                                        <span aria-hidden="true">Edit</span>
                                        <input type="file" id="thrid" name="2" style={{ display: 'none' }} accept='.jpg, .png, .jpeg' onChange={this.changeOtherProfileImage} />
                                    </label>
                                </div>
                                <div onClick={this.makeProfileImage} id="change-other-images-button-right">
                                    <label htmlFor="makethridprofile" className="change-profile-image-label">
                                        <span id="profileImage2" aria-hidden="true">Make profile</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div align="center" className="col-md-3">
                            <div id="other-profile-images-container">
                                {this.renderCorrectProfileImages(3)}
                                <div id="change-other-images-button">
                                    <label htmlFor="fourth" className="change-profile-image-label">
                                        <span aria-hidden="true">Edit</span>
                                        <input type="file" id="fourth" name="3" style={{ display: 'none' }} accept='.jpg, .png, .jpeg' onChange={this.changeOtherProfileImage} />
                                    </label>
                                </div>
                                <div onClick={this.makeProfileImage} id="change-other-images-button-right">
                                    <label htmlFor="makefourthprofile" className="change-profile-image-label">
                                        <span id="profileImage3" aria-hidden="true">Make profile</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* User stats sections */}
                    <div className="row user-profile-statistics" align="center">
                        <div className="col-6 col-sm-3">
                            <label className="user-profile-stats-titles" htmlFor="gender"><span className="hint--top hint-info hint--medium"
                                aria-label="Once you select your gender, You cannot change it. ">Your Gender:</span></label>
                            <CorrectGender gender={gender} />
                        </div>
                        <div className="col-6 col-sm-3">
                            <label className="user-profile-stats-titles" htmlFor="interested"><span className="hint--top hint-info hint--medium"
                                aria-label="Once you select your choice, You cannot change it. ">Interested In:</span></label>
                            <InterestedIn interestedIn={interestedIn} callbackFunction={this.recieveDataFromInterestedComponent} />
                        </div>
                        <div className="col-6 col-sm-3">
                            <label className="user-profile-stats-titles" htmlFor="fame-rating"><span className="hint--top hint-info hint--medium"
                                aria-label="Fame rating will change depending on interactions with people. ">Fame Rating:</span></label>
                            <i className="stats-font-size" style={{ color: '#FFD700' }}>{fameRating}</i>
                        </div>
                        <div className="col-6 col-sm-3">
                            <label className="user-profile-stats-titles" htmlFor="location"><span className="hint--top hint-info hint--medium"
                                aria-label="Your location will change depending in what city you're located in.">Location:</span></label>
                            {this.renderLocation()}
                        </div>
                    </div>
                    {/* Select Age */}
                    <div style={{ marginTop: '40px', marginBottom: '20px' }} className="select-age-wrapper" align="center">
                        <label htmlFor="biography" className="biography-input-container"><span className="hint--top hint-info hint--large stats-font-size hint--rounded"
                            aria-label="You can change your biography by clicking on the form below, making the desired changes, and clicking the submit button.">
                            <FontAwesomeIcon color="black" size="1x" icon={faCalendarAlt} /> Select Age:</span></label>
                        <Dropdown className="age-select-dropdown" options={this.state.ageOptions} onChange={this.changeAge} value={age ? age.toString() : null} placeheolder="Select Age..." />
                    </div>
                    {/* Biography section*/}
                    <div className="bio-container" style={{ paddingTop: '30px' }} align="center">
                        <label htmlFor="biography" className="biography-input-container"><span className="hint--top hint-info hint--large stats-font-size hint--rounded"
                            aria-label="You can change your biography by clicking on the form below, making the desired changes, and clicking the submit button.">
                            <i className="fa fa-question-circle"></i> Biography:</span></label>
                        <textarea className="biography-section-box" maxLength="250" placeholder="Tell the people something interesting about yourself."
                            value={bio} onChange={this.updateBiography}>
                        </textarea>
                        <div className="bio-button-wrapper">
                            {this.checkBioDifference()}
                        </div>
                    </div>
                    {/* Interest tags */}
                    <div align="center" style={{ paddingTop: '30px' }}>
                        <div className="interest-tag-box">
                            <label htmlFor="biography" className="biography-input-container"><span className="stats-font-size">Interests:</span></label>
                            <div className="input-group custom-interest-wrapper">
                                <input value={this.state.interest} type="text" className="form-control add-interest-input" placeholder="Enter Interest" onChange={this.inputInterestChange} />
                                <button className="input-group-addon add-interest-button" type="submit" onClick={this.addInterestToUserProfile}>
                                    <i> Add Interest</i>
                                </button>
                            </div>
                            <div className="interests-box">
                                <ul>
                                    {this.displayInterests()}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div align="center" style={{ paddingTop: '30px', display: 'block' }}>
                        <Link to='/editprofileinformation'>Change email address or location?</Link>
                        <br></br>
                        <Link to='/check-account-activity'>Check Account Activity</Link>
                    </div>
                </div >
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        location: state.location,
        profile: state.profile
    }
}

export default connect(mapStateToProps)(Profile);