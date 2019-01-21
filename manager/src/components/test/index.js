import React, { Component } from 'react';
import { connect } from 'react-redux';

/**COMPONENTS */
import Table from "./element/table";
import PageHeader from "../common/pageheader";


/**PAGE LEVEL CSS */
import "../../assets/css/profile.min.css";

class Test extends Component {
    render() {
        return (
            <div>
                <PageHeader route="Tests" />
                <div className="profile-content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="portlet light ">
                                <div className="portlet-title tabbable-line">
                                    <Table {...this.props} props={this.props}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect()(Test);

