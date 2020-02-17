const { User, Profile } = require('../models/User');

/**
 * Load curremt profile if profile id is present.
 * 
 * Throws 400 if current profile could not have been found
 */

const loadCurrentProfile =  async (req, res, next) => {
    const { profileId } = req.params;
    let currentProfile = null;

    if (profileId)
        currentProfile = await Profile.findById({ _id: profileId });
    if (!currentProfile)
        res.status(400).json({ error: 'Could not load profile for current user' });
    req.currentProfile = currentProfile;
    next();
};

module.exports = loadCurrentProfile;
