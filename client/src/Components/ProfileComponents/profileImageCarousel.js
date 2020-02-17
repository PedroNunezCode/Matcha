import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

class ProfileImageCarousel extends Component {

    renderCorrectAmmountOfImages = () => {
        const { userInformation } = this.props;
        const { profileImage, profileImage0, profileImage1, profileImage2, profileImage3 } = userInformation;

        if (profileImage && profileImage0 && profileImage1 && profileImage2 && profileImage3) {
            return (
                <Carousel >
                    <img src={userInformation.profileImage} alt="hello blind ones" />
                    <img src={userInformation.profileImage0} alt="hello blind ones" />
                    <img src={userInformation.profileImage1} alt="hello blind ones" />
                    <img src={userInformation.profileImage2} alt="hello blind ones" />
                    <img src={userInformation.profileImage3} alt="hello blind ones" />
                </Carousel>
            )
        } else if (profileImage && profileImage0 && profileImage1 && profileImage2) {
            return (
                <Carousel >
                    <img src={userInformation.profileImage} alt="hello blind ones" />
                    <img src={userInformation.profileImage0} alt="hello blind ones" />
                    <img src={userInformation.profileImage1} alt="hello blind ones" />
                    <img src={userInformation.profileImage2} alt="hello blind ones" />
                </Carousel>
            )
        } else if (profileImage && profileImage0 && profileImage1) {
            return (
                <Carousel >
                    <img src={userInformation.profileImage} alt="hello blind ones" />
                    <img src={userInformation.profileImage0} alt="hello blind ones" />
                    <img src={userInformation.profileImage1} alt="hello blind ones" />
                </Carousel>
            )
        } else if (profileImage && profileImage0 ) {
            return (
                <Carousel >
                    <img src={userInformation.profileImage} alt="hello blind ones" />
                    <img src={userInformation.profileImage0} alt="hello blind ones" />
                </Carousel>
            )
        } else if (profileImage) {
            return (
                <Carousel >
                    <img src={userInformation.profileImage} alt="hello blind ones" />
                </Carousel>
            )
        }


    }

    render() {
        return (
            this.renderCorrectAmmountOfImages()

        );
    }
}

export default ProfileImageCarousel;