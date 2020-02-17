import axios from 'axios';
import authService from "../services/auth-service";

import {
    EMAIL_CHANGE_FAILURE,
    EMAIL_CHANGE_SUCCESS,
    SET_USER_INFORMATION,
    SET_USER_PROFILES,
    CLEAR_NOTIFICATIONS,
    SET_SEARCH_PROFILES,
    SET_CHAT_FLAG
} from './types';

/**
 * this action handles blocking the user that the current profile selected.
 */

 export const blockUser = (data) => {
     return axios.post('/api/v1/profile/block-user', data) 
        .then(res => res.status)
 }


/**
 * this action will change a users age.
 */

export const changeAge = (data) => {
    return axios.post('/api/v1/profile/change-user-age', data)
        .then(res => res.status);
}
/**
 * This action will disconnect a user from a profile there were once connected to
 */

export const disconnectFromUser = (data) => {
    return dispatch => {
        return axios.post('/api/v1/profile/disconnect-from-user', data)
            .then(res => {
                dispatch(getBasicDetails());
                return res.status;
            });
    }
}

/**
 * This action will report a fake account
 */
export const reportAsFakeAccount = (username) => {
    return axios.post(`/api/v1/profile/report-fake-account/${username}`)
        .then(res => res.status)
        .catch(err => console.log(err));
}

const sendChatFlag = (user) => {
    return {
        type: SET_CHAT_FLAG,
        user,
    }
    
}
/**
 * this action will delete the notification that the user specified.
 */

export const deleteNotification = (data) => {
    return dispatch => {
        return axios.post('/api/v1/profile/delete-notification', data)
            .then((res) => {
                if(res.data.reason === "has sent you a message!"){
                    dispatch(sendChatFlag(res.data));
                }
                dispatch(getBasicDetails());
                return res.data;
            })

    }
}

/**
 * this action will get a users profile and return the object to display it.
 */

export const visitUsersProfile = (data) => {
    return axios.post(`/api/v1/profile/visitprofile`, data)
        .then(res => res.data);
}

/**
 * this function will trigger a state change so the user notifications dissapear
 */

const clearNotificationss = () => {
    return {
        type: CLEAR_NOTIFICATIONS,
    }
}
/**
 * This action clear a users notifications.
 */
export const clearNotifications = (userId) => {
    return dispatch => {
        return axios.post(`/api/v1/profile/clear-notifications/${userId}`)
            .then(() => {
                dispatch(clearNotificationss());
            })
    }
}

/**
 * This action handles liking the user passed in from the frontend.
 */

export const likeUser = (data) => {
    return dispatch => {
        return axios.post('/api/v1/profile/like-user', data)
        .then(res => {
            dispatch(getBasicDetails());
            return res.data;
        });
    }
}



/**
 * This action will handle the disliking the user passed in from the frontend.
 */

export const dislikeUser = (data) => {
    return axios.post('/api/v1/profile/dislike-user', data)
        .then(res => res.status);
}

const setSearchProfiles = (users) => {
    return {
        type: SET_SEARCH_PROFILES,
        users
    }
}

export const searchProfiles = (profileId, filters) => {
    const encodedFilters = convertJSONToUrlParams(filters);

    return async dispatch => {
        const res = await axios.get(`/api/v1/profile/getuserprofiles/${profileId}?${encodedFilters}`);
        return dispatch(setSearchProfiles(res.data));
    };
};

export const setSearchProfilesToEmptyArray = () => {
    return dispatch => dispatch(setSearchProfiles([]));
}

/**
 * this function will send all the available users to the front end to display them.
 */

const setUserProfiles = (users) => {
    return {
        type: SET_USER_PROFILES,
        users
    }
}

