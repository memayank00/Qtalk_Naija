import {call, put} from 'redux-saga/effects';
import { loginCall, forgotPasswordCall, resetPasswordCall, profileCall, saveAuditLogCall, logoutCall} from "../api/admin";
import Session from "../services/session";
import {ADMIN_LOGOUT} from "../components/common/actions";

export function* login(action){
	try{
		const adminData =  yield call(loginCall, action);
		yield put({
			type : "Admin-login_reducer",
			admin : adminData,
		});
		action.success(adminData);
	}
	catch(e){
		action.error(e);
	}
}

export function* logout(action){
	try{	

		const logout = yield call(logoutCall);
		/*Clearing Sessions*/
		Session.clearSession("token");
		Session.clearSession("user");
		Session.clearSession("permissions");
		yield put({
			type: ADMIN_LOGOUT+"_reducer"
		});
		action.success(true);
	}
	catch(e){
		action.error(e);
	}
}

export function* forgotPassword(action) {
	try {
		const forgotData = yield call(forgotPasswordCall, action);
		yield put({
			type: "Admin-Forgot-Password_reducer",
			data: forgotData
		});
		action.success(forgotData);
	}
	catch (e) {
		action.error(e);
	}
}

export function* resetPassword(action) {
	try {
		const resetData = yield call(resetPasswordCall, action);
		action.success(resetData);
	}
	catch (e) {
		action.error(e);
	}
}

export function* profile(action){
	const profile = yield call(profileCall);
	try{
		yield put({
			type : "Admin-profile_reducer",
			data : profile
		});
		action.success(true);
	}
	catch(e){
		action.error(e);
	}
}

/**
 * Save audit logs for user...
 */
export function* trackLogs(action){
	const saveLog = yield call(saveAuditLogCall, action);
}