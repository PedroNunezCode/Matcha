const ChatAPI = require('./api/chat-api');

exports.list = async (req, res) => {
    const { from } = req.query;
    const chatApi = new ChatAPI(req.currentProfile._id);

    const messages = await chatApi.listFrom(from);
    res.json({ messages });
}
