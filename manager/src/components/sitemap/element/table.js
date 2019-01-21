import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import HTTP from "../../../services/http";
import {  toast } from 'react-toastify';
/**COMPONENTS */
import Loader from "../../common/loader";
import ROW from "./row";

import { ValidateOnlyAlpha } from "../../common/fieldValidations";
import { HelpBlock,Table } from 'react-bootstrap';


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
        this.getList = this.getList.bind(this);
        this.search = this.search.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.delete = this.delete.bind(this);
        this.syncData = this.syncData.bind(this);

    }

    componentWillMount(){
        this.getList();
    }
    render() {
        const {array ,isLoading,seracherror} = this.state;
        return (
            <div className='relative'>
                {isLoading && <Loader />}
               
                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh-">

                        {/* actions search addnew  */}
                        <div className="table-toolbar">
                            <div className="row">
                                {/* search */}
                                <div className="col-md-3">
                                    <div className="btn-group pull-right">
                                        <input type="text" className="form-control" placeholder="Search About Us" onChange={this.search} />
                                        <HelpBlock style={{ color: '#e73d4a' }}>
                                            {seracherror ? seracherror : null}
                                        </HelpBlock>
                                    </div>
                                </div>

                                {/* <!-- add new --> */}
                                <div className="col-md-2 col-sm-offset-2">
                                    <div className="btn-group pull-right">
                                        <button id="sample_editable_1_new" onClick={this.syncData} className="btn sbold green">Sync dynamic routes
                                        </button>
                                    </div>
                                    
                                </div>
                                <div className="col-md-1 col-sm-offset-4">
                                    <div className="btn-group pull-right">
                                        <Link to="/sitemap/add"><button id="sample_editable_1_new" className="btn sbold green"> Add New
                                        </button></Link>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        {/* actions search addnew END */}


                        {/* if list is empty */}
                        {!isLoading && !array.length ? <Alert bsStyle="warning">
                            <strong>No Data Found !</strong>
                        </Alert>:
                            <div style={{ display: "flow-root"}}>                                
                                <Table responsive striped bordered condensed hover> 
                                <thead>
                                    <tr>
                                        <th width="35%"> Link </th>
                                        <th width="15%"> Created At </th>                                    
                                        <th width="15%"> Status </th>
                                        <th width="25%"> Actions </th>
                                    </tr>
                                </thead>
 
                                <tbody>
                                    {array.map(cms => {
                                        return (
                                            <ROW key={cms._id} cms={cms} delete={this.delete} />
                                        )
                                    })}
                                </tbody>                               
                            </Table>
                                <div style={{float:"right"}}>
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={window.limit}
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
        this.getList({
            page: eventKey ? eventKey : 1,
            start_date: this.state.start_date,
            end_date: this.state.end_date,
            searchQuery: this.state.searchQuery ? this.state.searchQuery : ""
        });
        /**to set query in route */
        this.props.history.push({
            search: "?page=" + eventKey
        });
    }

    delete(id){
        /*const search = this.props.location.search,
        params = new URLSearchParams(search);

        let page = params.get('page');

        if (this.state.array.length == 1) {page = page - 1;}*/
        let page = 1;
        let data={};
        data.editID = id;
        data.trash=true;
        
        HTTP.Request("post", window.admin.sitemapUpsert, data)
        .then(result => {
             /**to stop loader */
             this.setState({ isLoading: false});
             /**refresh list after deletion */
             this.getList();
        })
        .catch(error => {
            this.setState({ isLoading: false});
        });

        
        

    }
    /**SEARCH */
    search(e) {
        e.persist();
        this.setState({ searchQuery: e.target.value });
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.getList({
                // page: this.state.activePage ? this.state.activePage : 1,
                page:1,
                start_date: this.state.start_date,
                end_date: this.state.end_date,
                searchQuery: e.target.value ? e.target.value : "",
                filter: this.state.filter ? this.state.filter : 2
            });
        }, 1000);
    }

    /**to get list of roles */
    getList(params={}){
    /**to start Loader */
    this.setState({ isLoading: true });
    HTTP.Request("get", window.admin.sitemaplisting, params)
        .then(result => {
            this.setState({
                isLoading: false,
                array: result.data.sitemap,
                totalItemsCount: result.data.sitemapCount
            });
        })
        .catch(err => this.setState({ isLoading: false }));

        
    }

    syncData(){
        this.setState({ isLoading: true });
        HTTP.Request("get", window.admin.syncData)
            .then(result => {
                this.getList();
                this.setState({
                    isLoading: false,
                });
                toast(result.message, { type: "success" });
            })
            .catch(err => this.setState({ isLoading: false }));
        
        
    }
}

export default TableComp ;
