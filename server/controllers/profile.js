const { User, Profile } = require('../models/User');
const nodemailer = require('nodemailer');
const config = require('../config/index');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const cryptoToken = require('crypto-token');
const ObjectID = require('mongodb').ObjectID;
const ProfileAPI = require('./api/profile-api.js');

/**
 * Required imports for image uploads of the users profile information.
 */
const upload = require('../services/file-upload');
const singleUpload = upload.single('image');
const profileFilter = require('./helpers/ProfileFilterHelpers/heterosexualPreference.js');

/**
 * This controller handles blocking a user. This will update the user's matches liked proifles. and will be used to
 * determine what profiles the user will be able to see and interact with.
 */

exports.blockUser = function (req, res) {
    const { profileIdToBeDeleted, profileId, user } = req.body;


    Profile.findById({ _id: profileId }, (err, currentUserProfile) => {
        if (err) throw err;

        if (currentUserProfile) {
            // // add to blocked users
            currentUserProfile.blockedUsers.push(profileIdToBeDeleted);

            // //Deleted the user from matched profiles.
            for (i = 0; i <= currentUserProfile.matches.length - 1; i++) {
                if (currentUserProfile.matches[i]._id.toString() === profileIdToBeDeleted) {
                    // console.log(currentUserProfile.matches[i]);
                    currentUserProfile.matches.splice(i, 1);
                    break;
                }
            }

            //Deletes all instances of the user in their history.
            function checkHistoryItem(historyItem) {
                if (historyItem._id === profileIdToBeDeleted || historyItem._id.toString() === profileIdToBeDeleted) {
                    return false
                } else return true;
            }
            const newHistory = currentUserProfile.history.filter(checkHistoryItem);
            currentUserProfile.history = newHistory;
            const blockedHistoryItem = { reason: 'You blocked', firstName: user.fistName, lastName: user.lastName, profileImage: user.profileImage };
            currentUserProfile.history.push(blockedHistoryItem);

            currentUserProfile.save((err) => {
                if (err) throw err;
            });

            //Delete the blocked profile connections to the user that wants to disconnect and also add them to a blocked list so they cannot see their profile.
            Profile.findById({ _id: profileIdToBeDeleted }, (err, blockedUser) => {
                if (err) throw err;

                if (blockedUser) {

                    //This will help when returning possible connections. This will not allow them to see the profile.
                    blockedUser.blockedMyProfile.push(profileId);
                    for (i = 0; i <= blockedUser.matches.length - 1; i++) {
                        if (blockedUser.matches[i]._id.toString() === profileId) {
                            blockedUser.matches.splice(i, 1);
                            break;
                        }
                    }

                    blockedUser.save((err, success) => {
                        if (err) throw err;

                        if (success) return res.status(200).send();
                    });
                }
            });
        }
    });
}


/**
 * This controller handles the change of a signed in user. This is required to access browsing through profiles
 * The reason for this so the search filter has an easier time finding what it needs.
 */

exports.changeUserAge = function (req, res) {
    const { value, profileId } = req.body;

    Profile.findById({ _id: profileId }, (err, foundProfile) => {
        if (err) throw err;

        if (foundProfile) {
            foundProfile.age = value;

            foundProfile.save((err, success) => {
                if (err) throw err;

                if (success) {
                    return res.status(200).send();
                }
            });
        }
    })
}


/**
 * This controller handles disconnecting the current profile to a profile that was once connected to the.
 * I will only remove it from the user that wants to diconnect so that if they want to like them again or dislike
 * they will have the choice to do that. also if they want to fully disconnect they can just block it.
 */

