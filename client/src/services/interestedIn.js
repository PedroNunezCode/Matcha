import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateInterestedGender } from '../actions/profileActions';

class InterestedIn extends Component {


    changeInterest = (event) => {
        const interestedGender = event.target.id;

        const data = { id: this.props.auth.userId, gender: interestedGender };
        updateInterestedGender(data)
            .then(() => {
                this.props.callbackFunction('success');
            })
    }


    chooseGenderInterest = () => {
        const { interestedIn } = this.props;

        if (interestedIn === 'Choose') {
            return (
                <div>
                    <p>(click one)</p>
                    <div id="men" onClick={this.changeInterest}>
                        <i id="men" className="fa fa-male stats-font-size male-blue choose-interested-gender"> Men</i>
                    </div>
                    <div style={{ paddingLeft: '5px', paddingRight: '5px', paddingTop: '5px' }}></div>
                    <div id="women" onClick={this.changeInterest}>
                        <i id="women" className="fa fa-female stats-font-size female-pink choose-interested-gender"> Women</i>
                    </div>
                    <div id="both" className="stats-font-size" onClick={this.changeInterest}>
                        <i id="both" className="fa fa-male male-blue choose-interested-gender "></i>
                        <i id="both" className="fa fa-female female-pink choose-interested-gender"> Both</i>
                    </div>
                </div>
            )
        } else if (interestedIn === 'men') {
            return (
                <div>
                    <i className="fa fa-male stats-font-size male-blue"> Men</i>
                </div>
            )
        } else if (interestedIn === 'women') {
            return (
                <div>
                    <i className="fa fa-female stats-font-size female-pink"> Women</i>
                </div>
            )
        } else if (interestedIn === 'both') {
            return (
                <div>
                    <span className="stats-font-size" style={{ color: '#BE4BDB' }}>B<i className="fa fa-genderless">th</i></span>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.chooseGenderInterest()}
            </div>
        )
    }
}

function stateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(stateToProps)(InterestedIn);