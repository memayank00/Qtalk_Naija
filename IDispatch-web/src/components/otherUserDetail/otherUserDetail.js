import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {toast} from "react-toastify";
import {push} from 'react-router-redux';

/**Components */

/**services */
import HTTP from '../../services/http';
import { Field, reduxForm,reset,SubmissionError} from "redux-form";
import FormField from "../common/renderField";
import {AUTH_LOGOUT_REQUEST} from '../../reducers/ActionTypes';
/**CSS */
import './otherUserDetail.css';
import UserIcon from "../../assets/images/user-icon.png";
import EmailIcon from "../../assets/images/email-icon.png";
import PhoneIcon from "../../assets/images/phone-icon.png";
import LockIcon from "../../assets/images/lock-icon.png";
import { OtherUserDetailEnd,AddUserNotes} from "../../utils/endpoints";
import DefaultImage from "../../assets/images/img_avatar_default.png";


class OtherUserDetail extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
      array:[],
    };
    this.submitFrom = this.submitFrom.bind(this);
    this.getUserDetail=this.getUserDetail.bind(this);

  }

  getUserDetail(id){
    const {dispatch,initialize}=this.props;
    HTTP.Request("get",OtherUserDetailEnd,{_id:id})
    .then((response) =>{
      if(response.type=="success"){
        let {data}=response;
        this.setState({array:data});
        if(Array.isArray(data)&& data.length>1){
          if(data[1] && data[1].userNotes && Array.isArray(data[1].userNotes)){
            initialize(data[1].userNotes[0]);
          }
        }
      }else{
        dispatch(push("/Friends"));
      }
    })
    .catch((error) =>{
      dispatch(push("/Friends"));
    })
  }

  componentDidMount(){
    const { match} = this.props;
    if(match.params){
      this.getUserDetail(match.params.id);
    }
  }

  render() {
    const {array} =this.state;
    const {match,user,handleSubmit} = this.props;
    return (
      <div className="App">
       <div className="dashboardMapBg">
         <div className="myaccountBx">
           <div className="myaccHd">User Detail</div>
           <div className="myaccImgBx">
             <i><img src={array.length>0 ? array[0].profilePicture:""} alt="" onError={(e)=>{e.target.src = DefaultImage}} /></i>
             <strong>{array.length>0 ? array[0].name:""}</strong>
             {/* <a onClick={this.editProfile}>Edit Profile</a> */}
           </div>         
           <div className="usernameList">
              <i><img src={UserIcon} alt="" /></i>
              <strong>Username</strong>
              <span>{array.length>0 ? array[0].name:""}</span>
           </div>
           <div className="usernameList">
              <i><img src={EmailIcon} alt="" /></i>
              <strong>Email ID</strong>
              <span>{array.length>0 ? array[0].email:""}</span>
           </div>
           <div className="usernameList">
              <i><img src={PhoneIcon} alt="" /></i>
              <strong>Mobile No.</strong>
              <span>{array.length>0 ? array[0].mobile:""}</span>
           </div>
           <div className="changepassBx clearfix">
           <Form onSubmit={handleSubmit(this.submitFrom)}>
             <div className="changepassLeft">
               <div className="usernameList">
                  <i><img src={LockIcon} alt="" /></i>
                  <Field
                    component={FormField}
                    type="text"
                    name="note"
                    label="Remember Me"
                  />
                  {/* <span><a onClick={() => this.changePass()}>Change Password</a></span> */}
               </div>
             </div>
             <div className="changepassRight">
               <button type="submit" 
               disabled={this.props.invalid || this.props.submitting}
                className="logoutBtn">Add</button>
               
             </div>
             </Form>
           </div>
         </div>
       </div>
      </div>
    );
  }

  

  submitFrom(values){
    const {match}=this.props;
    let obj={user_id:match.params.id,note:values.note}
    HTTP.Request("post",AddUserNotes,obj)
    .then((response)=>{
      console.log("response->",response);
    })
    .catch(error=>{
      console.log("error---/.",error);
    })
    console.log("values-->AddUserNotes",values)
  }


 
}
let AddNoteForm=reduxForm({
  form:"AddNoteForm"
})(OtherUserDetail)

const mapStatesToProps = state => {
  return {
    user: state.user.user,
    routing: state.routing,
  };
};
export default connect(mapStatesToProps)(AddNoteForm);