exports.disconnectFromUser = function (req, res) {
    const { currentUserProfileId, profileIdToBeDeleted } = req.body;

    Profile.findById({ _id: currentUserProfileId }, (err, foundProfile) => {
        if (err) return res.status(404).send();

        if (foundProfile) {

            let deletedProfile = [];

            for (i = 0; i <= foundProfile.matches.length - 1; i++) {
                if (foundProfile.matches[i]._id.toString() === profileIdToBeDeleted) {
                    deletedProfile = foundProfile.matches[i];
                    foundProfile.matches.splice(i, 1);
                    break;
                }
            }

            for (i = 0; i <= foundProfile.likedProfiles.length - 1; i++) {
                if (foundProfile.likedProfiles[i] === profileIdToBeDeleted) {
                    foundProfile.likedProfiles.splice(i, 1);
                    break;
                }
            }

            const currentProfileHistoryPush = {
                reason: 'You disconnected from ', firstName: deletedProfile.firstName,
                lastName: deletedProfile.lastName, profileImage: deletedProfile.profileImage,
                _id: deletedProfile._id
            }

            foundProfile.history.push(currentProfileHistoryPush);
            foundProfile.save((err, newUserProfile) => {
                if (err) throw err;
            });

            Profile.findById({ _id: profileIdToBeDeleted }, (err, foundProfileToBeDeleted) => {
                if (err) throw err;

                if (foundProfileToBeDeleted) {

                    let historyPush = {
                        reason: 'disconnected from you.', fistName: foundProfile.firstName, lastName: foundProfile.lastName,
                        profileImage: foundProfile.profileImage, _id: foundProfile._id
                    }

                    for (i = 0; i <= foundProfileToBeDeleted.matches.length - 1; i++) {
                        if (foundProfileToBeDeleted.matches[i]._id.toString() === currentUserProfileId) {
                            foundProfileToBeDeleted.matches.splice(i, 1);
                            break;
                        }
                    }

                    for (i = 0; i <= foundProfileToBeDeleted.likedMyProfile.length - 1; i++) {
                        if (foundProfileToBeDeleted.likedMyProfile[i]._id.toString() === currentUserProfileId) {
                            foundProfileToBeDeleted.likedMyProfile.splice(i, 1);
                            break;
                        }
                    }

                    foundProfileToBeDeleted.history.push(historyPush);
                    foundProfileToBeDeleted.unmatchedNotifications.push(historyPush);

                    foundProfileToBeDeleted.save((err, success) => {
                        if (err) throw err;

                        if (success) return res.status(200).send();
                    });
                }
            });
        }
    })
}

/**
 * This controller will handle reporting a fake account.
 */

exports.reportFakeAccount = function (req, res) {
    const { username } = req.params;

    const htmlEmail = `
                    <div style={{textAlign:'center'}}>
                        <h1> The following username has been flagged as a fake account: ${username}</h1>
                    </div>
                `;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: config.GMAIL,
            pass: config.GMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'smediaxp42@gmail.com',
        to: 'pedronunezcode@gmail.com',
        replyTo: 'smediaxp42@gmail.com',
        subject: 'Fake account flagged',
        text: 'fake account flagged',
        html: htmlEmail
    }

    transporter.sendMail(mailOptions, err => {
        if (err) return console.log(err);

        return res.status(200).send();
    });
}

