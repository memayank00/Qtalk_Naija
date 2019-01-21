import { call, put } from "redux-saga/effects";
import { trackingUsers,updateLocationLive} from "../actionCreator/ActionCreators";
import {
  TRACKING_USERS_SUCCESS,
  TRACKING_USERS_FAILURE,
  LIVE_LOCATION_SUCCESS,
  TRACK_USER_UPDATE_LOCATION
} from "../reducers/ActionTypes";


export function* trackingUserList(action) {
  try {
    const data  = yield call(trackingUsers, "trackingUsers", action.user);
    // yield put({ type: TRACKING_USERS_SUCCESS, payload: data });
    action.success(data);
  } catch (error) {
      action.error(error); 
  }
}

export function* updateLiveLocation(action){
  try{
    yield call({ type: TRACK_USER_UPDATE_LOCATION, payload: action.data });
  }catch (error) {

  }
}

export function* currentLocationUpdate(action){
  try{
    let values={};
    values.location=action.data.formatted_address;
    values.cordinate=[{"lon":action.data.lng,"lat":action.data.lat}];
    const {data}=yield call(updateLocationLive,values,values);
    yield put({type: LIVE_LOCATION_SUCCESS,payload:data})
  }catch(error){

  }
}
