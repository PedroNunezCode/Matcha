import React, { Component } from 'react';
import { connect } from 'react-redux';
import NoMatchesYet from './Matches/NoMatches';
import Matches from './Matches/Matches';

class MessagesAndMatches extends Component {
    renderCorrespondingComponent = () => {
        const { matches } = this.props.profile;

        if(matches.length === 0){
            return(
                <NoMatchesYet/>
            )
        }else{
            return(
                <Matches/>
            )
        }
    }
    render() {
        return (
            <div>
               {this.renderCorrespondingComponent()} 
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    }
}

export default connect(mapStateToProps)(MessagesAndMatches);