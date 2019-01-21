import React, { Component } from 'react';
import RightIcon from "../../assets/images/right-icon.png";
import RemoveIcon from "../../assets/images/remove-icon.png";
import Moment from "react-moment";
import DefaultImage from "../../assets/images/img_avatar_default.png";
const ROW =({list,openConirmationPopUP,handleTrack,openConirmationTrackPopUP,handleAccept})=>{
   
    let Acceptbtns="",Decline="",status="",dateNotif="";
    if(list.types==="Friend") {
        Acceptbtns=<button onClick={()=>handleAccept({_id:list.meta.from,type:'Accepted',user_id:list._id})} className="acceptBtn"><img src={RightIcon} /> Accept</button>;
        Decline= <button onClick={()=>openConirmationPopUP({_id:list.meta.from,type:'Rejected',user_id:list._id})}  className="declineBtn"><img src={RemoveIcon} /> Decline</button>;
    }
    if(list.types==="Track"){
        Acceptbtns=<button onClick={()=>handleTrack({_id:list.meta.from,type:"Accepted"})} className="acceptBtn"><img src={RightIcon} /> Accept</button>;
        Decline= <button onClick={()=>openConirmationTrackPopUP({_id:list.meta.from,type:"Rejected"})}  className="declineBtn"><img src={RemoveIcon} /> Decline</button>;
    }
    if(list.types==="Accepted"){
         status=<div className="acceptedRqst">{list.types}</div>
    }
    if(list.types==="Rejected"){
        status=<div className="rejectedRqst">{list.types}</div>
    }
    if(list.updated_at){
        let dateVal1=new Date(list.updated_at).getTime();
        let dateVal2=new Date().getTime();
        if(dateVal1 < dateVal2){
            dateNotif= <span><Moment format="ll">{list.updated_at}</Moment></span>
            
        }else{
            dateNotif= <span><Moment format="HH:mm A">{list.updated_at}</Moment></span>
        }
       
    }
    return(
        <li>
        <div className="notifiImg"><img src={list.imageUrl ?list.imageUrl:DefaultImage} /></div>
        <div className="notifiDesc">
          <strong className="blueClr">{`${list.title}     ` }</strong>
                {list.content.indexOf('@#ALERT') > -1 ? list.content.substr(9,100000) :list.content}
        </div>
        <div className="notifiBtn">
       {Acceptbtns}
       {Decline}
       {status}
       {dateNotif}
       
        </div>
      </li>
    )
}


export default ROW;