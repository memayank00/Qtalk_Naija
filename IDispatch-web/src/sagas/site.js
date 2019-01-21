import { call, put } from 'redux-saga/effects';
import { getSettingsCall } from "../actions/site";

const _reducer = "_reducer";

export function* getSettings(action) {
    try {
        const webSettings = yield call(getSettingsCall, action);

        yield put({
            type: action.type + _reducer,
            params: webSettings
        });
        action.success(webSettings);
    }
    catch (e) {
        action.error(e);
    }
}