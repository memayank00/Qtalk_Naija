import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
/* import { AUTH_REQUEST } from './ActionTypes'; */
/*import component level reducers*/
import site from "./site";
import popup from "./popup";
import {user} from "./user.js";
import {trackingUser} from "./trackingUser";
import {sidebarUser} from "./sideBarUsers";
import {userChat} from './userChatList';
import {addMessage} from './addMessage';
import {getConversationId} from './getConversationId';
import {updateUserLiveLocation} from './liveLocation';
import {notificationView} from './notifications';
import {notificationCount} from './notificationCount';

/* export const authorize = (uan, password) => ({
    type: AUTH_REQUEST,
    payload: { uan, password }
}); */


const rootReducer = combineReducers({
    routing: routerReducer,
    form: formReducer,
    site: site,
    popup: popup,
    user :user,
    trackingUser:trackingUser,
    sidebarUser:sidebarUser,
    userChat:userChat,
    getConversationId:getConversationId,
    location:updateUserLiveLocation,
    notifications:notificationView,
    notificationCount:notificationCount
   /*  addMessage:addMessage */
});

export default rootReducer;