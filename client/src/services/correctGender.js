import React, { Component } from 'react';

export class CorrectGender extends Component {

    returnCorrectGender = () => {
        const { gender } = this.props;

        if(gender === 'male'){
            return (
                <div>
                    <i className="fa fa-male stats-font-size male-blue"> Male</i>
                </div>
            )
        }else if(gender === 'female'){
            return (
                <div>
                    <i className="fa fa-female stats-font-size female-pink"> Female</i>
                </div>
            ) 
        }else if(gender === 'other'){
            return(
                <div>
                    <i className="fa fa-genderless stats-font-size" style={{color:'#BE4BDB'}}>ther</i>
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                {this.returnCorrectGender()}
            </div>
        )
    }
}