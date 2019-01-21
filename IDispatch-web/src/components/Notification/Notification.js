import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {toast} from "react-toastify";
import { POPUP } from "../common/actions";
/**Components */

/**services */
import HTTP from '../../services/http';
/**endpoints */
import { notificationView} from '../../utils/endpoints';
import { recievedSentFriendRequest,acceptDeclineTrackRequest,updateNotificationType,cancleFriendRequest,acceptDeclineFriendRequest } from "../../utils/endpoints";
/**actions */
//import { POPUP } from '../common/actions.js';
/**CSS */
import './Notification.css';
import ROW from './row';

const mapStatesToProps =state=>{
  return {
    user: state.user.user,
    notifications:state.notifications.notification
  };
}

const mapDispatchToProps = dispatch => ({
  openPopModel:(data={}) =>dispatch({type: POPUP,data: "confirmation",funcData: data.funcData,delteFunction: data.delteFunction}),
  fetchNotification: (params={}) => dispatch({ type: "NOTIFICATIONS_REQUEST" ,data:params}),
  fetchNotificationCount: (params={}) => dispatch({ type: "NOTIFICATIONS_COUNT_REQUEST" ,data:params}),

});



class Notification extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
    };

    /**event binding  */
    this.handleAccept=this.handleAccept.bind(this);
    this.handleTrack=this.handleTrack.bind(this);
    this.handleStatusUpdate=this.handleStatusUpdate.bind(this);
    this.openConirmationPopUP=this.openConirmationPopUP.bind(this);
    this.openConirmationTrackPopUP=this.openConirmationTrackPopUP.bind(this);
  }
  componentDidMount(){
    this.props.fetchNotification();
    //this.props.fetchNotificationCount();
    
  }

  render() {
    const {content,tests} =this.state;
    const {match,notifications} = this.props;
    return (
      <div className="App">
       <div className="findFrdBg">
         <div className="container">
           <div className="row">
             <div className="col-md-6 col-xs-12 findfrdHd">
               Notification List
             </div>
           </div>
         </div>
       </div>
       <div className="dashBg">
         <div className="container">
           <div className="row">
             <div className="col-md-12 notifiList">
               <ul>
                 {notifications.length > 0 ? (
                  notifications.map(list => {
                      return <ROW key={list._id} openConirmationTrackPopUP={this.openConirmationTrackPopUP} openConirmationPopUP={this.openConirmationPopUP} list={list} handleAccept={this.handleAccept} handleTrack={this.handleTrack} />;
                  })
                   ) : (
                <li>
                 <div className="notifiDesc">
                     No New Notification.
                   </div>
                </li>
              )}
               
               </ul>
             </div>
           </div>
         </div>
       </div>
      </div>
    );
  }

  handleAccept(data){
    let obj={};
    obj.to_userId=data;
    HTTP.Request("post", acceptDeclineFriendRequest, data)
      .then(response => {
        toast(response.data,{type:"success"});
        this.props.fetchNotification();
      })
      .catch(err => {
        toast(err.message,{type:"info"})
      });
  }

  handleStatusUpdate(data){
    // HTTP.Request("post", updateNotificationType, data)
    //   .then(response => {
    //     this.props.fetchNotification();
    //   })
    //   .catch(err => {
    //   });
  }

  handleTrack(data){
    HTTP.Request("post",acceptDeclineTrackRequest,data)
    .then((response)=>{
      toast(response.data,{type:"success"});
      this.props.fetchNotification();
    })
    .catch(error=>{
        toast("Something went wrong",{ type: "info" })
    })
  }

  openConirmationPopUP(funcData = undefined) {
    this.props.openPopModel({ funcData: funcData,delteFunction: this.handleAccept})
  }

  openConirmationTrackPopUP(funcData = undefined){
    this.props.openPopModel({ funcData: funcData,delteFunction: this.handleTrack})
  }

}
export default connect(mapStatesToProps,mapDispatchToProps)(Notification);
