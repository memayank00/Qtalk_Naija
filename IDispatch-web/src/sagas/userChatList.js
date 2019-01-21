import { call, put } from 'redux-saga/effects';
import {getUserChat} from '../actionCreator/ActionCreators';
import {  USER_MESSAGE_LIST_FAILURE, MESSAGE_SCROLL_LIST_SUCCESS,USER_MESSAGE_LIST_SUCCESS } from '../reducers/ActionTypes';


export function* getUserChatList(action) {
	try {
          let {data} = yield call(getUserChat, action.payload);
        yield put({ type: USER_MESSAGE_LIST_SUCCESS, payload:{data}});
        
		
	} catch (error) {
        yield put({ type: USER_MESSAGE_LIST_FAILURE, payload: error });
	}
}

export function* messageAddScroll(action){
        try {
        let {data} = yield call(getUserChat, action.payload);
        yield put({ type: MESSAGE_SCROLL_LIST_SUCCESS, payload:{data}});

                
        } catch (error) {
        yield put({ type: USER_MESSAGE_LIST_FAILURE, payload: error });
        }
}
