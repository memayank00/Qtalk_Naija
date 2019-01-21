
import { POPUP } from "../components/common/actions";
const initState = {
    popup:false,
    funcData:undefined,
    msg:"Are you sure you want to delete?",
    delteFunction:undefined
};

export default function Popup(state = initState, action) {
    switch (action.type) {      
        case POPUP: {
            return { ...state, popup: action.data ,funcData: action.funcData, delteFunction:action.delteFunction ,msg:action.msg}
        }
        default: {
            return state;
        }
    }
}