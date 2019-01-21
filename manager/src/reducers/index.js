import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

/*import component level reducers*/
import admin from "./admin";
import dashboard from "./dashboard";
import taxes from "./taxes";
// import users from "./users";

export const reducers = combineReducers({
    routing: routerReducer,
    form: formReducer,
    admin: admin,
    dashboard: dashboard,
    taxes:taxes
});