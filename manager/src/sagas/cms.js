import { call, put } from "redux-saga/effects";
import { upsertCMSCall, getCMSCall, deleteCMSCall } from "../api/cms";

const _reducer = "_reducer";

export function* getCMS(action) {
	try {
		const CMSs = yield call(getCMSCall, action);

		yield put({
			type: action.type + _reducer,
			newCMS: CMSs
		});
		action.success(CMSs);
	} catch (e) {
		action.error(e);
	}
}

export function* upsertCMS(action) {
	try {
		const addCMS = yield call(upsertCMSCall, action);
		yield put({
			type: action.type + _reducer,
			newCMS: addCMS
		});
		action.success(addCMS);
	} catch (e) {
		action.error(e);
	}
}

export function* deleteCMS(action) {
	try {
		const deleteCMS = yield call(deleteCMSCall, action);

		yield put({
			type: action.type + _reducer
		});

		action.success(deleteCMS);
	} catch (e) {
		action.error(e);
	}
}
