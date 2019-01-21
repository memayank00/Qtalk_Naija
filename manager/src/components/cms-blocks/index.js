import React, { Component } from 'react';
import { connect } from 'react-redux';

import PageHeader from "../common/pageheader";
import Table from "./element/table";


class Blocks extends Component {

	render(){
		return(
			<div>
                <PageHeader pageTitle="CMS Blocks" route="CMS Blocks" />
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
	};
}

export default connect()(Blocks);