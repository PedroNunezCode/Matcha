import React, { Component } from 'react';

class DisplayResponse extends Component {

    displayCorrectMessages = () => {
        if (this.props.errors) {
            return (
                <div style={{ width: '39vw' }} className='alert alert-danger'>
                    <p>{this.props.errors[0].description}</p>
                </div>
            )
        }else{
            return (
                <div style={{ width: '39vw' }} className='alert alert-sucess'>
                    <p>{this.props.errors[0].description}</p>
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                {this.displayCorrectMessages()}
            </div>
        );
    }
}

export default DisplayResponse;