import {NOTIFICATIONS_COUNT_SUCCESS,NOTIFICATIONS_COUNT_FAILURE,INCREASE_BATCH,RESET_BATCH} from './ActionTypes';

const initialState={
    data:0
}

export const notificationCount = (state=initialState , { type, payload }) => {
	switch (type) {
    	case NOTIFICATIONS_COUNT_SUCCESS: {
      		return { ...state, data:payload };
		}
		case INCREASE_BATCH: {
			let data = state.data + 1;
			return { ...state, data };
		}
		case RESET_BATCH: {
			let data = state.data * 0;
			return { ...state, data };
		  }
    	case NOTIFICATIONS_COUNT_FAILURE: {
      		return { ...state, error: payload }
		}
    	default:
      		return state;
  	}
};
  


