const express = require('express');
const router = express.Router();

const controller = require('../controllers/chat');
const loadCurrentProfile = require('../middlewares/loadCurrentProfile');

router.get('/messages/list/:profileId', loadCurrentProfile, controller.list);

module.exports = router;
