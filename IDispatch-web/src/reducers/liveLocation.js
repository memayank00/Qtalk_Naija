import { LIVE_LOCATION_SUCCESS } from "./ActionTypes";

export const updateUserLiveLocation = (state = {}, { type, payload }) => {
    switch (type) {
    	case LIVE_LOCATION_SUCCESS: {
      		return { ...state,...payload };
    	}
    	default:
      		return state;
  	}
  };