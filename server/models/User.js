const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        min: [4, 'Too Short, Min is 4 characters'],
        max: [20, 'Too Long, Max is 20 characters'],
        unique: true,
    },
    email: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        required: 'Password is required'
    },
    profile: {
        type: Schema.Types.ObjectId, ref: 'Profile'
    },
    lastOnline: {
        type: Date,
        default: Date.now
    },
    verifiedUser: {
        type: Boolean,
        default: false,
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    verificationToken: {
        type: String,
    },
    passwordVerificationToken: {
        type: String,
    }
});

const profileSchema = new Schema({
    profileId: { type: Schema.Types.ObjectId, ref: 'User' },
    username: {
        type: String,
        __textSearchable: true,
    },
    firstName: {
        type: String,
        __textSearchable: true,
    },
    lastName: {
        type: String,
        __textSearchable: true,
    },
    age:{
        type: Number
    },
    gender: {
        type: String,
        __textSearchable: true,
    },
    interestedIn: {
        type: String,
        default: 'Choose',
        __textSearchable: true,
    },
    fameRating: {
        type: Number,
        default: 0
    },
    location: {
        name: {
            type: String,
            __textSearchable: true,
        },
        coordinates: [Number],
    },
    customLocation: {
        type: String,
    },
    bio: {
        type: String,
    },
    interests: [String],
    profileImage: { type: String },
    profileImage0: { type: String },
    profileImage1: { type: String },
    profileImage2: { type: String },
    profileImage3: { type: String },
    likedProfiles: [{ type: String }],
    likedMyProfileNotification: [{ type: Object }],
    visitedMyProfileNotifications: [{ type: Object }],
    dislikedProfiles: [{ type: Object }],
    likedMyProfile: [{ type: Object }],
    matches: [{ type: Object }],
    matchNotifications: [{ type: Object }],
    messageNotifications: [{type: Object}],
    blockedUsers: [{type: String}],
    blockedMyProfile: [{type: String}],
    unmatchedNotifications: [{ type: Object }],
    history: [{ type: Object }],
    visitedMyProfile: [{ type: Object }],
});
profileSchema.index({ 'location.coordinates': '2dsphere' });

profileSchema.pre("save", function (next) {
    if (this.isModified("visitedMyProfile")) {

        const visitorProfile = this.visitedMyProfile[this.visitedMyProfile.length - 1].visitorProfileId;

        const { firstName, lastName, profileImage, _id } = this;
        const addHistory = { reason: 'You viewed', firstName, lastName, profileImage, _id: _id };

        this.constructor.findOne({ _id: visitorProfile }, (err, foundProfile) => {
            if (err) throw err;

            if (foundProfile) {
                foundProfile.history.push(addHistory);

                foundProfile.save();
            }
        });
        next();
    } else {
        next();
    }
})


userSchema.methods.hasSamePassword = function (requestedPassword) {
    return bcrypt.compareSync(requestedPassword, this.password);
}

const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = {
    User, Profile
}