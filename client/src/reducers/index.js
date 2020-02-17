import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { authReducers } from './auth-reducer';
import { locationReducers } from './location-reducer';
import { imageReducers } from './image-reducer';
import { profileReducers } from './profile-reducers';


export const init = () => {
    const reducers = combineReducers({
        auth: authReducers,
        location: locationReducers,
        image: imageReducers,
        profile: profileReducers,
    });
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

    return store;

}