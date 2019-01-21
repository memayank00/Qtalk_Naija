
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './Login.css';
import { connect } from "react-redux";
import { POPUP } from "../actions";
import { Field, reduxForm,reset,SubmissionError} from "redux-form";
import FormField from "../renderField";
import {push} from 'react-router-redux';
import { toast } from "react-toastify";
import { AUTH_REQUEST } from '../../../reducers/ActionTypes';
import { required, emailValiadte } from "../fieldValidations";
import Socket from "../../../socket";
import LogoImg from "../../../assets/images/logo-home.png";

class ModalExample extends React.Component {
  constructor(props){
    super(props);

    this.closePopup = this.closePopup.bind(this);
    this.signupPop=this.signupPop.bind(this);
    this.submitFrom = this.submitFrom.bind(this);
    this.forgotPass=this.forgotPass.bind(this);
  }

  closePopup() {
    const { dispatch } = this.props;
    dispatch({ type: POPUP, data: false });
    dispatch(reset("LoginForm"));
  }

  signupPop(){
    const { dispatch } = this.props;
    dispatch({ type: POPUP, data: 'signup' });
    dispatch(reset("LoginForm"));
  }

  forgotPass(){
    const {dispatch} =this.props;
    dispatch({type:POPUP,data:'forgotPass'});
  }

  render() {
    const {isOpen,handleSubmit} = this.props;
    return (
      <div>
        <Button color="danger" onClick={this.closePopup}>{this.props.buttonLabel}</Button>
        <Modal isOpen={isOpen} toggle={this.closePopup} className={this.props.className}>
          <ModalHeader toggle={this.closePopup}>
              <div className="modalLogo">
                <img src={LogoImg} />
                <span>Sign Up For Free!</span>
              </div>
          </ModalHeader>
          <ModalBody>
          <Form onSubmit={handleSubmit(this.submitFrom)}>
            <div className="signInmain">
          <Field
                    component={FormField}
                    type="text"
                    name="username"
                    placeholder="User Id, email or phone number"
                    validate={[required]}
              />
               <Field
                    component={FormField}
                    type="password"
                    name="password"
                    placeholder="Password"
                    validate={[required]}
              />
              {/* <FormGroup>
                <Input type="email" name="email" id="exampleEmail" placeholder="Username" />
              </FormGroup>
              <FormGroup>
                <Input type="email" name="email" id="exampleEmail" placeholder="Password" />
              </FormGroup> */}
            </div>
            <div className="rembBx">
           
              <Field
                    component={FormField}
                    type="checkbox"
                    name="remember_me"
                    label="Remember Me"
              />
              {/* <FormGroup check>
                <Label check>
                  <Input type="checkbox" />
                  Remember Me
                </Label>
              </FormGroup> */}
              <span><a onClick={this.forgotPass}>Forgot Password ?</a></span>
            </div>
            <Button type="submit" 
              disabled={this.props.invalid || this.props.submitting}>
              Sign In
            </Button>
            </Form>
            <div className="orBx"><span>OR</span></div>
            <div className="modalBotLink"><a onClick={this.signupPop}>Create New Account</a></div>
         
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
            dispatch({ type: POPUP, data: false });
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