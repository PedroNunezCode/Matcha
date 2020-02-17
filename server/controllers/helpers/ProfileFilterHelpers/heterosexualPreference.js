const { User, Profile } = require('../../../models/User');

exports.filterProfilesByHererosexualPreference = async function(profilesToFilter, currentProfileId){
    let profiles = [];

   const filteredProfiles = await Profile.findById({_id: currentProfileId});
    return profiles;
}