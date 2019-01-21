import { call, put } from "redux-saga/effects";
import {
  NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_FAILURE,
  NOTIFICATIONS_COUNT_SUCCESS,
  NOTIFICATIONS_COUNT_FAILURE

} from "../reducers/ActionTypes";
import { notificationListApi,notificationCount } from "../actionCreator/ActionCreators";

export function* notificationList(action) {
  try {
    let { data } = yield call(notificationListApi, action.data);
    yield put({ type: NOTIFICATIONS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: NOTIFICATIONS_FAILURE, payload: error });
  }
}

export function* notificationUserCount(action){
    try{
        let {data} = yield call(notificationCount,action.data);
       yield put ({type:NOTIFICATIONS_COUNT_SUCCESS,payload:data})
    }catch(error){
        yield put({type:NOTIFICATIONS_COUNT_FAILURE,payload:error})
    }
}