exports.deleteNotification = function (req, res) {
    const { type, user, id } = req.body;

    Profile.findOne({ _id: id }, (err, foundProfile) => {
        if (err) return res.status(404).send({ errors: [{ title: 'User no longer exists.', description: 'User no longer has an account.' }] });

        if (foundProfile) {
            if (type === 'likedMyProfileNotification') {

                for (var i = 0; i <= foundProfile.likedMyProfileNotification.length - 1; i++) {
                    if (foundProfile.likedMyProfileNotification[i]._id.toString() === user._id) {
                        foundProfile.likedMyProfileNotification.splice(i, 1);

                        foundProfile.save((err, newUser) => {
                            if (err) throw err;

                            if (newUser) {
                                return res.status(200).send();
                            }
                        });
                        break;
                    }
                }
            } else if (type === 'visitedMyProfileNotifications') {
                // Set the id of the users different to eachother just to make the code easy to read.
                for (var i = 0; i <= foundProfile.visitedMyProfileNotifications.length - 1; i++) {
                    if (foundProfile.visitedMyProfileNotifications[i].visitorProfileId.toString() === user.visitorProfileId) {
                        foundProfile.visitedMyProfileNotifications.splice(i, 1);

                        foundProfile.save((err, newUser) => {
                            if (err) throw err;

                            if (newUser) {
                                return res.status(200).send();
                            }
                        });
                    }
                }
            } else if (type === 'matchNotifications') {
                for (var i = 0; i <= foundProfile.matchNotifications.length - 1; i++) {
                    if (foundProfile.matchNotifications[i]._id.toString() === user._id) {
                        foundProfile.matchNotifications.splice(i, 1);

                        foundProfile.save((err, success) => {
                            if (err) throw err;

                            if (success) {
                                return res.status(200).send();
                            }
                        })
                    }
                }
            } else if (type === 'unmatchedProfileNotification') {
                for (var i = 0; i <= foundProfile.unmatchedNotifications.length - 1; i++) {
                    if (foundProfile.unmatchedNotifications[i]._id.toString() === user._id) {
                        foundProfile.unmatchedNotifications.splice(i, 1);

                        foundProfile.save((err, success) => {
                            if (err) throw err;

                            if (success) {
                                return res.status(200).send();
                            }
                        });
                    }
                }
            } else if (type === 'messageNotification') {

                let renderProfile;

                function filterMessageNotifications(notification) {
                    if (notification._id.toString() === user) {
                        renderProfile = notification;
                        return false;
                    } else {
                        return true
                    }
                }

                let newMessageNotifications = foundProfile.messageNotifications.filter(filterMessageNotifications);
                foundProfile.messageNotifications = newMessageNotifications;



                foundProfile.save((err, success) => {
                    if (err) throw err;

                    if (success) {
                        return res.status(200).json(renderProfile).send();
                    }
                });
            } else if (type === 'deleteOpenChatNotifications') {

                function filterMessageNotifications(notification) {
                    if (notification._id.toString() === user) {
                        return false;
                    } else {
                        return true
                    }
                }

                let newMessageNotifications = foundProfile.messageNotifications.filter(filterMessageNotifications);
                foundProfile.messageNotifications = newMessageNotifications;



                foundProfile.save((err, success) => {
                    if (err) throw err;

                    if (success) {
                        return res.status(200).send();
                    }
                });
            } else {
                return res.status(404).send()

            }
        }
    })
}

/**
 * This controller handles returning the user's profile so that it can be displayed on the visit profile
 * component. The reason for this being a post request is that it will change the users visited my profile
 * section...
 */

exports.visitProfile = function (req, res) {
    const { id, profileImage, visitorProfileId, fullName } = req.body;

    Profile.findById({ _id: id })
        .populate('profileId')
        .exec((err, foundProfile) => {
            if (err) return res.status(404).send();

            if (foundProfile) {

                const visitedMyProfile = {
                    profileImage,
                    visitorProfileId,
                    fullName,
                };

                const alreadyVisitedProfile = foundProfile.visitedMyProfile.find((visitedProfileInDb) => {
                    return visitedMyProfile.visitorProfileId === visitedProfileInDb.visitorProfileId;
                });

                if (!alreadyVisitedProfile) {

                    const addHistory = { reason: 'Visited your profile.', profileImage, _id: visitorProfileId, fullName };
                    foundProfile.history.push(addHistory);
                    foundProfile.visitedMyProfile.push(visitedMyProfile);
                    foundProfile.visitedMyProfileNotifications.push(visitedMyProfile);

                    foundProfile.save((err, savedProfile) => {
                        if (err) {
                            return res.status(404).send();
                        }

                        if (savedProfile) {
                            const { username, firstName, lastName, gender, interestedIn, fameRating, location,
                                customLocation, bio, interests, profileImage, profileImage0, profileImage1,
                                profileImage2, profileImage3, age } = savedProfile;

                            const lastOnline = foundProfile.profileId.lastOnline;


                            const profileInformation = {
                                username, firstName, lastName, gender, interestedIn, fameRating, location,
                                customLocation, bio, interests, profileImage, profileImage0, profileImage1,
                                profileImage2, profileImage3, lastOnline, age
                            };

                            return res.status(200).json(profileInformation).send();
                        }
                    });
                } else {

                    const { username, firstName, lastName, gender, interestedIn, fameRating, location,
                        customLocation, bio, interests, profileImage, profileImage0, profileImage1,
                        profileImage2, profileImage3, age } = foundProfile;

                    const lastOnline = foundProfile.profileId.lastOnline;


                    const profileInformation = {
                        username, firstName, lastName, gender, interestedIn, fameRating, location,
                        customLocation, bio, interests, profileImage, profileImage0, profileImage1,
                        profileImage2, profileImage3, lastOnline, age
                    };

                    return res.status(200).json(profileInformation).send();
                }
            }
        })
}

