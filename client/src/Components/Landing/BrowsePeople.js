import React, { Component } from 'react';
import { connect } from 'react-redux';
import DisplayUserBrowser from './DisplayUserBrowser';
import Unlucky from './Unlucky';
import { getProfiles } from '../../actions/profileActions';
import ProfileFilters from './helpers/filters';
import { Link } from 'react-router-dom'

class BrowsePeople extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
        }
    }


    componentWillMount() {
        this.filterProfiles({});
    }

    nextUser = () => {
        const { index } = this.state;

        this.setState({ index: index + 1 });
    }

    renderUserProfiles = () => {
        const { userProfiles } = this.props.profile;
        const { index } = this.state;

        if (userProfiles.length > index) {
            return <DisplayUserBrowser callback={this.nextUser} user={userProfiles[index]} />
        } else {
            return <Unlucky />
        }
    }

    filterProfiles = (sort) => {
        const { profileId } = this.props.profile;
        const query = { sort: JSON.stringify(sort), match: true };
        this.props.dispatch(getProfiles(profileId, query));
    }

    renderFilterSection = () => {
        return (
            <ProfileFilters callback={this.filterProfiles} />
        )
    }

    render() {
        return (
            <div>
                <div className="container search-and-browse-container" align="center">
                    <h1><Link to="/" className="header-link browse-link current">Browse</Link>|<Link to="/search" className="header-link search-link">Search</Link></h1>
                </div>
                {this.renderFilterSection()}
                {this.renderUserProfiles()}
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile,
    }
}

export default connect(mapStateToProps)(BrowsePeople);