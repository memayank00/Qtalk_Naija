import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Pagination from "react-js-pagination";
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';
/**COMPONENTS */
import Loader from "../../common/loader";
import RevisionROW from "./revision";
import HTTP from "../../../services/http";

import { ValidateOnlyAlpha } from "../../common/fieldValidations";
import { HelpBlock,Table } from 'react-bootstrap';



class RevTable extends Component {

    constructor(props){
        super(props);
        this.state ={
            isLoading:false
        }
        /**event binding */
        this.restore = this.restore.bind(this);
    }

    render() {
        const {isLoading} = this.state;
        const {revisions} = this.props;
        return (
            <div className='relative'>
                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh-">
                        {/* if list is empty */}
                        {!isLoading && !revisions.length ? <Alert bsStyle="warning">
                            <strong>No Data Found !</strong>
                        </Alert>:
                            <div style={{ display: "flow-root"}}>                                
                                <Table responsive striped bordered condensed hover> 
                                <thead>
                                    <tr>
                                        <th width="20%"> Title </th>
                                        <th> Author </th>                                    
                                        <th> Order </th>                                    
                                        <th width="15%"> Created At </th>                                    
                                        <th> Status </th>
                                        <th width="15%"> Actions </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {revisions.map(revision => {
                                        return (
                                            <RevisionROW key={revision._id} revision={revision} restore={this.restore}/>
                                        )
                                    })}
                                </tbody>                               
                            </Table>                      
                        </div>
                    }
                    </div>
                </div>
            </div>
        );
    }

    /*Restore Revision Data...*/
    restore(revisionId, revisionOf){
        /*Restore Revision*/
        HTTP.Request("put", window.admin.restoreRevision, {revisionId, revisionOf})
        .then(r => {
            this.props.dispatch(push("/email-management"));
            toast.success(r.message);
        })
        .catch(error => console.log(error));
    }
}

export default connect()(RevTable);