/**
 * This crontroller handles clearing the notification object. They will also change the message notifications
 * and all other notification objects in the future.
 */

exports.clearNotifications = function (req, res) {
    const { id } = req.params;

    Profile.findById({ _id: id }, (err, foundProfile) => {
        if (err) return res.status(404).send();

        if (foundProfile) {

            foundProfile.likedMyProfileNotification = [];
            foundProfile.visitedMyProfileNotifications = [];
            foundProfile.matchNotifications = [];
            foundProfile.unmatchedNotifications = [];

            foundProfile.save((err, newUser) => {
                if (err) {
                    return res.status(404).send();
                } else if (newUser) {
                    return res.status(200).send();
                }
            });
        }
    });
}

/**
 * This controller handles liking a user. This will add the user is to the liked user profiles array.
 * it will also check to see if the user they liked has liked them back. and send a singnal if they have.
 */

exports.likeUser = function (req, res) {
    const { currentProfileId, likedProfileId, profileImage, firstName, lastName } = req.body;


    Profile.findById({ _id: currentProfileId }, (err, currentUserProfile) => {
        if (err) throw err;

        if (currentUserProfile) {
            const addHistory = { reason: 'You liked ', firstName, lastName, profileImage, _id: likedProfileId };

            currentUserProfile.likedProfiles.push(likedProfileId);
            currentUserProfile.history.push(addHistory);
            currentUserProfile.fameRating += 10;

            //Check to see if the profile you liked has already liked you and if so. create a match.
            Profile.findById({ _id: likedProfileId }, (err, foundLikedProfile) => {
                if (err) throw err;

                if (foundLikedProfile) {
                    const match = foundLikedProfile.likedProfiles.includes(currentProfileId);
                    if (match) {
                        const insertMatch = {
                            reason: 'have liked eachother!', firstName: currentUserProfile.firstName, lastName: currentUserProfile.lastName,
                            profileImage: currentUserProfile.profileImage, _id: currentUserProfile._id,
                        }

                        const insertLikedNotification = {
                            reason: 'liked your profile.', firstName: currentUserProfile.firstName, lastName: currentUserProfile.lastName,
                            profileImage: currentUserProfile.profileImage, _id: currentUserProfile._id.toString(),
                        }

                        foundLikedProfile.likedMyProfileNotification.push(insertLikedNotification);
                        foundLikedProfile.history.push(insertLikedNotification, insertMatch);
                        foundLikedProfile.matchNotifications.push(insertMatch);
                        foundLikedProfile.matches.push(insertMatch);
                        foundLikedProfile.fameRating += 50;

                        foundLikedProfile.save();

                        // save match into the current profile matches.
                        const insertMatchIntoCurrentProfile = {
                            reason: 'have liked eachother!', firstName: foundLikedProfile.firstName, lastName: foundLikedProfile.lastName,
                            profileImage: foundLikedProfile.profileImage, _id: foundLikedProfile._id,
                        }

                        currentUserProfile.history.push(insertMatchIntoCurrentProfile);
                        currentUserProfile.matchNotifications.push(insertMatchIntoCurrentProfile);
                        currentUserProfile.matches.push(insertMatchIntoCurrentProfile);
                        currentUserProfile.fameRating += 50;

                        currentUserProfile.save((err, success) => {
                            if (err) throw err;

                            if (success) return res.status(200).send();
                        });

                    } else {
                        const { firstName, lastName, profileImage, _id } = currentUserProfile;

                        const user = { firstName, lastName, profileImage, _id };

                        const addHistory = { reason: 'liked your profile.', firstName, lastName, profileImage, _id };

                        foundLikedProfile.likedMyProfile.push(user);
                        foundLikedProfile.fameRating += 10;
                        foundLikedProfile.history.push(addHistory);
                        foundLikedProfile.likedMyProfileNotification.push(user);
                        foundLikedProfile.save();
                        currentUserProfile.save();

                        return res.status(200).send();
                    }
                }
            })
        }
    });
}

