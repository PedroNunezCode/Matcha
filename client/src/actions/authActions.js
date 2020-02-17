import axios from 'axios';
import authService from '../services/auth-service';

import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT,
    RESET_PASSWORD_EMAIL_SENT,
    ACCOUNT_VERIFICATION_SUCCESS,
    CURRENT_CITY_LOCATION_SUCCESS,
} from './types';

    
/**
 * This function will remove the jwt token from the local storage.
 * This will then reflect on the users front end logging them out,
 * not allowing them to visit pages that have been marked as private.
 */
export const logout = () => {
    authService.invalidateUser();
    return {
        type: LOGOUT,
    }
}

/**
 * Login failure is a function that will dispatch the errors to the database.
 * This will allow for simpler error management in the front end.
 */
const loginFailure = (errors) => {
    return {
        type: LOGIN_FAILURE,
        errors
    }
}

/**
 * The function below will trigger a change in the state. It will also,
 * assign the users id and username to the state. that will later be used
 * to fetch their profiles and assigning it to others history.  
 */
const loginSuccess = () => {
    const username = authService.getUsername();
    const user_id = authService.getUserId();

    return {
        type: LOGIN_SUCCESS,
        username,
        user_id
    }
}

/**
 * This action will fetch a post request to the backend where i handle,
 * the users passwords and compare them to the one in the database.
 * After and only if the fetch is successful, The an auth token,
 * will be set to local storage when an external function will,
 * read that token and allow an user to visit pages that are private.
 * corresponding error dispatch if the request requires so.
 */

export const login = (creds) => {
    return dispatch => {
        return axios.post('/api/v1/auth/login', creds)
            .then(res => res.data)
            .then(token => {
                authService.saveToken(token);
                dispatch(loginSuccess());
            })
            .catch(({ response }) => {
                dispatch(loginFailure(response.data.errors));
            });
    }
}

/**
 * This function fires the reducer for the registration errors.
 */

const registerFailure = (errors) => {
    return {
        type: REGISTER_FAILURE,
        errors
    }
}

/**
 * Register success will dispatch a state change that will allow me to display
 * instructions on the frontend once a user signs up for matcha.
 */

const registerSuccess = () => {
    return {
        type: REGISTER_SUCCESS,
    }
}

/**
 * The following action will send a post request to the api where,
 * it will check to see if a user is able to register a new account.
 * corresponding errors will be handled.
 */

export const register = (user) => {
    return dispatch => {
        return axios.post('/api/v1/auth/register', user)
            .then(res => {
                if (res.status === 200) {
                    dispatch(registerSuccess());
                }
            })
            .catch(({ response }) => {
                dispatch(registerFailure(response.data.errors));
            });
    }
}

const loginValidationSuccess = () => {
    return {
        type: ACCOUNT_VERIFICATION_SUCCESS,
    }
}

/**
 * validate login action will log a user in. this means send a request to,
 * the api and check if the passwords match to the one in the database.
 * A jwt token will be set to the local storage if the user is able to sign in,
 * otherwise the corresponding errors will be handled.
 */

export const validateLogin = (data) => {
    return dispatch => {
        return axios.post(`/api/v1/auth/validatelogin`, data)
            .then(res => res.data)
            .then(token => {
                authService.saveToken(token);
                dispatch(loginSuccess());
            })
            .then(() => {
                dispatch(loginValidationSuccess());
            })
            .catch(({ response }) => {
                dispatch(loginFailure(response.data.errors));
            })
    }
}

/**
 * the following function will check the localstorage if the token in there,
 * is valid to use for authenticaion. The purpose for this function is to,
 * handle current time authentication every time a user wants to visit private
 * pages or tries to do anything that requires authentication.
 */

export const checkAuthState = () => {
    return dispatch => {
        if (authService.isAuthenticated()) {
            dispatch(loginSuccess());
        }
    }
}

/**
 * This function will trigger a state change to validate a user's action of
 * requesting a new password. This will be displayed on the form at the 
 * "resetPassword" react component.
 */

const resetPasswordEmailSent = () => {
    return {
        type: RESET_PASSWORD_EMAIL_SENT
    }
}

/**
 * This action will send a post request to the api to send them an email,
 * with a token that they can then use to change their password.
 * A success message will be returned if their account exists.
 * otherwise the errors will also be displayed on the frontend.
 */

export const resetPassword = (email) => {
    return dispatch => {
        return axios.post('/api/v1/auth/resetpassword', email)
            .then(res => res.data)
            .then(dispatch(resetPasswordEmailSent()));
    }
}

/**
 * This is the action that will trigger a state change in the database.
 * it will send a post request to the api, with the new data aka password.
 * If the action is successfull then the corresponding auth token will be set
 * to the localstorage. otherwise corresponding errors will be shown.
 */

export const confirmPasswordReset = (data) => {
    return dispatch => {
        return axios.post('/api/v1/auth/confirmpasswordreset', data)
            .then(res => res.data)
            .then(token => {
                authService.saveToken(token);
                dispatch(loginSuccess());
            })
            .catch(({ response }) => {
                dispatch(loginFailure(response.data.errors));
            })
    }
}

/**
 * This function handles setting the user's current city to the state of the application.
 * That way they can see what city they are located in. Future updates include pushing their
 * location to the database so if they go to another city that will come up on others list
 */

const currentLocationSuccess = (city, state, coordinates) => {
    return {
        type: CURRENT_CITY_LOCATION_SUCCESS,
        city,
        state,
        coordinates,
    };
};

/**
 * This action will be used to get the users location by getting their ip
 * address from their browser and sending it to the backend when they log in.
 * mock call
 * todo: remove this comment
 * return new Promise((resolve) => {
            const res = {
                data: {
                    city: 'Fremont',
                    state_prov: 'California',
                    latitude: '37.47180',
                    longitude: '-121.92000',
                }
            }
            resolve(res);
        })
 */

export const getCurrentLocation = () => {
    console.log('gets triggered')
    const proxy = 'http://cors-anywhere.herokuapp.com/';
    const api = `${proxy}https://api.ipgeolocation.io/ipgeo?apiKey=273a6bc3502d4f6199687b8aa26e13b8`;
    return dispatch => {
        return axios.get(api)
            .then((res) => {
            const coordinates = [Number(res.data.longitude), Number(res.data.latitude)];
            dispatch(currentLocationSuccess(res.data.city, res.data.state_prov, coordinates));
        });
    };
};
