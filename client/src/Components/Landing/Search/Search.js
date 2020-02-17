import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchProfiles, setSearchProfilesToEmptyArray } from '../../../actions/profileActions';
import SearchFilterInputComponent from './SearhFilterInput';
import { Redirect } from 'react-router-dom';

import './search.css';

const DIGITS = '0123456789';

class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visitUserId: '',
            redirect: false,
            filter: {
                text: '',
                age: [],
                fameRating: [],
                interests: [],
            },
        };
    }

    onTextInputChange = (event) => {
        const { filter } = this.state;

        if (this.timeId)
            clearTimeout(this.timeId);
        filter.text = event.target.value;
        this.timeId = setTimeout(() => this.setState({ filter }), 300);
    }

    filterUpdate = (name, value) => {
        const { filter } = this.state;
        filter[name] = value.map(v => v.value);
        this.setState({ filter });
    }

    componentDidUpdate(prevProps, prevState) {
        const { filter } = this.state;
        const { profileId } = this.props.profile;

        const query = { filter: JSON.stringify(filter), match: false };
        const valuesLength = Object.values(filter).reduce((a, v) => a + v.length, 0);
        const funcToDipacth = valuesLength === 0 ? setSearchProfilesToEmptyArray : searchProfiles;

        if (this.state !== prevState)
            this.props.dispatch(funcToDipacth(profileId, query));
    }

    displayCorrespondingSearch = () => {
        const { searchProfiles } = this.props.profile;
        
        if (searchProfiles.length === 0) {
            return (
                <div align="center" style={{ marginTop: '5vh' }}>
                    <h1>No users found. Please update your seach preferences.</h1>
                </div>
            )
        } else if (searchProfiles.length > 0) {

            return searchProfiles.map((profile, key) => {
                return (
                    <div key={key} className="history-item" onClick={this.redirectUser.bind(this, profile._id)}>
                        <div style={{ display: 'inline-block', margin: 'auto' }}>
                            <img className="profile-panel-profile-image" src={profile.profileImage} alt="current user profile" />
                            <h4>{profile.firstName} {profile.lastName}</h4>
                        </div>
                    </div>
                )
            })
        }
    }

    redirectUser = (userId) => {
        if(userId){
            this.setState({visitUserId: userId, redirect: true})
        }
    }

    renderSearchInputs = () => {
        const { filter } = this.state;
        return (
            <div className="container search-inputs-container">
                <div className="row pb-4">
                    <div className="col-8 offset-2">
                        <input
                            placeholder="Search by name, gender, location here"
                            onChange={this.onTextInputChange}
                            className="form-control" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label className="form-label" htmlFor="age-input">Age:</label>
                    </div>
                    <div className="col-4">
                        <label className="form-label" htmlFor="fame-input">Fame rating:</label>
                    </div>
                    <div className="col-4">
                        <label className="form-label" htmlFor="interests-input">Interests</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <SearchFilterInputComponent
                            value={filter.age}
                            allowedCharacters={DIGITS}
                            allowDoubleOptions={true}
                            inputId="age-input"
                            placeholder="Example 10, or 10-20"
                            onValueUpdated={this.filterUpdate.bind(this, 'age')} />
                    </div>
                    <div className="col-4">
                        <SearchFilterInputComponent
                            value={filter.fameRating}
                            allowedCharacters={DIGITS}
                            allowDoubleOptions={true}
                            inputId="fame-input"
                            placeholder="Example 10, or 10-20"
                            onValueUpdated={this.filterUpdate.bind(this, 'fameRating')} />
                    </div>
                    <div className="col-4">
                        <SearchFilterInputComponent
                            value={filter.interests}
                            placeholder="Example 10, or 10-20"
                            inputId="interests-input"
                            allowDoubleOptions={false}
                            onValueUpdated={this.filterUpdate.bind(this, 'interests')} />
                    </div>
                </div>
                <hr style={{ backgroundColor: 'black', height: '1px' }}></hr>
                <div className="container">
                    {this.props.profile.searchProfiles.length > 0 && <h1>Click on a user to visit their profile.</h1>}
                    {this.displayCorrespondingSearch()}
                </div>
            </div>
        );
    }

    render() {
        const { redirect, visitUserId } = this.state;

        if(redirect){
            return <Redirect to={`/userprofile/${visitUserId}`} />
        }

        return (
            <div>
                <div className="container search-and-browse-container" align="center">
                    <h1><Link to="/" className="header-link browse-link">Browse</Link>|<Link to="/search" className="header-link search-link current">Search</Link></h1>
                    {this.renderSearchInputs()}
                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(SearchComponent);