import axios from 'axios';
import io from 'socket.io-client';

class ChatService {
    constructor(profileId, { onMessage, onSaving, onSaved }) {
        this._profileId = profileId;
        this._socket = io();
        this._socket.on('connect', () => {
        });
        this._socket.on('message', onMessage);
        this._socket.on('saving-message', onSaving);
        this._socket.on('saved-message', onSaved);
    }

    auth() {
        this._socket.emit('auth', { profileId: this._profileId });
    }

    message(to, message) {
        this._socket.emit('message', { from: this._profileId, to, message });
    }

    async getMessages(from) {
        const res = await axios.get(`/api/v1/chat/messages/list/${this._profileId}?from=${from}`);
        return res.data.messages;
    }
}

export default ChatService;
