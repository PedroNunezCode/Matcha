const express = require('express');
const router = express.Router();

const imageController = require('../controllers/profile');

router.post('/upload-image/:id', imageController.uploadImageToAWS);
router.post('/upload-images/:number/:id', imageController.uploadOtherProfileImage);
router.post('/change-profile-image', imageController.changeProfileImage);

module.exports = router;