import { call, put } from 'redux-saga/effects';
import {login, updateUserProfile} from '../actionCreator/ActionCreators';
import {  AUTH_SUCCESS, AUTH_FAILURE, AUTH_LOGOUT, PROFILE_UPDATE } from '../reducers/ActionTypes';
import Session from '../services/session';

export function* authorize(action) {
	try {
           const { token, user } = yield call(login,'login',action.user);
        yield put({ type: AUTH_SUCCESS, payload: token, user }); 
		Session.set('token',token,"cookies");
		Session.set('user',user,"cookies");
		action.callbackSuccess(user);
	} catch (error) {
		yield put({ type: AUTH_FAILURE, payload: error });
		Session.clear('token',null,"cookies");
		action.callbackError(error);
	}
}

export function* updateProfile(action) {
	try {
		let {data} = yield call(updateUserProfile, action.user);
		let user=(data.length>0)?data[0]:{};
		yield put({ type: PROFILE_UPDATE, user:user });
		Session.set('user', user, "cookies");
	} catch (error) {
		console.log("error",error)
	}
}

export function* logout(action) {
	Session.clear('token',null,"cookies");
	Session.clear('user',null,"cookies");
	yield put({ type: AUTH_LOGOUT });
	action.callbackSuccess();
}