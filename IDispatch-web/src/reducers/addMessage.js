import { ADD_MESSAGE, MESSAGE_RECEIVED } from "./ActionTypes";

export const addMessage = (state = [], { type, payload }) => {
  switch (type) {
    case ADD_MESSAGE:
   
      
      /* return { ...state, error: payload } */

    default:
      return state;
  }
};



/* return state.concat([
    {
      message: action.message,
      author: action.author,
      id: action.id
    }
  ]) */
