import React, { Component } from 'react';

/**COMPONENTS */
import Table from "./element/table";
import PageHeader from "../common/pageheader";

/**PAGE LEVEL CSS */
import "../../assets/css/profile.min.css";

class RoleManagement extends Component {
    render() {
        return (
            <div>
                <PageHeader pageTitle="Email Management" route="Email Templates" />
                <div className="profile-content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="portlet light ">
                                <div className="portlet-title tabbable-line">
                                    <Table {...this.props}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default RoleManagement;

