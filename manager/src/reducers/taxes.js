import { GET_TAXES } from "../components/common/actions";

const _reducer = "_reducer";
export default function admin(state = {}, data) {
    switch (data.type) {
        case GET_TAXES + _reducer: {
            return { ...state, taxes:data.data };
        }
        default: {
            return state;
        }
    }
}