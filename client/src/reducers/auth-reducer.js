import { 
    REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, RESET_PASSWORD_EMAIL_SENT, 
    ACCOUNT_VERIFICATION_FAILURE, ACCOUNT_VERIFICATION_SUCCESS, REGISTER_FAILURE, EMAIL_CHANGE_FAILURE, EMAIL_CHANGE_SUCCESS

} from '../actions/types';

const INITIAL_STATE = {
    isAuth: false,
    errors: [],
    username: '',
    userId: '',
    successfullRegister: false,
    passwordResetEmailSent: false,
    verifiedAccount: false,
    changedEmailAddress: false,
}

export const authReducers = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {isAuth: true, errors: [], username: action.username, userId: action.user_id});
        case LOGIN_FAILURE:
            return Object.assign({}, state, {errors: action.errors});
        case REGISTER_SUCCESS:
            return Object.assign({}, state, {successfullRegister: true, errors:[]});
        case REGISTER_FAILURE:
            return Object.assign({}, state, {successfullRegister: false, errors: action.errors});
        case LOGOUT:
            return Object.assign({}, state, {isAuth: false, errors:[]});
        case RESET_PASSWORD_EMAIL_SENT:
            return Object.assign({}, state, {passwordResetEmailSent: true});
        case ACCOUNT_VERIFICATION_SUCCESS:
            return Object.assign({}, state, {verifiedAccount: true});
        case ACCOUNT_VERIFICATION_FAILURE:
            return Object.assign({}, {errors: action.errors});
        case EMAIL_CHANGE_FAILURE:
            return Object.assign({}, state, {errors: action.errors});
        case EMAIL_CHANGE_SUCCESS:
            return Object.assign({}, state, {isAuth: true, errors:[], changedEmailAddress: true});
        default:
            return state;
    }
}