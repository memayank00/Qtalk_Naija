import { call, put } from "redux-saga/effects";
import {SidebarUsers} from "../actionCreator/ActionCreators";
import { SIDEBAR_USERS_SUCCESS,SIDEBAR_USERS_FAILURE,SIDEBAR_USER_ADD_TO_LIST } from "../reducers/ActionTypes";
import Session from "../services/session";

export function* SideBarUsersList(action) {
  try {
    const { data } = yield call(SidebarUsers, action.payload.page, action.user);
    yield put({ type: SIDEBAR_USERS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: SIDEBAR_USERS_FAILURE, payload: error });
  }
}

export function* AddMoreUsers(action){
  try {
    const { data } = yield call(SidebarUsers, action.payload.page, action.user);
    yield put({ type: SIDEBAR_USER_ADD_TO_LIST, payload: data });
  } catch (error) {
    yield put({ type: SIDEBAR_USERS_FAILURE, payload: error });
  }
}