const convertJSONToUrlParams = (params) => {
    let query = "";
    for (const key in params) {
        if (params[key] !== null && typeof params[key] !== 'undefined')
            query +=
                `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
    }

    return query;
}

/**
 * Fetches filtered list of user profiles
 * @param {ObjectID|String} profileId current user profile id
 * @param {Object} filters filter for search
 * @returns {Array}
 */

export const getProfiles = (profileId, filters) => {
    const encodedFilters = convertJSONToUrlParams(filters);

    return async dispatch => {
        const res = await axios.get(`/api/v1/profile/getuserprofiles/${profileId}?${encodedFilters}`);
        return dispatch(setUserProfiles(res.data));
    };
};

/**
 * this function will trigger a change in the state and include all the
 * user information that is necessary for the page to work.
 */

const setBasicDetails = (userInformation) => {

    return {
        type: SET_USER_INFORMATION,
        userInformation
    }
}

/**
 *  This action will take some of the basic details of the user and set
 * them to the store so they can be used as props. this will be helpful
 * for the landing page and for the chat section of the page. They will
 * be used a lot there.
 */

export const getBasicDetails = () => {
    
    const id = authService.getUserId();

    return dispatch => {
        return axios.get(`/api/v1/profile/get-simple-details/${id}`)
            .then(res => {
                dispatch(setBasicDetails(res.data));
            })
            .catch(({ response }) => {
                console.log(response)
            })
    }
}

/**
 * This action will handle deleting the interest the user requested from their profile.
 */

export const deleteInterest = (data) => {
    return axios.post('/api/v1/profile/deleteinterest', data)
        .then(res => res.status);
}

/**
 * uploads interest to the array of interests of the desired user profile. this will be a different function,
 * than the one that deletes the interest from the users profile.
 */

export const uploadInterest = (data) => {
    return axios.post('/api/v1/profile/uploadinterest', data)
        .then(res => res.status);
}

/**
 * This action will handle changing the users profile image and setting the old profile image as their old one.
 */

export const makeProfileImage = (data) => {
    return axios.post('/api/v1/image/change-profile-image', data)
        .then(res => res.data)
        .catch((err) => {
            console.log(err);
        })
}

/**
 * This action will update the user's object of images. given the spot in the object. it will
 * update it and display it on the front end.
 */

export const uploadImage = (info) => {
    const { id, image, number } = info;

    const formData = new FormData();
    formData.append('image', image);

    return axios.post(`/api/v1/image/upload-images/${number}/${id}`, formData)
        .then(res => res.data);
}

/**
 * This action is specifically for the profile image of the user. it will send the image as
 * form data that the server can then turn into an url and store it into the profile image
 * document of the user that requested it.
 */
export const changeProfileImage = (info) => {
    const { id } = info;
    const { image } = info;

    const formData = new FormData();
    formData.append('image', image);

    return axios.post(`/api/v1/image/upload-image/${id}`, formData)
        .then(res => {
            return res.data.imageUrl;
        })
        .catch(({ response }) => {
            console.log(response.data.errors[0]);
        })
}

const emailChangeSuccess = () => {
    return {
        type: EMAIL_CHANGE_SUCCESS,
    }
}

/**
 * this function will handle all the errors if any that the api sends back to change someones email.
 */

export const changeEmailAddressFailure = (errors) => {
    return {
        type: EMAIL_CHANGE_FAILURE,
        errors
    }
}

/**
 * This action will handle CHANGING the email address of the requested user. This will also return 
 * the new information assigned to the user, log them out and assign a new jwt token with their
 * corresponding credentials.
 */

export const changeEmailAddress = (data) => {
    return dispatch => {
        return axios.post('/api/v1/profile/changeuseremailaddress', data)
            .then(res => res.data)
            .then(token => {
                authService.invalidateUser();
                authService.saveToken(token);
                dispatch(emailChangeSuccess());
            })
            .catch(({ response }) => {
                dispatch(changeEmailAddressFailure(response.data.errors));
            });
    }
}

/**
 * This action will handle sending a user an email address with a link to reset their email address.
 * They will be able to change their account email address from there.
 */

export const sendUserEmailChange = (id) => {
    return axios.post('/api/v1/profile/senduseremailchange', { id: id })
        .then(res => res.status)
}

/**
 * this action will change the location of the user in the database if they have a different
 * one on file or if they have no location set on file.
 */

export const changeUsersLocation = (data) => {
    return axios.post('/api/v1/profile/changecurrentlocation', data)
        .then(res => res.data);
}

/**
 * This action handles the change in the bio of a user. return the new one to let a user 
 * know that they have successfully changed thier bio.
 */

export const changeUserBio = (newBio) => {
    return axios.post('/api/v1/profile/changeuserbio', newBio)
        .then(res => res.data)
}


/**
 * This action in specific handles the change of important part of the users bio. It will change
 * a users name, last name , and location. returns the new user information to display the success
 * messages on the front end 
 */
export const changeUserDetails = (details) => {
    return axios.post('/api/v1/profile/changeuserinformation', details)
        .then(res => res.data)
}

/**
 * This action will change the gender a user is attracted to. Once this changes, There should
 * be a state change in the front end so the user can see their change. after this is done.
 * future updated can maybe be removing the users that liked the person if they change 
 * their preference of sexual attraction.
 */
export const updateInterestedGender = (data) => {
    return axios.post('/api/v1/profile/changeinterestedgender', data)
        .then(res => res.data)
}

/**
 * This action will fetch the id passed into it from the initial render of the user's profile.
 * This action will only be accessed when a component renders for the first time.
 * This action will not be the same that is used to map a list of the people that have liked
 * anothers profile. This will return the object containing all the information from the users 
 * documents in the database. Except for their passwords ;)
 */

export const getCurrentProfileById = (userId) => {

    return axios.get(`/api/v1/profile/getcurrentprofilebyid/${userId}`)
        .then(res => res.data)
        .catch(({ response }) => {
            console.log(response.data.errors)
        });
}

/**
 * this action will retrive the users information from the api. Then it will return it so it can 
* be accessed in the front end.
 */

export const getCurrentUserInformation = (id) => {
    return axios.get(`/api/v1/profile/getcurrentuserinformation/${id}`)
        .then(res => res.data)
        .catch(err => console.log(err));
}
