import React, { Component } from 'react';
import { connect } from 'react-redux';
import MatchMessage from './MatchMessage';
import MyMessage from './MyMessage';
import './chat.css';

class ChatComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
        }
    }

    messagesEndRef = React.createRef();

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    messageInputOnChage = (event) => {
        this.setState({ message: event.target.value });
    }

    sendMessage = (event) => {
        const { userId, _chatService } = this.props;
        if (event.key === 'Enter') {
            _chatService.message(userId, event.target.value);
            this.setState({ message: '' });
        }
    }

    renderMessages = () => {
        const { messages, profileImage } = this.props;
        const { profileId } = this.props.profile;
        const currentProfileImage = this.props.profile.userProfileImage;

        if (!Array.isArray(messages))
            return;
        return messages.map((message, key) => {
            return (
                <div key={key}>
                    {message.from === profileId
                        ? <MyMessage profileImage={currentProfileImage} message={message.message} /> : <MatchMessage profileImage={profileImage} message={message.message} />}
                </div>
            )
        })
    }


    render() {
        return (
            <div>
                <div className="chat-wrapper">
                    {this.renderMessages()}
                    <div style={{ float: "left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}></div>
                </div>
                <div className="message-input-wrapper">
                    <h4 align="center">Send Message:</h4>
                    <input
                        value={this.state.message}
                        onChange={this.messageInputOnChage}
                        onKeyPress={this.sendMessage}
                        className="form-control message-input" />
                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile
    }
}

export default connect(mapStateToProps)(ChatComponent);