/**
 * This controller will handle disliking a user. It will add to the dislike user profiles array so its no longer,
 * displayed on the frontend as someone they can like.
 */

exports.dislikeUser = function (req, res) {
    const { userId, profileId } = req.body;

    User.findById({ _id: userId })
        .populate('profile')
        .exec((err, foundUser) => {
            if (err) return res.status(404).send();

            if (foundUser) {
                Profile.findById({ _id: foundUser.profile._id }, (err, foundProfile) => {
                    if (err) return res.status(404).send();

                    if (foundProfile) {
                        foundProfile.dislikedProfiles.push(profileId);

                        foundProfile.save((err, newProfile) => {
                            if (err) return res.status(404).send();

                            if (newProfile) {
                                return res.status(200).send();
                            }
                        });
                    }
                })
            }
        });
}

/**
 * This controller handles sending all the available userl to the front end so it can be displayed to the user.
 * I will try and make this only one function so that its cleaner to read. I decided to clean up my code by 
 * importing several functions.
 */

exports.getUserProfiles = async function (req, res) {
    let { sort, filter, match } = req.query;

    sort = sort && JSON.parse(sort);
    filter = filter ? JSON.parse(filter) : {};
    match = match === 'true';
    const profileApi = new ProfileAPI(req.currentProfile, { match });

    const profilesToSee = await profileApi.list(filter, sort);
    res.json(profilesToSee);
};

/**
 * This will send the frontend some simple data to display it there.
 */

exports.getSimpleUserDetails = function (req, res) {

    const { id } = req.params;

    User.findOne({ _id: id })
        .populate('profile')
        .exec((err, foundUser) => {
            if (err) console.log(err);


            if (foundUser) {
                const userDetails = {
                    profileImage: foundUser.profile.profileImage,
                    fullname: foundUser.profile.firstName + ' ' + foundUser.profile.lastName,
                    matches: foundUser.profile.matches,
                    liked: foundUser.profile.likedProfiles,
                    disliked: foundUser.profile.dislikedProfiles,
                    likedMyProfileNotifications: foundUser.profile.likedMyProfileNotification,
                    viewedMyProfiileNotifications: foundUser.profile.visitedMyProfileNotifications,
                    profileId: foundUser.profile._id,
                    userHistory: foundUser.profile.history,
                    matchNotifications: foundUser.profile.matchNotifications,
                    interests: foundUser.profile.interests,
                    interestedIn: foundUser.profile.interestedIn,
                    bio: foundUser.profile.bio,
                    age: foundUser.profile.age,
                    unmatchedNotifications: foundUser.profile.unmatchedNotifications,
                    blockedMyProfile: foundUser.profile.blockedMyProfile,
                    messageNotifications: foundUser.profile.messageNotifications,
                    customLocation: foundUser.profile.customLocation,
                    firstName: foundUser.profile.firstName,
                    lastName: foundUser.profile.lastName
                }
                return res.status(200).json(userDetails);
            }
        })

}
/**
 * This controller handles changing the list of interests to a give profile. This will delete the interest provided.
 */

