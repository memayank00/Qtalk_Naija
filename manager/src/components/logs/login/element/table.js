import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import Pagination from "react-js-pagination";
import { toast } from 'react-toastify';

/**COMPONENTS */
import Loader from "../../../common/loader";
import ROW from "./row";

import { ValidateOnlyAlpha } from "../../../common/fieldValidations";
import { HelpBlock, Table } from 'react-bootstrap';
import FilterForm from "../../../common/filterForm";

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
        this.getLoginLogs = this.getLoginLogs.bind(this);
        this.submitFilters = this.submitFilters.bind(this);
        this.exportCsv = this.exportCsv.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    componentWillMount(){
        this.getLoginLogs({type:"login"});
    }
    render() {
        const { array, isLoading, filterData} = this.state;
        return (
            <div >
                {isLoading && <Loader />}
               
                <div className="portlet light bordered">
                    <div className="portlet-body">

                        <FilterForm submitFunction={this.submitFilters}
                            searchPlaceholder="Search Login Log(s)"
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
                                        <th width="18%"> Password </th>
                                        <th> OS </th>
                                        <th> IP </th>                                    
                                        <th> Browser </th>                                    
                                        <th> Recorded At </th>                                    
                                        <th> is Logged In?  </th>
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
        this.setState({ activePage: eventKey });
        let { filterData } = this.state;
        this.getLoginLogs({
            type:"login",
            page: eventKey ? eventKey : 1,
            ...filterData
        });
        /**to set query in route */
        this.props.history.push({
            search: '?page=' + eventKey
        })
    }

    /**to get list of roles */
    getLoginLogs(params={}){
        /**to start Loader */
        this.setState({  isLoading: true }) 
        
        HTTP.Request("get", window.admin.getLoginLogs, params)
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
        this.getLoginLogs({
            page: activePage || 1,
            type: "login",
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
        HTTP.Request("get", window.admin.exportLoginLogs, params)
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