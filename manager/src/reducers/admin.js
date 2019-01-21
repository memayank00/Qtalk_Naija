import Session from '../services/session';
import { ADMIN_LOGOUT, ADMIN_PROFILE_UPDATE, CHANGE_ADMIN_AVTAR, Check_For_BlackList} from "../components/common/actions";

const initState = {
    user: Session.getSession("user"),
    token: Session.getSession("token"),
    permissions: Session.getSession("permissions"),
    blacklistIp: "W"
};

const _reducer = "_reducer";
export default function admin(state = initState, data) {
    switch (data.type) {
        case "Admin-login" + _reducer : {
            return { ...state, token: data.admin.token, user: data.admin.data ,permissions:data.admin.permissions};
        }

        case "Admin-Forgot-Password" + _reducer : {
            return { ...state, data:data};
        }

        case ADMIN_LOGOUT + _reducer: {
            return { ...state, token: null, user: null };
        }

        case ADMIN_PROFILE_UPDATE : {
            return { ...state, user: data.data};
        }

        case Check_For_BlackList :{
            return { ...state, blacklistIp:data.data}
        }
        case CHANGE_ADMIN_AVTAR: {
            return { ...state, user: data.data }
        }  
        default: {
            return state;
        }
    }
}