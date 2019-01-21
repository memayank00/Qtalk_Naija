import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import Pagination from "react-js-pagination";
import { toast } from 'react-toastify';

/**COMPONENTS */
import Loader from "../../../common/loader";
import ROW from "./row";

import { ValidateOnlyAlpha } from "../../../common/fieldValidations";
import FilterForm from "../../../common/filterForm";
import { HelpBlock, Table } from 'react-bootstrap';

import HTTP from '../../../../services/http';


var timer;
class TableComp extends Component {

    constructor(props){
        super(props);
        this.state ={
            array:[],
            isLoading:false,
            searchQuery :'',
            activePage :1,
            totalItemsCount:1
        }
        /**event binding */
        this.getAuditLogs = this.getAuditLogs.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.submitFilters = this.submitFilters.bind(this);
        this.exportCsv = this.exportCsv.bind(this);

    }

    componentWillMount(){
        this.getAuditLogs();
    }

    render() {
        const { array, isLoading, seracherror, filterData} = this.state;
        return (
            <div >
                {isLoading && <Loader />}
               
                <div className="portlet light bordered">
                    <div className="portlet-body">
                        <FilterForm submitFunction={this.submitFilters}
                            searchPlaceholder="Search Audit"
                            limitComp
                        />
                        {/* Export CSV button */}
                        <button className="btn" type="button" onClick={this.exportCsv}>Export Csv</button><br /><br />

                        {/* if list is empty */}
                        {!isLoading && !array.length ? <Alert bsStyle="warning">
                            <strong>No Data Found !</strong>
                        </Alert>:
                            <div style={{ display: "flow-root"}}>                                
                            <Table responsive striped bordered condensed hover> 
                                <thead>
                                    <tr>
                                        <th width="22%"> Username </th>
                                        <th> OS </th>
                                        <th> IP </th>                                    
                                        <th> Browser </th>                                    
                                        <th> Created At </th>                                    
                                        <th width='30%'> Message  </th>
                                    </tr>
                                </thead>
 
                                <tbody>
                                    {array.map(log => {
                                        return (
                                            <ROW key={log._id} log={log} />
                                        )
                                    })}
                                </tbody>                               
                            </Table>
                                <div style={{float:"right"}}>
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={filterData ? filterData.limit : window.limit}
                                    totalItemsCount={this.state.totalItemsCount}
                                    pageRangeDisplayed={3}
                                    onChange={this.handlePageChange}
                                />
                             </div>                         
                        </div>
                    }
                    </div>
                </div>
            </div>
        );
    }

    /**PAGINATION */
    handlePageChange(eventKey){
        const { filterData} =this.state;
        this.setState({ activePage: eventKey });
        this.getAuditLogs({
            type:"audit",
            page: eventKey ? eventKey : 1,
            ...filterData
        });
        /**to set query in route */
        this.props.history.push({
            search: '?page=' + eventKey
        })
    }


    /**to get list of roles */
    getAuditLogs(params={}){
        /**to start Loader */
        this.setState({  isLoading: true }) 
        
        HTTP.Request("get", window.admin.getAuditLogs, params)
        .then(response => {
            this.setState({array : (response.data.logs)?response.data.logs:[], isLoading:false, totalItemsCount: response.data.count });
        })
        .catch(error => {
            this.setState({array : [], isLoading:false, totalItemsCount: 0 });
        });
    }

    /**to submit all the filters */
    submitFilters(filterData) {
        this.setState({ filterData })
        let { activePage } = this.state;
        this.getAuditLogs({
            page: activePage || 1,
            type:"audit",
            ...filterData
        });
    }

    /**to export Audit details */
    exportCsv() {
        let { activePage, filterData } = this.state;
        let params = { page: activePage || 1, ...filterData, type: "audit" };
        /**to start loader */
        this.setState({ isLoading: true })
        /**call api */
        HTTP.Request("get", window.admin.exportAuditLogs, params)
            .then((response) => {
                /**open the path given by api in new window */
                window.open(response.data);
                /**stop loader */
                this.setState({ isLoading: false });
            })
            .catch(err => { toast(err.message, { type: "error" }); this.setState({ isLoading: false }) })
    }
}

export default TableComp ;