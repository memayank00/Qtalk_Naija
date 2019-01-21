import React, { Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form } from "reactstrap";
import "./SignUp.css";
/* redux imports */
import { Field, reduxForm, reset } from "redux-form";
import FormField from "../renderField";
import { required, emailValiadte,mobileValidate } from "../fieldValidations";
import { connect } from "react-redux";
import Loader from "../loader";
import { toast } from "react-toastify";
import * as ApiUrl from "../../../utils/endpoints";
import Http from "../../../services/http";
import { POPUP } from "../actions";
import VerifyOtp from "../verifyOtp/verifyOtp";
import LogoImg from "../../../assets/images/logo-home.png";


class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      formData: {}
    };
    this.submitFrom = this.submitFrom.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.submitOtp = this.submitOtp.bind(this);
  }

  closePopup() {
    const { dispatch } = this.props;
    dispatch({ type: POPUP, data: false });
    dispatch(reset("signupForm"));
  }

  render() {
    const {handleSubmit, isOpen } = this.props;
    const { isLoading } = this.state;
    const labelLink = (
      <Fragment>
        Yes I agree to the <a href="https://www.trackingapp.com/termscondition" target="_blank">Terms and Conditions</a>
      </Fragment>
    );
    return (
      <div>
        <Button color="danger" onClick={this.closePopup}>
          {this.props.buttonLabel}
        </Button>
        <Modal
          isOpen={isOpen}
          toggle={this.closePopup}
          className={this.props.className}
          className="SignupModalOuter"
        >
          <ModalHeader toggle={this.closePopup}>
            <div className="modalLogo">
              <img src={LogoImg} />
              <span>CREATE ACCOUNT</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit(this.submitFrom)}>
              <div className="row signupFrmMain">
                <div className="col-md-6">
                  <Field
                    component={FormField}
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    validate={[required]}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    component={FormField}
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    validate={[required]}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    name="mobile"
                    type="text"
                    placeholder="Phone Number"
                    component={FormField}
                    validate={[required,mobileValidate]}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    name="email"
                    type="text"
                    placeholder="Email Address"
                    component={FormField}
                    validate={[required, emailValiadte]}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    name="username"
                    type="text"
                    placeholder="Username"
                    component={FormField}
                    validate={[required]}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    component={FormField}
                    validate={[required]}
                  />
                </div>
              </div>
              <div className="rembBx">
                <Field
                  name="terms"
                  type="checkbox"
                  label={labelLink}
                  component={FormField}
                  validate={[required]}
                />
              </div>
              <Button
                type="submit"
                disabled={this.props.invalid || this.props.submitting}
              >
                Sign Up
              </Button>
            </Form>
          </ModalBody>
        </Modal>
        <VerifyOtp submitForm={this.submitOtp} />
      </div>
    );
  }

  submitFrom(values) {
    this.setState({ formData: values, isLoading: true });
    const { dispatch } = this.props;
    values.ccode = "+91";
    Http.Request("post", ApiUrl.userSignup, values)
      .then(response => {
        const {type,message}=response;
        if(type==='success'){
          toast("OTP has been sent on your email to verify your account", {
            type: "info"
          });
          dispatch(reset("signupForm"));
          dispatch({ type: POPUP, data: "verify" });
        }else{
          toast(message, {
            type: "error"
          });
        }
      })
      .catch(err => {
        toast(err.message, { type: "error" });
      });
  }

  submitOtp(values) {
    const {
      formData: { email }
    } = this.state;
    const { dispatch } = this.props;
    values.email = email;
    Http.Request("post", ApiUrl.userVerifyOtp, values)
      .then(response => {
        console.log(response);
        if (response.type === "error")
          toast(response.errors, { type: "error" });
        if (response.type === "success") {
          console.log("inside response")
          toast(response.message, { type: "success" });
          dispatch(reset("verifyOtpForm"));
          dispatch({ type: POPUP, data: false });
        }
      })
      .catch(err => {
        toast("errorMess", { type: "error" });
      });
  }
}

let SignupForm = reduxForm({
  form: "signupForm"
})(ModalExample);

const mapStatesToProps = state => {
  return {
    isOpen: state.popup && state.popup.popup === "signup" ? true : false
  };
};

export default connect(mapStatesToProps)(SignupForm);
