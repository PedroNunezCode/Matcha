const express = require('express');
const router = express.Router();

const profileControllers = require('../controllers/profile');
const loadCurrentProfile = require('../middlewares/loadCurrentProfile');

router.post('/block-user', profileControllers.blockUser);
router.post('/change-user-age', profileControllers.changeUserAge);
router.post('/disconnect-from-user', profileControllers.disconnectFromUser);
router.post('/report-fake-account/:username', profileControllers.reportFakeAccount);
router.post('/delete-notification', profileControllers.deleteNotification);
router.post('/visitprofile', profileControllers.visitProfile);
router.post('/clear-notifications/:id', profileControllers.clearNotifications);
router.post('/dislike-user', profileControllers.dislikeUser);
router.post('/like-user', profileControllers.likeUser);
router.get('/getuserprofiles/:profileId', loadCurrentProfile, profileControllers.getUserProfiles);
router.get('/get-simple-details/:id', profileControllers.getSimpleUserDetails);
router.post('/uploadinterest', profileControllers.uploadInterest);
router.get('/getcurrentprofilebyid/:id', profileControllers.getCurrentProfileById);
router.get('/getcurrentuserinformation/:id', profileControllers.getCurrentUserInformation);
router.post('/changeinterestedgender', profileControllers.changeInterestedGender);
router.post('/changecurrentlocation', profileControllers.changeCurrentLocation);
router.post('/changeuserbio', profileControllers.changeUserBio);
router.post('/changeuserinformation', profileControllers.changeUserInformation);
router.post('/senduseremailchange', profileControllers.sendUserEmailChange);
router.post('/changeuseremailaddress', profileControllers.changeUserEmailAddress);
router.post('/deleteinterest', profileControllers.deleteInterest);

module.exports = router;