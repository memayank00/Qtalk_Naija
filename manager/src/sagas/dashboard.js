import {call, put} from 'redux-saga/effects';
import { getNotificationsCall } from "../api/admin";

const _reducer = "_reducer";

export function* getNotifications(action){
	try{
		const notitications =  yield call(getNotificationsCall, action);

		yield put({
			type : action.type+_reducer,
			notitications : notitications.data,
		});
	}
	catch(e){
		//action.error(e);
	}
}