exports.deleteInterest = function (req, res) {
    const { interest, id } = req.body;

    Profile.updateOne({ _id: id }, { $pull: { interests: { $in: [interest] } } }, (err, success) => {
        if (err) return res.status(404).send();

        if (success) {
            return res.status(200).send();
        }
    })
}


/**
 * This controller will update the given profile's interest tags. and return a success status to re render the page
 * so the front end can display the changes in the data base.
 */

exports.uploadInterest = function (req, res) {
    const { interest, id } = req.body;

    Profile.findById({ _id: id }, (err, foundProfile) => {
        if (err) return res.status(404).send();

        if (foundProfile) {
            foundProfile.interests.push(interest);

            foundProfile.save((err, success) => {
                if (err) return res.status(404).send();
                if (success) return res.status(200).send();
            })
        }
    });
}

/**
 * This controller handles the change of a user's profile image. Then it will swap the images that the user selected.
 */
exports.changeProfileImage = function (req, res) {
    const { image, id, index } = req.body;

    Profile.findById({ _id: id }, (err, foundProfile) => {
        if (err) return res.status(404);

        if (foundProfile) {
            const oldProfileImage = foundProfile.profileImage;

            foundProfile.profileImage = image;
            foundProfile[index] = oldProfileImage;

            foundProfile.save((err, newUser) => {
                if (err) return res.status(404).send();

                if (newUser) return res.status(200).send();
            })
        }
    });
}

/**
 * 
 */
exports.uploadOtherProfileImage = function (req, res) {
    const { number, id } = req.params;

    singleUpload(req, res, function (err) {
        if (err) {
            return res.status(422).send({ errors: [{ title: 'Image upload error', description: 'Error while uploading image.' }] });
        } else {
            Profile.findById({ _id: id }, function (err, foundProfile) {
                if (err) {
                    return res.status(422).send({ errors: [{ title: 'user not found', description: 'User not found.' }] });
                }

                if (foundProfile && req.file.location) {
                    const fieldname = `profileImage${number}`;

                    foundProfile[fieldname] = req.file.location;

                    foundProfile.save((err) => {
                        if (err) console.log(err);
                    });
                    return res.json({ 'imageUrl': req.file.location });
                } else {
                    return res.status(404).send({ errors: [{ title: 'Error uploading image', description: 'Error while uploading image' }] });
                }
            });
        }
    })
}

/**
 * This controller handles uploading images to aws and returning a image url string from there.
 */

exports.uploadImageToAWS = function (req, res) {
    const { id } = req.params;

    singleUpload(req, res, function (err) {
        if (err) {
            return res.status(422).send({ errors: [{ title: 'image upload error', description: 'Error while uploading image. must be type jpeg or png' }] });
        } else {
            //find user and change their profile picture to the most recent one selected.
            Profile.findById({ _id: id }, function (err, foundProfile) {
                if (err) {
                    res.status(422).send({ errors: [{ title: 'User not found', description: 'User not found' }] });
                }

                if (foundProfile) {
                    foundProfile.profileImage = req.file.location;
                    foundProfile.save();
                }
            });
            return res.json({ 'imageUrl': req.file.location });
        }
    })
}

/**
 *  This controller will change the email address assigned to the user. The new one will be the one 
 * passed in from the forms they have to fill in...
 */

