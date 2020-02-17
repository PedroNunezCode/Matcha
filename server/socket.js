const socket = require('socket.io');
const ChatAPI = require('./controllers/api/chat-api');

class SocketChatService {
    constructor (server) {
        this._io = socket(server);
        this._users = {};

        this._io.on('connection', (socket) => {
            socket.on('auth', ({ profileId }) => {
                this.onUserAuth(profileId, socket);
            });
        });
    
        this._io.set('authorization', (handshake, accept) => {
            accept(null, true);
        });
    }

    onUserAuth(profileId, socket) {
        this._users[profileId] = socket;
        socket.on('message', this.onUserMessage.bind(this));
    }

    onUserMessage(data) {
        console.log(`new message from ${data.from} to ${data.to} is ${data.message}`);
        
        const chatApi = new ChatAPI(data.from);
        this._users[data.from].emit('saving-message', data);
        chatApi.create(data)
            .then((msg) => {
                this._users[data.from].emit('saved-message', msg);
                if (this._users[data.to])
                    this._users[data.to].emit('message', msg);
            })
            .catch((err) => { 
                throw err;
            });
            // .catch((err) => this._users[data.from].emit('message', { err }));
    }
}

module.exports = SocketChatService;
