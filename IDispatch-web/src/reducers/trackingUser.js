import { TRACKING_USERS_SUCCESS,TRACK_USER_UPDATE_LOCATION,TRACKING_USERS_FAILURE } from './ActionTypes';

const initialState={
    users:null
}

export const trackingUser = (state=initialState , { type, payload }) => {
	switch (type) {
    	case TRACKING_USERS_SUCCESS: {
      		return { ...state, users:payload };
    	}
    	case TRACKING_USERS_FAILURE: {
      		return { ...state, error: payload }
		}
		case TRACK_USER_UPDATE_LOCATION:{
			let objCopy = JSON.parse(JSON.stringify(state));
			return { ...state, ...objCopy };
		}
    	default:
      		return state;
  	}
};