exports.changeUserEmailAddress = function (req, res) {
    const { newEmail, id, token } = req.body;

    // Double check if the user already exists.
    User.findOne({ email: newEmail }, (err, alreadyAUser) => {
        if (alreadyAUser) {
            return res.status(401).send({ errors: [{ title: 'This email already belongs to a user', description: 'This email aready belongs to a user.' }] });
        }

        if (!alreadyAUser) {
            User.findById({ _id: id }, function (err, foundUser) {
                if (err) return res.status(404).send({ errors: [{ title: 'There was an error retrieving your account.', description: 'Error fetching account.' }] });

                if (foundUser && foundUser.verificationToken === token) {
                    foundUser.email = newEmail;
                    foundUser.verificationToken = '';

                    foundUser.save((err, newUser) => {
                        if (err) return res.status({ errors: [{ title: 'Error saving new email address' }] });

                        if (newUser) {
                            const token = jwt.sign({
                                userId: newUser._id,
                                username: newUser.username
                            }, config.SECRET, { expiresIn: '1hr' });

                            return res.status(200).json(token).send();
                        }
                    })
                } else {
                    return res.status(404).send({ errors: [{ title: 'You already changed your email', description: 'You\'ve already changed your email with this link.' }] })
                }
            });
        }
    });
}


/**
 * This controller will send an email to the current user requesting a email address change to their account.
 * This simply sends the email. The email change will happen in the controller above.
 */

exports.sendUserEmailChange = function (req, res) {
    const { id } = req.body;

    User.findById({ _id: id }, (err, foundUser) => {
        if (err) return res.status(404).send({ errors: [{ title: 'User not found', description: 'User not found. if problem presists. please contact Pedro Nunez' }] });

        if (foundUser) {
            const token = cryptoToken(30);
            const { email } = foundUser;

            foundUser.verificationToken = token;
            foundUser.save((err, newUser) => {
                if (!err) {
                    const htmlEmail = `
                    <div style={{textAlign:'center'}}>
                        <h1 style={{color: 'red'}}>Change Email Address For Matcha: </h1>
                        <p>Please understand that by clicking the link below you will no longer recieve email to this address.
                            the link below will take you to a form where you can change your email address.
                        </p>
    
                        <h3>Make sure you have access to the new email address before you do this. This is irreversible.</h3>
                        <a style={{color: 'red'}} href='http://localhost:3000/changeuseremailaddress/${newUser._id}/${newUser.verificationToken}' >Change Email Address For Matcha Account</a>
                    </div>
                `;

                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        auth: {
                            user: config.GMAIL,
                            pass: config.GMAIL_PASSWORD
                        }
                    });

                    const mailOptions = {
                        from: 'smediaxp42@gmail.com',
                        to: email,
                        replyTo: 'smediaxp42@gmail.com',
                        subject: 'Change matcha email address',
                        text: 'Follow instructions to reset your email address',
                        html: htmlEmail
                    }

                    transporter.sendMail(mailOptions, err => {
                        if (err) return console.log(err);

                        return res.status(200).send();
                    });
                }
            });


        }
    });
}


/**
 * This controller will handle the change of a users first name, last name but most importantly their location.
 * If they decide to change their locations, they will no longer have the option to change it via automatic tracking.
 * I have to make a new field on the schema if this happens so i no longer have to send api request for their location.
 */

exports.changeUserInformation = function (req, res) {
    const { id, location, first, last } = req.body;

    Profile.findById({ _id: id }, function (err, foundUserProfile) {
        if (err) throw err;

        if (first !== foundUserProfile.firstName) {
            foundUserProfile.firstName = first;
        }

        if (last !== foundUserProfile.lastName) {
            foundUserProfile.lastName = last;
        }

        if (location !== foundUserProfile.customLocation && location !== '') {
            foundUserProfile.customLocation = location;
        }
        foundUserProfile.save((err, savedProfile) => {
            if (err) throw err;

            return res.status(200).json(savedProfile);
        })
    })
}


/**
 * this controller handles the change in the users bio and returns the new one so it can be set to the state. 
 */

