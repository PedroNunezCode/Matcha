const ChatMessage = require('../../models/ChatMessage');
const ObjectID = require('mongoose').Types.ObjectId;

class ChatAPI {
    constructor(currentProfileId, options = {}) {
        this._currentProfileId = currentProfileId;
        this._options = options;
    }

    async create(message) {
        const newMessageTemplate = {
            new: true,
            date: new Date(),
        };
        const messageInDb = new ChatMessage(
            Object.assign(newMessageTemplate, message));
        // console.log(messageInDb);
        await messageInDb.save();
        return messageInDb;
    }

    async listFrom(from) {
        // console.log(from);
        // console.log(this._currentProfileId);
        const query = {
            from: { $in: [from, this._currentProfileId] },
            to: { $in: [from, this._currentProfileId]}
        };
        const messages = await ChatMessage.find(query).sort({ date: 1 });
        return messages;
    }
}

module.exports = ChatAPI;
