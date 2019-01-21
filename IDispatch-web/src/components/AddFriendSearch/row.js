import React, { Component } from 'react';
import DefaultImage from "../../assets/images/img_avatar_default.png";
class ROW extends Component{
    
    render(){
        const {list,sendRequest}=this.props;
        let status="";
        if(list.friend==="Pending"){
            status=<div className="acceptedRqst">{list.friend}</div>
       }
       if(list.friend==="Rejected"){
           status= <a onClick={()=>sendRequest(list._id)} className="send_reqBtn">Send Request</a>
       }
        return(
            <div className="col-md-6">
            <div className="addFrdInn addsrchfrdBx">
                <div className="row">
                  <div className="col-3 frdListImg"><img src={list.profilePicture?list.profilePicture:DefaultImage} alt=""
                  onError={(e)=>{e.target.src = DefaultImage}} /></div>
                  <div className="col-5 frdListName addfrdNameBx">
                     <strong>{list.name}</strong>
                     {/* <small>{list.location ?`${list.location.substring(0,40)}...`:""}</small> */}
                     {/* <span><img src="/assets/images/call-icon.png" alt="" /> {list.mobile}</span> */}
                  </div>
                  <div className="col-4 frdListBtn senreqBtnBx">
                  {status}
                   {!list.friend && <a onClick={()=>sendRequest(list._id)} className="send_reqBtn">Send Request</a>}
                  </div>
                </div>
              </div> 
           </div>
        )

    }

}

export default ROW;