import { call, put } from "redux-saga/effects";
import {converSationId} from "../actionCreator/ActionCreators";
import { CONVERSATION_ID_FAILURE,CONVERSATION_ID_SUCCESS} from "../reducers/ActionTypes";


export function* getConversationId(action) {
    try {
      const data  = yield call(converSationId, action.payload, action.payload);
      yield put({ type: CONVERSATION_ID_SUCCESS, payload: data });
      // action.success(data);
    } catch (error) {
         yield put({ type: CONVERSATION_ID_FAILURE, payload: error });
      	// action.error(error);
    }
  }