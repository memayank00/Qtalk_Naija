import React, { Component } from 'react';
import DefaultImage from "../../assets/images/img_avatar_default.png";
const ROW =({list,accept,openConirmationPopUP})=>{
    return(
        <div className="col-md-6">
              <div className="addFrdInn frdReqList">
                  <div className="row">
                    <div className="col-3 frdListImg"><img src={list.profilePicture?list.profilePicture:DefaultImage} alt=""
                    onError={(e)=>{e.target.src = DefaultImage}} /></div>
                    <div className="col-5 frdListName">
                       <strong>{list.name}</strong>
                       <small>{list.location}</small>
                    </div>
                    <div className="col-4 frdListBtn">
                      <a onClick={()=>openConirmationPopUP({_id:list._id,type:'Rejected'})} className="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Remove</a>
                      <a onClick={()=>accept({_id:list._id,type:'Accepted'})} className="acceptBtn"><img src="/assets/images/right-icon.png" alt=""/> Accept</a>
                    </div>
                  </div>
                  {/* <div className="closeBx"><a href="">X Close</a></div> */}
                </div> 
             </div>
    )
}


export default ROW;