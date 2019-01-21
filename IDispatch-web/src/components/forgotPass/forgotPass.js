import React from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Form } from "reactstrap";
import "./forgotPass.css";
/* redux imports */
import { Field, reduxForm, reset } from "redux-form";
import FormField from "../common/renderField";
import { required, emailValiadte } from "../common/fieldValidations";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import * as ApiUrl from "../../utils/endpoints";
import Http from "../../services/http";
import { POPUP } from "../common/actions";
import LogoImg from "../../assets/images/logo-home.png";

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
    dispatch(reset("forgotPassForm"));
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
              <img src={LogoImg} alt=""/>
              <span>Forget Password</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit(this.formSubmit)}>
              <div className="row ">
                <div className="col-md-12">
                  <Field
                    component={FormField}
                    type="text"
                    name="email"
                    label="Please enter registered email ID, user ID or phone number to receive your password reset instructions.*"
                    placeholder="User Id, Email or Phone Number"
                    validate={[required, emailValiadte]}
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
    console.log(values);
    Http.Request('post',ApiUrl.userForgotPassword,values)
    .then(response => {
      const {type,message}=response;
      if(type==='success'){
        toast(message, {
          type: "success"
        });
        this.closePopup();
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

let forgotPassForm = reduxForm({
  form: "forgotPassForm"
})(ModalExample);

const mapStatesToProps = state => {
  return {
    isOpen: state.popup && state.popup.popup === "forgotPass" ? true : false
  };
};

export default connect(mapStatesToProps)(forgotPassForm);
