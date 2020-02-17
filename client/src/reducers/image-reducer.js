import {
    IMAGE_UPLOAD_FAILURE,
    IMAGE_UPLOAD_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
    fileUploadSuccess: Boolean,
    errors: [],

}

export const imageReducers = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case IMAGE_UPLOAD_SUCCESS:
            return Object.assign({}, state, { fileUploadSuccess: true, errors: [] });
        case IMAGE_UPLOAD_FAILURE:
            return Object.assign({}, state, { fileUploadSuccess: false, errors: action.errors });
        default:
            return state;
    }
}