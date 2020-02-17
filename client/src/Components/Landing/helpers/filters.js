import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

const ageOptions = [
    { key: 1, text: 'Youngest', value: 1 },
    { key: 2, text: 'Oldest', value: -1 },
];

const maxDistanceOptions = [
    { key: 1, text: '5km', value: 5000 },
    { key: 2, text: '10km', value: 10000 },
    { key: 3, text: '50km', value: 50000 },
    { key: 4, text: '100km', value: 100000 },
    { key: 5, text: '500km', value: 500000 },
];

const distanceSortOptions = [
    { key: 1, text: 'Closest', value: 1 },
    { key: 2, text: 'Farthest', value: -1 },
];

const ratingOptions = [
    { key: 1, text: 'Highest Rating', value: -1 },
    { key: 2, text: 'Lowest Rating', value: 1 },
]

const interestOptions = [
    { key: 1, text: 'Highest Common Interests', value: -1 },
    { key: 2, text: 'Lowest Common Interests', value: 1 },
]

class ProfileFilters extends Component {

    constructor(props){
        super(props);

        this.state = {
            age: null,
            distance: null,
            fameRating: null,
            interestMatch: null,
            maxDistance: null,
        };
    }

    handleInputChange = (e, data) => this.setState({ [data.id]: data.value });

    componentDidUpdate(prevProps, prevState){
        if(prevState !== this.state){
            this.props.callback(this.state);
        }
    }
    
    render() {
        return (
            <div>
                <div className="container filter-selection-wrapper" align="center">
                    <Dropdown id="age" placeholder="Sort Age" clearable options={ageOptions} selection onChange={this.handleInputChange}/>
                    <Dropdown id="distance" placeholder="Sort By Distance" clearable options={distanceSortOptions} selection onChange={this.handleInputChange}/>
                    <Dropdown id="maxDistance" placeholder="Max distance" clearable options={maxDistanceOptions} selection onChange={this.handleInputChange}/>
                    <Dropdown id="fameRating" placeholder="Fame Rating" clearable options={ratingOptions} selection onChange={this.handleInputChange}/>
                    <Dropdown id="interestMatch" placeholder="Interests" clearable options={interestOptions} selection onChange={this.handleInputChange} />
                </div>
            </div>
        );
    }
}

export default ProfileFilters;