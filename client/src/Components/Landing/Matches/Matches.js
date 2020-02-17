import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatComponent from '../Chat/Chat';
import ChatService from '../../../services/chat-service';
import MessageUser from './MessageUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faReply } from '@fortawesome/free-solid-svg-icons';
import { deleteNotification } from '../../../actions/profileActions';

class Matches extends Component {

    constructor(props) {
        super(props);
        const { profileId } = this.props.profile;

        this.state = {
            userChats: {},
            openChat: false,
            chatToBeOpened: '',
            currentMatch: null,
            displayMessage: false,
            redirectFlag: true,
        };

        this._chatService = new ChatService(
            profileId,
            {
                onMessage: this.onMessageRecieved.bind(this),
                onSaving: this.onMessageSending.bind(this),
                onSaved: this.onMessageSent.bind(this),
            },
        );
        this._chatService.auth();
    }

    componentDidMount() {
        const { matches } = this.props.profile;

        matches.forEach(match => this._chatService.getMessages(match._id)
            .then(messages => {
                const { userChats } = this.state;
                this.setState({ userChats: { ...userChats, [match._id]: messages } });
            })
        );
    }

    onMessageRecieved = (message) => {
        const { userChats } = this.state;
        const messages = userChats[message.from] ? userChats[message.from] : [];
        messages.push(message);
        this.setState({ userChats: { ...userChats, [message.from]: messages.map(m => m) } });
    }

    onMessageSending = (message) => {
        console.log('sending message');
    }

    onMessageSent = (message) => {
        const { userChats } = this.state;
        const messages = userChats[message.to] ? userChats[message.to] : [];
        messages.push(message);
        this.setState({ userChats: { ...userChats, [message.to]: messages.map(m => m) } });
    }

    displayChat = (chatToBeOpened, match) => {
        if (match) {
            //remove notifications current profile from notifications
            const data = { type: 'deleteOpenChatNotifications', user: match._id, id: this.props.profile.profileId };
            this.props.dispatch(deleteNotification(data));
        }

        const { openChat } = this.state;
        if (!openChat) {
            this.setState({ openChat: true, chatToBeOpened, currentMatch: match, displayMessage: true });
        } else {
            this.setState({ openChat: false, displayMessage: false });
        }
    }

    renderCorrectMessage = (matchId) => {
        const { userChats } = this.state;

        if (userChats[matchId] && userChats[matchId].length > 0) {
            let lengthOfMessageHistory = userChats[matchId].length - 1;
            let lastMessage = userChats[matchId][lengthOfMessageHistory];

            if (lastMessage.from === this.props.profile.profileId) {
                return (
                    <h4><FontAwesomeIcon color="black" icon={faShare} /> {lastMessage.message}</h4>
                )
            } else {
                return <h4><FontAwesomeIcon color="red" icon={faReply} /> {lastMessage.message}</h4>
            }
        } else {
            return <h4>You have a new match! Click here to say hello!</h4>
        }

    }

    renderMatchesAndMessages = () => {
        const { matches } = this.props.profile;

        return matches.map((match, key) => {
            return (
                <div key={key} >
                    <div className="match-message-container row m-0 mb-1" onClick={this.displayChat.bind(this, match._id, match)}>
                        <div className="col-sm-2" align="center">
                            <img src={match.profileImage} alt="user profile" className="match-message-profile-image" />
                        </div>
                        <div className="col-md-10" align="left" style={{ display: 'box' }}>
                            <h3>{match.firstName} {match.lastName}</h3>
                            {this.renderCorrectMessage(match._id)}
                        </div>
                    </div>
                </div>
            )
        });
    }

    renderMessageComponents = () => {
        const { userChats, chatToBeOpened, currentMatch } = this.state;
        return (
            <div >
                <MessageUser user={currentMatch} callback={this.displayChat} />
                <ChatComponent profileImage={currentMatch.profileImage} userId={chatToBeOpened} _chatService={this._chatService} messages={userChats[chatToBeOpened]} />
            </div>
        )
    }

    closeRedirectChat = () => {
        this.setState({ redirectFlag: false });
    }

    renderRedirectionChat = () => {
        const { userChats } = this.state;
        const { chatFlag } = this.props.profile;

        return (
            <div >
                <MessageUser user={chatFlag} callback={this.closeRedirectChat} />
                <ChatComponent profileImage={chatFlag.profileImage} userId={chatFlag._id} _chatService={this._chatService} messages={userChats[chatFlag._id]} />
            </div>
        )

    }

    render() {
        const { redirectFlag } = this.state;
        const { chatFlag } = this.props.profile;
        if (chatFlag._id && redirectFlag) {
            return (
                this.renderRedirectionChat()
            )
        } else {
            const { displayMessage, openChat } = this.state;
            return (
                <div style={{ marginTop: '10px' }} >
                    {!displayMessage && this.renderMatchesAndMessages()}
                    {openChat && this.renderMessageComponents()}
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile
    }
}

export default connect(mapStateToProps)(Matches);