import React, { Component } from 'react';

/**COMPONENTS */
import ChangePasswordForm from "./element/changePasswordForm";
import PageHeader from "../common/pageheader";

/**PAGE LEVEL CSS */
import "../../assets/css/profile.min.css";

class  ChangePassword extends Component {
    render() {
        return (
            <div>
                <PageHeader pageTitle="Change Password" route="Change Password" />

                {/* <!-- BEGIN PROFILE CONTENT --> */}
                <div className="profile-content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="portlet light ">
                                <div className="portlet-title tabbable-line">
                                    <ChangePasswordForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- END PROFILE CONTENT --> */}
            </div>
            /* <!-- END CONTENT BODY --> */
        );
    }
}


export default ChangePassword;

