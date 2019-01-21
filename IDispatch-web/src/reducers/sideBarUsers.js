import { SIDEBAR_USERS_SUCCESS, SIDEBAR_USER_ADD_TO_LIST,SIDEBAR_USERS_FAILURE } from './ActionTypes';
// import { stat } from 'fs';
const initialState = {
	users: [],
}
export const sidebarUser = (state = initialState, { type, payload }) => {
	switch (type) {
		case SIDEBAR_USERS_SUCCESS: {
			return { ...state, ...payload };
		}
		case SIDEBAR_USER_ADD_TO_LIST:{
			let objCopy = JSON.parse(JSON.stringify(state));
			objCopy.users=[...state.users,...payload.users];
			return {...state,...objCopy}
		}
		case SIDEBAR_USERS_FAILURE: {
			return { ...state, error: payload }
		}
		default:
			return state;
	}
};

