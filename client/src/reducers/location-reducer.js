import { CURRENT_CITY_LOCATION_SUCCESS } from "../actions/types";

const INITITAL_STATE = {
    city: '',
    state: '',
    name: '',
    coordinates: [],
};

export const locationReducers = (state = INITITAL_STATE, action) => {
    switch(action.type){
        case CURRENT_CITY_LOCATION_SUCCESS:
            return Object.assign({}, state, {
                city: action.city,
                state: action.state,
                name: `${action.city}, ${action.state}`,
                coordinates: action.coordinates,
            });
        default:
            return state;
    }
};
