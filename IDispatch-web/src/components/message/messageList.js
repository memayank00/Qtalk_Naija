import React, {Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Moment from "react-moment";
import missionImg from "../../assets/images/mission-img.png";
import _ from "lodash";
import msgunread from "../../assets/images/msg-unread.png";
import msgread from "../../assets/images/msg-read.png";
import loader from "../../assets/images/wait.gif";
import DefaultImage from "../../assets/images/img_avatar_default.png";

class InnerRow extends Component{
  
  render(){
    const { chat, users,user,sortedMessage,indexing }=this.props;
    



    let myIdSendMessage=user ?user.user._id :"no id";
    let isImageProfile=true;
    let isRead=false,isUnread=false;
    let locationImage="",bodyValue="";
      if(indexing>0){
        let senderVal=sortedMessage[indexing-1];
          if(senderVal.sender ==chat.sender){
              isImageProfile=false;
            }
        }
        if(chat.body&&chat.body.indexOf("@#LOCATION")>-1){
          let val=chat.body.split(" ");
         let url= `https://maps.googleapis.com/maps/api/staticmap?center=${Number(val[2])},${Number(val[4])}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C${Number(val[2])},${Number(val[4])}&key=AIzaSyDAs_kf1Vo3C25KL52ypOdKpoU6FgO1mL4`;
          locationImage=<img src={url} />
        }
        if(chat.attachment&&chat.attachment.secure_url){
          locationImage=<img src={chat.attachment.secure_url} />
        }
        if(chat.body&&chat.body.indexOf("@#LOCATION")==-1&&chat.body.indexOf("@#ALERT")==-1&&chat.attachment&&!chat.attachment.secure_url){
          bodyValue=<p>{chat.body}</p>
        }


        

  return (
    <Fragment>
      {chat.sender == myIdSendMessage ? (
         <Fragment>
         <div className="chating-box  clientMessage" >
           <div className="chatting-user-img">
             {isImageProfile&&<img
               src={users[chat.sender] ? users[chat.sender].image :DefaultImage}
               alt=""
               onError={(e)=>{e.target.src = DefaultImage}}
             />}
           </div>
           <div className="chatting-user-text">
            {isImageProfile&&<h4>
              {users[chat.sender] ? users[chat.sender].name : ""}
            </h4>}
             <div className="clientChatInn ">
             {locationImage}
             {/* { chat.attachment && chat.attachment.secure_url &&
             <div className="has-image" ><img src={chat.attachment.secure_url} /></div>} */}
             {chat.body&&(chat.body.indexOf("@#ALERT")>-1)&&<p style={{color:"red"}}>{chat.body.substr(10,1000)}</p>}
             {bodyValue}
             {/* {chat.body&&chat.attachment&&!chat.attachment.hasOwnProperty("secure_url")&&!(chat.body.indexOf("@#ALERT")>-1)&&<p>{chat.body}</p>} */}
             <h4>
               <span className="user-list-time clearfix"><Moment format="hh:mm A">{chat.timestamp}</Moment>
               {chat.read.length ==2?
                <img src={msgread} />:
                <img src={msgunread} />}
               </span>
             </h4>
             
             </div>
             <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
            </div>
           </div>
         </div>
       </Fragment>
      
      ) : (
         

        <Fragment>
        <div className="chating-box">
        <div className="chatting-user-img">
        {isImageProfile&&<img
          src={users[chat.sender] ? users[chat.sender].image :DefaultImage}
          alt=""
          onError={(e)=>{e.target.src = DefaultImage}}
        />}
        </div>

        <div className="chatting-user-text">
       { isImageProfile&&<h4>
          {users[chat.sender] ? users[chat.sender].name : ""}
        </h4>}
        <div className="chatClientInn">
        {locationImage}
        {/* {chat.attachment&&<img src={chat.attachment.secure_url} />} */}
        {chat.body&&(chat.body.indexOf("@#ALERT")>-1)&&<p style={{color:"red"}}>{chat.body.substr(10,100)}</p>}
        {bodyValue}
        {/* {chat.attachment&&!chat.attachment.hasOwnProperty("secure_url")&&chat.body&&!(chat.body.indexOf("@#ALERT")>-1)&&<p>{chat.body}</p>} */}
        <h4>
          <span className="user-list-time clearfix"><Moment format="hh:mm A">{chat.timestamp}</Moment>
          {/* {chat.read.length ==2?
          <img src={msgread} />:
          <img src={msgunread} />} */}
         
          </span>
          
        </h4>
        </div>
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
        </div>
        </div>
        </Fragment>
        )}
    </Fragment>
  );



  }
}

class ROW extends Component{
 
  render(){
    const { list, users,user}=this.props;
    const sortedMessage = (list.messages && list.messages.length > 0) ? list.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
    return (
      <div className="chating-box myMessage" >
        <div className="user-active-date-box">
          <div className="date-box-border" />
          <div className="date-active">
            <Moment format="DD MMM YYYY">{list._id}</Moment>
          </div>
        </div>
        {sortedMessage.length > 0
          ? sortedMessage.map((chat,index) => {
            return <InnerRow key={chat._id}  user={user} indexing={index} sortedMessage={sortedMessage} chat={chat} users={users}  />;
          })
          : "NO Message"}
      </div>
    );
  }
}

    




 



class MessageList extends Component{
  
  render(){
      const { message, user, converSationId,isLoading,initialLoad } = this.props;
      let sortedArray=[];
      if(message.messages){
        sortedArray = _.sortBy(message.messages, function(dateObj) {
          return new Date(dateObj._id);
        });
      }
      // if (isLoading) {
      //   return (
      //     <Fragment>
      //     <div className="allChats" > 
      //       <div className="loadmoreOuter"><a>Loading...</a></div>
      //       <div className="loaderBx"><img src={loader} /></div>
      //     </div>
      //     </Fragment>
      //   )
      // }
     
        return (
          <Fragment>
            
              {sortedArray.length>0
                ? sortedArray.map(list => {
                  return <ROW key={list._id} user={user} list={list} users={message.users} />;
                })
                :""} 
              {!initialLoad&&sortedArray.length==0&&<div style={{marginTop: "200px",textAlign: "center"}}>NO CONVERSATION</div>}
         
          </Fragment>
        );
     
  }
}


export default MessageList;
