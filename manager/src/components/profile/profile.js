import React, { Component } from 'react';
import { Tab, Tabs } from "react-bootstrap";

/**ELEMNTS */
import PersonalInfo from "./element/personalInfo";
import ChangeAvtar from "./element/changeAvtar";
import PageHeader from "../common/pageheader";

/**PAGE LEVEL CSS */
import "../../assets/css/profile.min.css";
import "../../assets/css/bootstrap-fileinput.css";

class Profile extends Component {
    render() {
        return (
            <div>
                <PageHeader pageTitle="Edit Profile" route="Profile" />

                <div className="profile-content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="portlet light ">
                                <div className="portlet-title tabbable-line">
                                    <Tabs defaultActiveKey={1} animation={false} id="profileTabs" >
                                        <Tab eventKey={1} title="Personal Info">
                                            <PersonalInfo />
                                        </Tab>
                                        <Tab eventKey={2} title="Change Avatar">
                                            <ChangeAvtar />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }



}


export default Profile;

