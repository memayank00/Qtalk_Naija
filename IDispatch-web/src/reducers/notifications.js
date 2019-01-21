import {NOTIFICATIONS_SUCCESS,NOTIFICATIONS_FAILURE} from './ActionTypes';

const initialState={
    notification:[]
}

export const notificationView = (state=initialState , { type, payload }) => {
	switch (type) {
    	case NOTIFICATIONS_SUCCESS: {
      		return { ...state, notification:payload };
    	}
    	case NOTIFICATIONS_FAILURE: {
      		return { ...state, error: payload }
		}
    	default:
      		return state;
  	}
};

