import * as ActionTypes from "../reducers/ActionTypes";
import * as ApiUrl from "../utils/endpoints";
import Http from "../services/http";
import { EROFS } from "constants";


export function login(url, options = {}) {
  return new Promise((resolve, reject) => {
    Http.Request("post", ApiUrl.userLogin, options)
      .then(response => {
        if (response.type === "success") {
          const { token, ...user } = response.data;
          resolve({ token, user });
        } else {
          throw response;
        }
      }) /* ,err=>{
        console.log("errr in server",err);
        throw err;
        } */
      .catch(error => {
        reject(error);
      });
  });
}

export function updateUserProfile(values) {
  return new Promise((resolve, reject) => {
    Http.Request("get",ApiUrl.userDetails,{})
      .then((data ) => resolve(data))
      .catch(error => reject(error));
  });
}

export function trackingUsers(values) {
  return new Promise((resolve, reject) => {
    Http.Request("get", ApiUrl.trackingUsers, {})
      .then(
        (data ) => {
          resolve(data);
        },
        serverError => {
          throw { errors: "Server Error", type: "errors" };
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}

export function SidebarUsers(values) {
  return new Promise((resolve, reject) => {
    Http.Request("get", ApiUrl.getAllChatList, values)
      .then(response=> {
          resolve(response);
        },
        serverError => {
          throw { errors: "Server Error", type: "errors" };
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}

export const UserChatList = (userId,pages) => ({
  type: ActionTypes.USER_MESSAGE_LIST_REQUEST,
  payload: {
    conversationId: userId,
    page:pages
  }
});
 export const initialChatData=(userId,pages)=>({
   type:ActionTypes.ADD_MESSAGE_TO_LIST_SUCCESS,
   payload:{
    conversationId: userId,
    page:pages
   }
 });

export function getUserChat(values) {
  return new Promise((resolve, reject) => {
    Http.Request("post", ApiUrl.messageTrails, values)
      .then(({ data }) => {
        resolve({ data });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export const addMessage = (ConversationId, Receiver, Body,Attachment) => ({
  type: ActionTypes.ADD_MESSAGE,
  payload: {
	ConversationId,
	Receiver,
  Body,
  Attachment
  }
});

/* To get Conversation ID */
export const getConversationId=(userId)=>({
  type:ActionTypes.GET_CONVERSATION_ID,
  payload:{
    userId
  }
});

/* HTTP Request for conversationId */
export const converSationId=(userId)=>{
  return new Promise((resolve,reject)=>{
    Http.Request("get", ApiUrl.getConversationId, userId)
    .then(response => {
      if (response.type === "success") {
        resolve(response);
      }else {
        throw response;
      }
    })
    .catch(error => {
      reject(error);
    });
  })
}

export function AddUserMessage(values){
	let formData=new FormData();
  formData.append('conversationId',values.ConversationId);
  formData.append('receiver',values.Receiver);
  if(values.Body){ formData.append('body',values.Body)}
  if(values.Attachment){ formData.append('attachment',values.Attachment)}
 
	return new Promise((resolve, reject) => {
		Http.Request("post", ApiUrl.sendMessage, formData)
		  .then((response) => {
        if(response.type=="success"){
          resolve({data:response.data[0]})
        }else{
          throw response;
        }
		    /* */
		  })
		  .catch(error => {
			  reject(error);
		  });
	  });
}

export function updateLocationLive(values){
  return new Promise((resolve,reject)=>{
    Http.Request("post",ApiUrl.updateUserLocation,values)
    .then((response)=>{
      resolve(response)
    })
    .catch(error=>{
      reject(error);
    })
  })
}

export function notificationListApi(values){
  return new Promise((resolve,reject)=>{
    Http.Request("get",ApiUrl.notificationView,values)
    .then((response)=>{
      resolve(response)
    })
    .catch(error=>{
      reject(error);
    })
  })
}

export function notificationCount(values){
  console.log(values)
  return new Promise((resolve,reject)=>{
    Http.Request("get",ApiUrl.unreadNotificationCount,values)
    .then((response)=>{
      resolve(response);
    })
    .catch(error=>{
      reject(error);
    })
  })
}
export const  getSideBarUser=(page)=>({
  type:"SIDEBAR_USERS_REQUEST" ,
  payload: {
    page
  }
})

export const  addMoreUsersToList=(page)=>({
  type:"SIDEBAR_USERS_ADDMORE_REQUEST" ,
  payload: {
    page
  }
})