exports.changeUserBio = function (req, res) {
    const { bio, userId } = req.body;

    User.findById({ _id: userId })
        .populate('profile')
        .exec((err, foundUser) => {
            if (err) {
                return res.status(401).send({ errors: [{ title: 'User not found', description: 'User was not found...' }] })
            }

            Profile.findById({ _id: foundUser.profile._id }, function (err, foundProfile) {
                if (foundProfile.bio !== bio) {
                    foundProfile.bio = bio;

                    foundProfile.save((err, newBio) => {
                        if (err) {
                            return res.status(404).send({ errors: [{ title: 'Error saving bio', description: 'An error occurred while saving bio.' }] });
                        } else {
                            return res.status(200).json(newBio.bio);
                        }
                    });
                } else {
                    return res.status(404).send({ errors: [{ title: 'Bios are the same', description: 'the bio provided was the same.' }] })
                }
            });
        });
}


/**
 * this controller will change the users location if the api returns a different city than the one saved on file.
 * it will also return the old one and the new one to show the user that it was handeled already and no need to change
 * it themselves. saves time and also saves more work lol.
 */

exports.changeCurrentLocation = function (req, res) {
    const { userId, location } = req.body;

    User.findById({ _id: userId })
        .populate('profile', '_id')
        .exec((err, foundDocument) => {
            const { _id } = foundDocument.profile;

            Profile.findById({ _id: _id }, (err, foundDocument) => {
                if (foundDocument.location !== location) {
                    foundDocument.location = location;

                    foundDocument.save()
                        .then(() => {
                            return res.status(200).json(foundDocument);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).end();
                        });
                } else {
                    return res.status(206);
                }
            });
            return res.status(206);
        });
}




/**
 * This controller is in charge of sending all the user profile information to what ever user is signed in.
 * There will be a seperate route to handle other users profiles that will include less information.
 * The less information on there responses the higher security the app has.
 */
exports.getCurrentProfileById = function (req, res) {
    const { id } = req.params;

    User.findOne({ _id: id })
        .populate('profile')
        .exec(function (err, userProfile) {
            /**
             * I was unable to research if this was a good way to only return the user information from within the profile schema.
             * by returning userProfile, I was returning all the information including password and email... 
             * If there is a better way to do this. go ahead.
             */
            const onlyProfile = userProfile.profile;
            if (err) {
                return res.status(500).send({ errors: [{ title: 'User profile not found', description: 'This is our fault. We apologize' }] });
            }

            if (userProfile) {
                return res.status(200).json(onlyProfile);
            }
        });
}

/**
 * This controller will change the users choice of gender attaction. The new document in the database will be returned once the change
 * has been made. future updates include changing others documents if they liked the person and they are no longer attracted to that sex.
 */

exports.changeInterestedGender = function (req, res) {
    const { gender, id } = req.body;

    User.findById({ _id: id })
        .populate('profile')
        .exec(function (err, foundDocument) {
            if (err) {
                return res.status(404).send({ errors: [{ title: 'Something went wrong', description: 'Something went wrong... this is pedro\'s' }] })
            }

            Profile.findById({ _id: foundDocument.profile._id }, function (err, editableProfile) {
                editableProfile.interestedIn = gender;

                editableProfile.save((err, newUser) => {
                    if (err) console.log(err);

                    return res.status(200).json(newUser.interestedIn);
                });
            })
        });
}


/**
 *  this controller returns the user iformation assigned to the user id passed into it. 
 * it will return the user information minus the user's password
 */

exports.getCurrentUserInformation = function (req, res) {
    const { id } = req.params;

    User.findById({ _id: id }, (err, foundUser) => {
        if (err) return res.status(401).json(err);

        if (!foundUser) return res.status(404).send({ errors: [{ title: 'The user was not found', description: 'User not found.' }] });

        const returnedUser = {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
        };

        return res.status(200).json(returnedUser);
    })
}