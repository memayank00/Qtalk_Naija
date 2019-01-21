import React, { Component } from 'react';
import { connect } from 'react-redux';
import {push} from 'react-router-redux';
/**actions */
import {AUTH_LOGOUT_REQUEST} from '../../reducers/ActionTypes';
/**CSS */
import './MyAccount.css';
import UserIcon from "../../assets/images/user-icon.png";
import EmailIcon from "../../assets/images/email-icon.png";
import PhoneIcon from "../../assets/images/phone-icon.png";
// import LockIcon from "../../assets/images/lock-icon.png";
import DefaultImage from "../../assets/images/img_avatar_default.png";

class MyAccount extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
    };

    this.editProfile=this.editProfile.bind(this);

  }

  render() {
    const {user} = this.props;
    return (
      <div className="App">
       <div className="dashboardMapBg">
         <div className="myaccountBx">
           <div className="myaccHd clearfix">my account
            {/* <span>
              <button className="backBtn">Back</button>
            </span> */}
           </div>
           <div className="myaccImgBx">
             <i><img src={user.profilePicture} alt="" onError={(e)=>{e.target.src = DefaultImage}} /></i>
             <strong>{user.name}</strong>
             <a onClick={this.editProfile}>Edit Profile</a>
           </div>         
           <div className="usernameList">
              <i><img src={UserIcon} alt="" /></i>
              <strong>Username</strong>
              <span>{user.username}</span>
           </div>
           <div className="usernameList">
              <i><img src={EmailIcon} alt="" /></i>
              <strong>Email ID</strong>
              <span>{user.email}</span>
           </div>
           <div className="usernameList">
              <i><img src={PhoneIcon} alt="" /></i>
              <strong>Mobile No.</strong>
              <span>{user.mobile}</span>
           </div>
           <div className="changepassBx clearfix">
             <div className="changepassLeft">
               <div className="usernameList">
                  <span><a onClick={() => this.changePass()}>Change Password</a></span>
               </div>
               <div className="DelAccount">
                <button className="DelAccBtn">Delete Account</button>
               </div>
             </div>
             <div className="changepassRight">
               <button onClick={() => this.logout()} className="logoutBtn">Log Out</button>
             </div>
           </div>
         </div>
       </div>
      </div>
    );
  }

  editProfile(){
    const { dispatch } = this.props;
    dispatch(push('/MyProfile'));
  }

  logout() {
		const { dispatch } = this.props;
	  	return new Promise((resolve, reject) => {
	    	dispatch({
	      		type: AUTH_LOGOUT_REQUEST,
	      		callbackSuccess: () => {
              // window.location.reload();
	        		dispatch(push('/'));
	        		resolve();
	      		}
	    	})
	  	});
  }
  
  changePass(){
    const {dispatch}=this.props;
    dispatch(push('/change-password'));
  }
}

const mapStatesToProps = state => {
  return {
    user: state.user.user
  };
};
export default connect(mapStatesToProps)(MyAccount);
