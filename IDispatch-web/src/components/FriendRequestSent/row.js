import React, { Component } from 'react';
import DefaultImage from "../../assets/images/img_avatar_default.png";
class ROW extends Component{
    render(){
        const {list,openConirmationPopUP}=this.props;
        return(
            <div className="col-md-6">
              <div className="addFrdInn frdReqList">
                  <div className="row">
                    <div className="col-3 frdListImg"><img src={list.profilePicture?list.profilePicture:DefaultImage} alt=""
                    onError={(e)=>{e.target.src = DefaultImage}} /></div>
                    <div className="col-5 frdListName">
                       <strong>{list.name}</strong>
                       {/* <small>{list.location}</small> */}
                    </div>
                    <div className="col-4 frdListBtn">
                      <span className="requested"><a>Requested</a></span>
                      <a onClick={()=>openConirmationPopUP(list._id,list.name)} className="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Remove</a>
                    </div>
                  </div>
                 {/*  <div className="closeBx"><a href="">X Close</a></div> */}
                </div> 
             </div>
        )

    }

}

export default ROW;