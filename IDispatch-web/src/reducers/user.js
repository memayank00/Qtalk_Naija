import Session from '../services/session';
import { AUTH_SUCCESS, AUTH_FAILURE,AUTH_LOGOUT,PROFILE_UPDATE } from './ActionTypes';

const initialState={
    token:Session.get("token","cookies"),
    user:Session.get("user","cookies")
}

export const user = (state = initialState, { type, payload, user }) => {
    switch (type) {
    	case AUTH_SUCCESS: {
      		return { ...state, token: payload, user };
    	}
    	case AUTH_FAILURE: {
      		return { ...state, error: payload }
    	}
    	case AUTH_LOGOUT: {
      		return { ...state, token: null, user:null }
    	}
    	case PROFILE_UPDATE: {
            console.log("user",user)
    		return { ...state, user }
    	}
    	default:
      		return state;
  	}
};


/* import Session from '../services/session';
import { USERLOGIN, USERLOGOUT, UPDATEPROFILE, PROFILE_FORM_STEP_UPDATE} from "../components/common/actions";

const initState = {
    user: Session.get("user","cookies"),
    token: Session.get("token", "cookies"),  
    step:1,

};

export default function User(state = initState, action) {
    
    switch (action.type) {
        case USERLOGIN  : {          
            return { ...state, token: action.data.token, user: action.data.user };
        }
        case USERLOGOUT: {    
            return { ...state, token: "", user: "" };
        }      
        case UPDATEPROFILE: {
            return { ...state ,user:action.data};
        } 
        case PROFILE_FORM_STEP_UPDATE:{
            return {...state,step:action.data}
        }      
        default: {
            return state;
        }
    }
} */