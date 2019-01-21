import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form } from "reactstrap";
import "./verifyOtp.css";
/* redux imports */
import { Field, reduxForm,reset} from "redux-form";
import FormField from "../renderField";
import { required, emailValiadte } from "../fieldValidations";
import { connect } from "react-redux";
import Loader from "../loader";
import { toast } from "react-toastify";
import * as ApiUrl from '../../../utils/endpoints';
import Http from '../../../services/http';
//import LogoImg from "../../../assets/images/logo.png";
import LogoImg from "../../../assets/images/logo-home.png";
import { POPUP } from "../actions";

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isLoading:false
    }
   
    this.closePopup = this.closePopup.bind(this);    
  }

  closePopup() {        
    const {dispatch}=this.props;
    dispatch({ type: POPUP, data: false })
    dispatch(reset("verifyOtpForm"));
}

  render() {
    const {handleSubmit,isOpen,submitForm} = this.props;
    const {isLoading}=this.state;
   
    return (
      <div>       
        <Button color="danger" onClick={this.closePopup}>
          {this.props.buttonLabel}
        </Button>
        <Modal
          isOpen={isOpen}
          toggle={this.closePopup}
          className={this.props.className}
        >
          <ModalHeader toggle={this.closePopup}>
            <div className="modalLogo">
              <img src={LogoImg} />
              <span>Verify Your Account</span>
              <h5>Please enter the verification code that was sent to your email.</h5>
            </div>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit(submitForm)}>
              <div className="row signupFrmBx">
                <div className="col-md-12">
                  <Field
                    component={FormField}
                    type="text"
                    name="otp"
                    placeholder="Enter Verification Code"
                    validate={[required]}
                  />
                </div>
                </div>
              <Button
                type="submit"
                disabled={this.props.invalid || this.props.submitting}
              >
                Submit
              </Button>
            </Form>
          </ModalBody>        
        </Modal>
      </div>
    );
  }
 
}

let verifyOtpForm = reduxForm({
  form: "verifyOtpForm"
})(ModalExample);

const mapStatesToProps = (state) => {  
  return ({
      isOpen: state.popup && state.popup.popup === "verify" ? true : false
  });
}

export default connect(mapStatesToProps)(verifyOtpForm);
