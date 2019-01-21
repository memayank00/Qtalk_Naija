import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import HTTP from '../../../services/http';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";

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
        this.getEmails = this.getEmails.bind(this);
        this.search = this.search.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    componentWillMount(){
        this.getEmails({ type: "email", order: "title"});
    }
    render() {
        const {array ,isLoading,seracherror} = this.state;
        return (
            <div >
                {isLoading &&<Loader />}
               
                <div className="portlet light bordered">
                    <div className="portlet-body min-height">

                        {/* actions search addnew  */}
                        <div className="table-toolbar">
                            <div className="row">

                                {/* <!-- search --> */}

                                <div className="col-md-3">
                                    <div className="btn-group pull-right">
                                        <input type="text" className="form-control" placeholder="Search Email(s)" onChange={this.search} />
                                        <HelpBlock style={{ color: '#e73d4a' }}>
                                            {seracherror ? seracherror : null}
                                        </HelpBlock>
                                    </div>
                                </div>

                                {/* <!-- add new --> */}

                                <div className="col-md-1 col-sm-offset-8">
                                    <div className="btn-group pull-right">
                                        <Link to="/email-management/add"><button id="sample_editable_1_new" className="btn sbold green"> Add New
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
                                        <th> Template Name </th>                                                                                                              
                                        <th> Updated At </th>   
                                        <th width='15%'> Actions </th>
                                    </tr>
                                </thead>
 
                                <tbody>
                                    {array.map(role => {
                                        return (
                                            <ROW key={role._id} role={role} />
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
        this.getEmails({
            type: "email",
            page: eventKey ? eventKey : 1,
            searchQuery: this.state.searchQuery ? this.state.searchQuery : '',
        });
        /**to set query in route */
        this.props.history.push({
            search: '?page=' + eventKey
        })
    }
    /**SEARCH */
    search(e) {
        /**to remove Event Pooling  */
        e.persist();
        let seracherror = ValidateOnlyAlpha(e.target.value)
        if (seracherror) {
            this.setState({ seracherror: seracherror });
            return;
        }
        this.setState({ searchQuery: e.target.value, seracherror: seracherror });
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.getEmails({
                type: "email",
                page: this.state.activePage ? this.state.activePage : 1,
                searchQuery: e.target.value ? e.target.value : '',
                filter: this.state.filter ? this.state.filter : 2,

            });
        }, 1000);
    }

    /**to get list of roles */
    getEmails(params={}){
        /**to start Loader */
        this.setState({  isLoading: true }) 
        HTTP.Request("get",window.admin.getCMS,params)
        .then((response) =>{
             this.setState({
                array : response.data.records,
                isLoading:false,
                totalItemsCount: response.data.total
            })     
        })
    }
}



export default TableComp ;

