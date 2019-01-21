import { call, put } from 'redux-saga/effects';
import { getTaxesCall } from "../api/taxes";

const _reducer = "_reducer";

export function* getTaxes(action) {
    try {
        const taxes = yield call(getTaxesCall, action);

        yield put({
            type: action.type + _reducer,
            data: taxes,
        });
        action.success(taxes);
    }
    catch (e) {
        action.error(e);
    }
}