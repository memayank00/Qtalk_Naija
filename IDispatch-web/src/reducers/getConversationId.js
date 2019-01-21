import { CONVERSATION_ID_FAILURE,CONVERSATION_ID_SUCCESS } from "./ActionTypes";

export const getConversationId = (state = {}, { type, payload }) => {
    switch (type) {
    	case CONVERSATION_ID_SUCCESS: {

      		return { ...state,...payload };
    	}
    	case CONVERSATION_ID_FAILURE: {
      		return { ...state, error: payload }
    	}
    	default:
      		return state;
  	}
  };