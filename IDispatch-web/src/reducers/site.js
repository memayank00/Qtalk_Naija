import session from '../services/session';
const initialState = {
    //settings: session.get("settings")
    ...session.get("settings")
}

/**
 * 
 * @param {*} state - state of reducer
 * @param {*} data 
 */
export default function site(state = initialState, action){
    switch (action.type) {
        case "get-settings_reducer":
            return { ...state, ...action.params.data};
        default:
            return state;
    }
}