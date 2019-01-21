import { call, put } from "redux-saga/effects";
import {AddUserMessage} from "../actionCreator/ActionCreators";
import { MESSAGE_RECEIVED,UPDATE_MESSAGE_READ_STATUS } from "../reducers/ActionTypes";
import Session from "../services/session";
import Socket from '../socket/index';

export function* AddMessage(action) {
    
  try {
    const { data } = yield call(AddUserMessage, action.payload, action.payload);
    Socket.callEvent("message.send",data);
    yield put({ type: MESSAGE_RECEIVED, payload: data });
    /* action.success(); */
  } catch (error) {
   /*  yield put({ type: SIDEBAR_USERS_FAILURE, payload: error }); */
    /* 		action.error(error); */
  }
}

export function* recivedMessage(action){
  try {
    action.data.to=action.data.sender;
      Socket.callEvent("message.read",action.data);
      yield put({ type: MESSAGE_RECEIVED, payload: action.data }); 
    } catch (error) {
      
    }
}

export function* messageReadNotify(action){
  try{
    yield put({ type: UPDATE_MESSAGE_READ_STATUS, payload: action.payload }); 
  }catch(error){

  }
}
