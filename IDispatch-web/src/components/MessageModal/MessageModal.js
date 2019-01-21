import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './MessageModal.css';
import { connect } from "react-redux";
/* import { POPUP } from "./actions"; */
import { Field, reduxForm,reset,SubmissionError} from "redux-form";
/* import FormField from "../renderField"; */
import {push} from 'react-router-redux';
import { toast } from "react-toastify";
import { AUTH_REQUEST } from '../../reducers/ActionTypes';
/* import { required, emailValiadte } from "./fieldValidations"; */
import Socket from "../../socket";
import LogoImg from "../../assets/images/logo-home.png";
import msgzoomImg from "../../assets/images/mission-img.png";

class ModalExample extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen:true
    }
    this.closePopup = this.closePopup.bind(this);
    /* this.signupPop=this.signupPop.bind(this); */
    this.submitFrom = this.submitFrom.bind(this);
  }

  closePopup() {
    const { dispatch } = this.props;
    dispatch({data: false });
    dispatch(reset("LoginForm"));
  }

  /* signupPop(){
    const { dispatch } = this.props;
    dispatch({ type: POPUP, data: 'signup' });
    dispatch(reset("LoginForm"));
  }

  forgotPass(){
    const {dispatch} =this.props;
    dispatch({type:POPUP,data:'forgotPass'});
  }
 */
  render() {
    const {isOpen} = this.state;
    const {handleSubmit} = this.props;

    return (
      <div>
        <Button color="danger" onClick={this.closePopup}>{this.props.buttonLabel}</Button>
        <Modal isOpen={isOpen} toggle={this.closePopup} className={this.props.className} className="popOuterModal">
          <ModalHeader toggle={this.closePopup} className="imgmodal"></ModalHeader>
          <ModalBody className="modalOuter">
            <div className="msgImgZoom">
            <img src={msgzoomImg} alt=" " />
            </div>
          </ModalBody>
            
        </Modal>
      </div>
    );
  }

  submitFrom(values){
    const { dispatch } = this.props;
    return new Promise((resolve, reject) => {
      dispatch({
          type: AUTH_REQUEST,
          user: values,
          callbackError: (error) => {
            toast(error.errors, { type: "error" });
            reject(new SubmissionError({_error: error}));
          },
          callbackSuccess: (user) => {
            Socket.callEvent("login",{userId:user._id});
            // Socket.callEvent("get.online.friends",{userId:user._id});
            Socket.callEvent("acknowledge.login",{userId:user._id});
            dispatch({data: false });
            dispatch(push('/dashboard'));
            resolve();
          }
      })
    });
  }
}

let LoginForm=reduxForm({
  form:"LoginForm"
})(ModalExample)

const mapStatesToProps = (state) => {  
  return ({
      isOpen: state.popup && state.popup.popup === "login" ? true : false
  });
}

export default connect(mapStatesToProps)(LoginForm);