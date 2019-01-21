import {takeLatest} from 'redux-saga/effects'
import {  AUTH_REQUEST,SIDEBAR_USERS_ADDMORE_REQUEST,MESSAGE_READ_NOTIFY,ADD_MESSAGE_TO_LIST_SUCCESS,NOTIFICATIONS_REQUEST,NOTIFICATIONS_COUNT_REQUEST,LIVE_USER_LOCATION,GET_CONVERSATION_ID,TRACKING_USERS_UPDATE_LOCATION,RECIEVED_SOCKET_MESSAGE,AUTH_LOGOUT_REQUEST, ADD_MESSAGE ,SIDEBAR_USERS_REQUEST,TRACKING_USERS_REQUEST,PROFILE_UPDATE_REQUEST,USER_MESSAGE_LIST_REQUEST} from '../reducers/ActionTypes';
import { authorize, logout, updateProfile } from './user';
import {trackingUserList,updateLiveLocation,currentLocationUpdate} from './trakingUser';
import {SideBarUsersList,AddMoreUsers} from './sideBarUsers';
import {getUserChatList,messageAddScroll} from './userChatList';
import {AddMessage,recivedMessage,messageReadNotify} from './addMessage';
import {getConversationId} from './getConversationId';
import {notificationList,notificationUserCount} from './notifications';

export default function* Sagas(){
	yield takeLatest(AUTH_REQUEST, authorize);
	yield takeLatest(AUTH_LOGOUT_REQUEST, logout);
	yield takeLatest(PROFILE_UPDATE_REQUEST, updateProfile);
	yield takeLatest(TRACKING_USERS_REQUEST,trackingUserList);
	yield takeLatest(SIDEBAR_USERS_REQUEST,SideBarUsersList);
	yield takeLatest(USER_MESSAGE_LIST_REQUEST,getUserChatList);
	yield takeLatest(ADD_MESSAGE,AddMessage);
	yield takeLatest(RECIEVED_SOCKET_MESSAGE,recivedMessage);
	yield takeLatest(GET_CONVERSATION_ID,getConversationId);
	yield takeLatest(TRACKING_USERS_UPDATE_LOCATION,updateLiveLocation);
	yield takeLatest(LIVE_USER_LOCATION,currentLocationUpdate);
	yield takeLatest(NOTIFICATIONS_REQUEST,notificationList);
	yield takeLatest(NOTIFICATIONS_COUNT_REQUEST,notificationUserCount);
	yield takeLatest(MESSAGE_READ_NOTIFY,messageReadNotify);
	yield takeLatest(ADD_MESSAGE_TO_LIST_SUCCESS,messageAddScroll);
	yield takeLatest(SIDEBAR_USERS_ADDMORE_REQUEST,AddMoreUsers);
}