import React from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Form } from "reactstrap";
import "./resetPass.css";
/* redux imports */
import { Field, reduxForm, reset } from "redux-form";
import FormField from "../common/renderField";
import { required, minLengthPassword } from "../common/fieldValidations";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import * as ApiUrl from "../../utils/endpoints";
import Http from "../../services/http";
import { POPUP } from "../common/actions";
import LogoImg from "../../assets/images/logo.png";

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };

    this.closePopup = this.closePopup.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  closePopup() {
    const { dispatch } = this.props;
    dispatch({ type: POPUP, data: false });
    dispatch(reset("reset-password"));
  }

  render() {
    const { handleSubmit, isOpen } = this.props;
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
              <img alt="" src={LogoImg} />
              <span>Reset Your Password</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit(this.formSubmit)}>
              <div className="row ">
                <div className="col-md-12">
                  <Field
                    component={FormField}
                    type="text"
                    name="otp"
                    label="Otp"
                    placeholder="Enter Verification Code"
                    validate={[required]}
                  />
                </div>
                <div className="col-md-12">
                  <Field
                    name="newPassword"
                    type="password"
                    label="New Password"
                    component={FormField}
                    placeholder="Enter new password"
                    validate={[required,minLengthPassword]}
                  />
              </div>
              <div className="col-md-12">
              <Field
                name="cPassword"
                label="Confirm New Password"
                type="password"
                component={FormField}
                placeholder="Enter Confirm Password"
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

  formSubmit(values){
    const {dispatch,resetQuery,reset} = this.props;
    values.resetQuery=resetQuery;
   Http.Request('post',ApiUrl.userResetPassword,values)
    .then(response => {
      const {type,message}=response;
      if(type==='success'){
        toast(message, {
          type: "success"
        });
        dispatch({ type: POPUP, data: false });
        dispatch(reset("reset-password"));

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

}

let resetPassForm = reduxForm({
  form: "resetPassForm",
  validate:(values)=>{
    const errors={};
    if(values.cPassword && values.newPassword !== values.cPassword ){
      errors.newPassword = 'New password and confirm password should match';
      if( values.cPassword) {
        if( values.cPassword !== values.newPassword ) {
          errors.cPassword = 'New password and confirm password should match';
        }
      }
    }
    return errors;
  }
})(ModalExample);

const mapStatesToProps = state => {
 
  return {
    isOpen: state.popup && state.popup.popup === "reset-password" ? true : false
  };
};

export default connect(mapStatesToProps)(resetPassForm);
