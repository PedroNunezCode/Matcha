import React, { Component } from 'react';
import Logo42 from '../images/42logo.png';

class About extends Component {
    render() {
        return (
            <div className="container" style={{paddingTop:'50px', paddingBottom:'50px'}}>
                <div align="center">
                    <img src={Logo42} alt="42 school logo" className="responsive-image"/>
                    <h4 style={{paddingTop: '30px'}}><b>About Matcha</b></h4>
                    <p>Matcha is a web project in <a target="_blank" rel="noopener noreferrer" href="https://www.42.us.org/">42 Silicon Valley</a>, The school I currently attend.</p>
                    <br></br>
                    <p>The purpose of matcha is to create a full stack dating website using the tech stack of your choice. In my case, MERN.</p>
                    <p>Matcha opens the portal to the rabbit hole that is full stack engineering. Unlike the rest of the 42 curriculum written in C, Matcha</p>
                    <p>is one of the first web projects that the curriculum provides. Thus allowing me to learn React, Axios, Redux (state management), and</p>
                    <p>many other technologies. If you are interested in everything this project has to offer. I have attached the <a target="_blank" rel="noopener noreferrer" href="https://github.com/fpetras/42-subjects/blob/master/matcha.en.pdf">PDF</a></p>
                    <p>with all the requirements of the project. <br></br><br></br>Thanks for looking and I hope you find the one ;)</p>
                </div>
            </div>
        );
    }
}

export default About;