import React, { Component } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import { push } from "react-router-redux";
import { Field, reduxForm, reset } from "redux-form";
import FormField from "../common/renderField";
import { required,minLengthPassword } from "../common/fieldValidations";
/**services */
import * as ApiUrl from "../../utils/endpoints";
import Http from "../../services/http";
import session from "../../services/session";
/**endpoints */
import { getTestsHomePage, getPagesContent } from "../../utils/endpoints";
/**actions */
import { POPUP } from "../common/actions.js";
import { AUTH_LOGOUT_REQUEST } from "../../reducers/ActionTypes";
import LockIcon from "../../assets/images/lock-icon.png";
/**CSS */
import "./ChangePass.css";

class ChangePass extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      isLoadingTests: false
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.back=this.back.bind(this);
  }
  back(){
    this.props.dispatch(push("/MyAccount"));
  }

  render() {
    const { handleSubmit } = this.props;
    const { content, tests } = this.state;
    const { match } = this.props;
    return (
      <div className="App">
        <div className="dashboardMapBg">
          <div className="myaccountBx">
            <div className="myaccHd">Change Password</div>
            <Form onSubmit={handleSubmit(this.formSubmit)}>
              <div className="usernameList">
                <i>
                  <img src={LockIcon} alt="" />
                </i>
                <strong>Old Password</strong>
                <Field
                  name="oldPassword"
                  component={FormField}
                  placeholder="Enter old password"
                  type="text"
                  validate={[required]}
                />
              </div>
              <div className="usernameList">
                <i>
                  <img src={LockIcon} alt="" />
                </i>
                <strong>New Password</strong>
                <Field
                  name="newPassword"
                  component={FormField}
                  placeholder="**********"
                  type="text"
                  validate={[required,minLengthPassword]}
                />
              </div>
              <div className="usernameList">
                <i>
                  <img src={LockIcon} alt="" />
                </i>
                <strong>Confirm New Password</strong>
                <Field
                  name="cPassword"
                  component={FormField}
                  placeholder="**********"
                  type="text"
                  validate={[required]}
                />
              </div>
              <div className="changepassBx clearfix">
              
                {/* <div className="changepassLeft">
                  <div className="usernameList">
                    <i>
                      <img src="/assets/images/lock-icon.png" alt="" />
                    </i>
                    <span className="changepassRight">
                      <button className="logoutBtn">Change Password</button>
                    </span>
                  </div>
                </div> */}
                <div className="passBackBtn">
                  <button type="button" name="button" onClick={this.back} className="BackBtn">Back</button>
                </div>
                <div className="changepassRight">
                  <button
                    type="submit"
                    className="logoutBtn"
                    disabled={this.props.invalid || this.props.submitting}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  formSubmit(values) {
    const {dispatch,reset} = this.props;
    Http.Request("post", ApiUrl.userChangePassword, values)
      .then(response => {
        const { type, message,errors } = response;
        if (type === "success") {
          toast(message, {
            type: "success"
          });
          dispatch(reset("changePass"));
          dispatch(push("/dashboard"));
        } else {
          toast(errors, {
            type: "error"
          });
        }
      })
      .catch(err => {
        toast(err.message, { type: "error" });
      });
  }
}

let changePass = reduxForm({
  form: "changePass",
  validate: values => {
    const errors = {};
    if (values.cPassword && values.newPassword !== values.cPassword) {
      errors.newPassword = "New password and confirm password should match";
      if (values.cPassword) {
        if (values.cPassword !== values.newPassword) {
          errors.cPassword = "New password and confirm password should match";
        }
      }
    }
    return errors;
  }
})(ChangePass);

export default connect()(changePass);
