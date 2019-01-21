import React, { Fragment } from 'react';
import DefaultImage from "../../assets/images/img_avatar_default.png";
import Moment from "react-moment";
import PhotoIcon from "../../assets/images/photo-icon.png";
import LocationIcon from "../../assets/images/location-icon.png";
export const ROW = ({ list, listClicked,location }) => {
  let messageBody="";
  let selectedClass= "";
  if(location && location.search.indexOf(list.chattingWith._id)>-1){
    selectedClass="active-chat-user";
  }
  if(list.lastMessage&&list.lastMessage.body&&list.lastMessage.body.indexOf("@#ALERT")===-1&&list.lastMessage.body.indexOf("@#LOCATION")===-1&&list.lastMessage.attachment&&!list.lastMessage.attachment.secure_url){
    messageBody=<p>{`${list.lastMessage.body.substr(0,20)}...`}</p>
  }
  if(list.lastMessage&&list.lastMessage.attachment&&list.lastMessage.attachment.secure_url){
    messageBody=<div className="phone-icon"><img src={PhotoIcon} alt=""/>  <span>Photo</span></div>
  }
  if(list.lastMessage&&list.lastMessage.body&&list.lastMessage.body.indexOf("@#LOCATION")>-1){
    messageBody=<div className="phone-icon"><img src={LocationIcon} alt=""/>  <span>Location</span></div>
  }
 
  
  return (
    <Fragment>
      {list.unread === 0 ?

        <div onClick={() => listClicked({ userId: list.chattingWith._id })} className={`chatting-user-box ${selectedClass}`}>
          <img src={list.chattingWith ? list.chattingWith.image : DefaultImage} alt="" 
          onError={(e)=>{e.target.src = DefaultImage}} />
          <div className="chatting-user-list-text">
            <h5>{list.chattingWith ? list.chattingWith.name : ""}</h5>
            {messageBody}
            {list.lastMessage&&list.lastMessage.body && list.lastMessage.body.indexOf("@#ALERT")>-1?
               <p style={{color:"red"}}>{`${list.lastMessage.body.substr(10,20)}...`}</p> : ""}
               
            <div className="user-chatting-time">
              <div className="user-list-time"><Moment format="hh:mm A">{list.lastMessage ?list.lastMessage.timestamp:""}</Moment></div>
            </div>
          </div>
        </div>

        :

        <div  onClick={() => listClicked({ userId: list.chattingWith._id })} className={`chatting-user-box user-chat-active ${selectedClass}`}>
          <img src={list.chattingWith ? list.chattingWith.image : DefaultImage} alt="" 
          onError={(e)=>{e.target.src = DefaultImage}}
          />
          <div className="chatting-user-list-text">
            <h5>{list.chattingWith ? list.chattingWith.name : ""}</h5>
             {list.lastMessage&&list.lastMessage.body && list.lastMessage.body.indexOf("@#ALERT")>-1?
               <p style={{color:"red"}}>{list.lastMessage.body.substr(10,20)}</p> : ""}
               {messageBody}
            <div className="user-chatting-time">
              <div className="user-list-time"><Moment format="hh:mm A">{list.lastMessage ?list.lastMessage.timestamp:""}</Moment></div>
              <div className="user-total-chat">{list.unread}</div>
            </div>
          </div>
        </div>
      }
    </Fragment>
  )
}