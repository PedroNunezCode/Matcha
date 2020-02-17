import {
    SET_USER_INFORMATION,
    SET_USER_PROFILES,
    CLEAR_NOTIFICATIONS,
    SET_SEARCH_PROFILES,
    SET_CHAT_FLAG
} from '../actions/types'

const INITIAL_STATE = {
    userProfileImage: '',
    fullName: '',
    profileId: '',
    matches: [],
    likedMyProfile: [],
    userProfiles: [],
    liked: [],
    disliked: [],
    likedMyProfileNotifications: [],
    viewedMyProfileNotifications: [],
    userHistory: [],
    matchNotifications: [],
    unmatchedNotifications: [],
    interests: [],
    interestedIn: '',
    bio: '',
    age: null,
    blockedMyProfile: [],
    searchProfiles: [],
    messageNotifications: [],
    chatFlag: [],
    customLocation: '',
    firstName: '',
    lastName: '',
}

export const profileReducers = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_USER_INFORMATION:
            return Object.assign({}, state, {
                userProfileImage: action.userInformation.profileImage,
                fullName: action.userInformation.fullname, matches: action.userInformation.matches,
                liked: action.userInformation.liked, disliked: action.userInformation.disliked,
                likedMyProfileNotifications: action.userInformation.likedMyProfileNotifications,
                viewedMyProfileNotifications: action.userInformation.viewedMyProfiileNotifications,
                profileId: action.userInformation.profileId, userHistory: action.userInformation.userHistory,
                matchNotifications: action.userInformation.matchNotifications, interests: action.userInformation.interests,
                interestedIn: action.userInformation.interestedIn, bio: action.userInformation.bio, age: action.userInformation.age,
                unmatchedNotifications: action.userInformation.unmatchedNotifications, blockedMyProfile: action.userInformation.blockedMyProfile,
                messageNotifications: action.userInformation.messageNotifications, customLocation: action.userInformation.customLocation,
                firstName: action.userInformation.firstName, lastName: action.userInformation.lastName,
            });
        case SET_CHAT_FLAG: 
            return Object.assign({}, state, {chatFlag: action.user});
        case CLEAR_NOTIFICATIONS:
            return Object.assign({}, state, { likedMyProfileNotifications: [], viewedMyProfileNotifications: [], matchedNotifcations: [], unmatchedNotifications: [], });
        case SET_USER_PROFILES:
            return Object.assign({}, state, { userProfiles: action.users });
        case SET_SEARCH_PROFILES:
            return Object.assign({}, state, {searchProfiles: action.users}, )
        default:
            return state;
    }
}