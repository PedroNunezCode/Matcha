import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadCry } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class NotEligibleToBrowse extends Component {
    render() {

        // console.log(this.props.profile)
        const { userProfileImage, bio, interests, interestedIn, age } = this.props.profile;
        return (
            <div align="center" className="container">
                <div className="not-eligible-to-browse-content">
                    <FontAwesomeIcon color="red" size="10x" icon={faSadCry} />
                    <h1>You are not allowed to browse just yet.</h1>
                    <p>In order to browse through potential matches, there is a few things you need to do:</p>
                    <div className="row browse-checklist" style={{paddingTop:'40px'}}>
                        <div className="col-sm">
                            <h4 className={ !userProfileImage  ?  'to-do-checklist' : 'done-check-list'} align="center">Upload a profile image</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <h4 className={ interests.length < 5  ?  'to-do-checklist' : 'done-check-list'} align="center">Enter at least 5 interests / hobbies.</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <h4 className={ interestedIn === 'Choose'  ?  'to-do-checklist' : 'done-check-list'} align="center">Choose the gender your interested in.</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <h4 className={ !bio  ?  'to-do-checklist' : 'done-check-list'} align="center">Update your bio.</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <h4 className={ !age  ?  'to-do-checklist' : 'done-check-list'} align="center">Update your age.</h4>
                        </div>
                    </div>
                    <div style={{paddingTop:'50px', paddingBottom: '50px'}}>
                        <Link to="/profile" className="link-to-edit-profile">You can update your profile here.</Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(NotEligibleToBrowse);