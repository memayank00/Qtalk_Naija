import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form} from "reactstrap";
import { toast } from "react-toastify";
import { push } from "react-router-redux";
import { Field, reduxForm } from "redux-form";
import FormField from "../common/renderField";
import { required, emailValiadte } from "../common/fieldValidations";
import Loader from "../common/loader";
import ImageCropper from "../common/ImageCropper";
import * as ApiUrl from "../../utils/endpoints";
// import EditImg from "../../assets/images/pencil-edit-button.png";
import UserIcon from "../../assets/images/user-icon.png";
import EmailIcon from "../../assets/images/email-icon.png";
import PhoneIcon from "../../assets/images/phone-icon.png";
/**Components */
/**services */
import HTTP from "../../services/http";
/**actions */
import { PROFILE_UPDATE_REQUEST } from "../../reducers/ActionTypes";
/**CSS */
import "./MyProfile.css";
import DefaultImage from "../../assets/images/img_avatar_default.png";

class MyProfile extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      profileImage: ""
    };

    this.updateProfile = this.updateProfile.bind(this);
    this.updateProfileImage = this.updateProfileImage.bind(this);
    this.back=this.back.bind(this);
  }
  componentDidMount() {
    const { initialize, user } = this.props;
    this.setState({ profileImage: user.profilePicture });
    initialize(user);
  }

  back(){
    this.props.dispatch(push("/MyAccount"));
  }
  render() {
    const {  profileImage,isLoading } = this.state;
    const {  user, handleSubmit } = this.props;
    return (
      <div className="App">
      {isLoading&&<Loader/>}
        <div className="dashboardMapBg">
          <Form onSubmit={handleSubmit(this.updateProfile)}>
            <div className="myaccountBx">
              <div className="myaccHd">my account</div>

              <div className="myaccImgBx">
                <i>
                  <img src={profileImage} onError={(e)=>{e.target.src = DefaultImage}} alt="" />
                </i>
                <strong>{user.name}</strong>
                {/*   <img className="edit-icon" src={EditImg} /> */}
                <Field
                  component={ImageCropper}
                  name="image"
                  updateProfileImage={this.updateProfileImage}
                />
              </div>
              <div className="usernameList">
                <i>
                  <img src={UserIcon} alt="" />
                </i>
                <Field
                  name="firstname"
                  component={FormField}
                  type="text"
                  validate={[required]}
                  label="First Name"
                />
              </div>
              <div className="usernameList">
                <i>
                  <img src={UserIcon} alt="" />
                </i>
                <Field
                  name="lastname"
                  component={FormField}
                  type="text"
                  validate={[required]}
                  label="Last Name"
                />
              </div>
              <div className="usernameList">
                <i>
                  <img src={UserIcon} alt="" />
                </i>
                <Field
                  name="username"
                  component={FormField}
                  type="text"
                  validate={[required]}
                  label="Username"
                  readOnly={true}
                />
              </div>
              <div className="usernameList">
                <i>
                  <img src={EmailIcon} alt="" />
                </i>
                <Field
                  name="email"
                  component={FormField}
                  type="text"
                  validate={[required, emailValiadte]}
                  label="Email"
                  readOnly={true}
                />
              </div>
              <div className="usernameList">
                <i>
                  <img src={PhoneIcon} alt="" />
                </i>
                <strong />
                <Field
                  name="mobile"
                  component={FormField}
                  type="text"
                  validate={[required]}
                  label="Mobile No."
                  readOnly={true}
                />
              </div>
              <div className="changepassBx clearfix">
                <div className="passBackBtn">
                  <button type="button" name="button" onClick={this.back} className="BackBtn">Back</button>
                </div>
                <div className="changepassRight">
                  <button type="submit" className="logoutBtn">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  updateProfile(data) {
      this.setState({isLoading:true});
    const { dispatch } = this.props;
    HTTP.Request("put", ApiUrl.updateUserDetails, data)
    .then(result => {
      if (result.type === "success") {
        toast("Profile Successfully Updated", { type: "success" });
        dispatch({ type: PROFILE_UPDATE_REQUEST });
      }
      this.setState({isLoading:false})
    })
    .catch(error => {
        this.setState({isLoading:false})
      console.log("insde error", error);
    });
    
  }

  updateProfileImage(image, blob) {
    const { dispatch } = this.props;
    this.setState({ profileImage: image });
    let formData = new FormData();
    formData.append("profileImage", blob);
    HTTP.Request("post", ApiUrl.updateProfilePicture, formData)
      .then(result => {
        if (result.type === "success") {
          dispatch({ type: PROFILE_UPDATE_REQUEST });
        }
      })
      .catch(error => {
        console.log("insde error", error);
      });
  }
}

let updateProfileForm = reduxForm({
  form: "updateProfileForm"
})(MyProfile);

const mapStatesToProps = state => {
  return {
    user: state.user.user
  };
};

export default connect(mapStatesToProps)(updateProfileForm);
