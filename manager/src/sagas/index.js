import {takeLatest} from 'redux-saga/effects'
import { login, forgotPassword, resetPassword, logout, trackLogs } from "./admin"; 
import { upsertCMS, getCMS, deleteCMS } from "./cms"; 
import { getNotifications } from "./dashboard"; 
import {getTaxes} from "./taxes"
import {ADMIN_LOGOUT,GET_TAXES} from "../components/common/actions";


export default function* Sagas(){

	/*Admin User Actions*/
	yield takeLatest("Admin-login", login);
	yield takeLatest("Admin-Forgot-Password", forgotPassword)
	yield takeLatest("ADMIN_RESET_PASSWORD", resetPassword);
	yield takeLatest(ADMIN_LOGOUT, logout);
	
	/*CMS*/
	yield takeLatest("Admin-upsertCMS", upsertCMS);
	yield takeLatest("Admin-getCMS", getCMS);
	yield takeLatest("Admin-deleteCMS", deleteCMS);

	/*Notifications*/
	yield takeLatest("Dashboard-notifications", getNotifications);

	/*Logs*/
	yield takeLatest("Admin-trackAuditLogs", trackLogs);

	/**Taxes */
	yield takeLatest(GET_TAXES, getTaxes);
}