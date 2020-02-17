const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { Profile } = require('./User');

const chatMessageSchema = new Schema({
    date: Date,
    new: Boolean,
    to: { type: Schema.Types.ObjectId, ref: 'Profile' },
    from: { type: Schema.Types.ObjectId, ref: 'Profile' },
    message: String,
});

chatMessageSchema.pre("save", function (next) {

    const { to, from } = this;

    Profile.findOne({ _id: to }, (err, reciever) => {
        if (err) throw err;

        if (reciever) {
            //Get the users image for notifications.
            Profile.findOne({ _id: from }, (err, sender) => {
                if (err) throw err;

                const insertMessageNotification = {
                    reason: 'has sent you a message!', firstName: sender.firstName, lastName: sender.lastName,
                    profileImage: sender.profileImage, _id: sender._id,
                }

                reciever.messageNotifications.push(insertMessageNotification);
                
                reciever.save((err, success) => {
                    if (err) throw err;
                    if (success) {
                        next();
                    }
                })
            });
        }
    });
    next();
})

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
