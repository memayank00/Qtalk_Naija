import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";

/**COMPONENTS */
import Loader from "../../common/loader";
import ROW from "./row";

import { ValidateOnlyAlpha } from "../../common/fieldValidations";
import { HelpBlock } from 'react-bootstrap';


var timer;
class Table extends Component {

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
        this.getCMS = this.getCMS.bind(this);
        this.search = this.search.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.delete = this.delete.bind(this);

    }

    componentWillMount(){
        this.getCMS({type:"cms-blocks", order:"title"});
    }
    render() {
        const {array ,isLoading,seracherror} = this.state;
        return (
            <div >
                {isLoading && <Loader />}
               
                <div className="portlet light bordered">
                    <div className="portlet-body">

                        {/* actions search addnew  */}
                        <div className="table-toolbar">
                            <div className="row">

                                <div className="col-md-3">
                                    <div className="btn-group pull-right">
                                        <input type="text" className="form-control" placeholder="Search CMS Block(s)" onChange={this.search} />
                                        <HelpBlock style={{ color: '#e73d4a' }}>
                                            {seracherror ? seracherror : null}
                                        </HelpBlock>
                                    </div>
                                </div>

                                {/* <!-- add new --> */}
                                <div className="col-md-1 col-sm-offset-8">
                                    <div className="btn-group pull-right">
                                        <Link to="/cms-blocks/add"><button id="sample_editable_1_new" className="btn sbold green"> Add New
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
                            <table className="table table-striped table-bordered table-hover table-checkable order-column" id="sample_1">
                                <thead>
                                    <tr>
                                        <th>Page Type</th>   
                                        <th> Title </th>
                                        <th> Created At </th>                                    
                                        <th> Status  </th>
                                        <th width="15%"> Actions </th>
                                    </tr>
                                </thead>
 
                                <tbody>
                                    {array.map(cms => {
                                        return (
                                            <ROW key={cms._id} cms={cms} delete={this.delete} />
                                        )
                                    })}
                                </tbody>                               
                            </table>
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
        this.getCMS({
            type: "cms-blocks",
            order: "title",
            page: eventKey ? eventKey : 1,
            searchQuery: this.state.searchQuery ? this.state.searchQuery : '',
        });
        /**to set query in route */
        this.props.history.push({
            search: '?page=' + eventKey
        })
    }

    delete(id){
        /*const search = this.props.location.search,
        params = new URLSearchParams(search);

        let page = params.get('page');

        if (this.state.array.length == 1) {page = page - 1;}*/
        let page = 1;

        this.props.dispatch({
            type : "Admin-deleteCMS",
            data : { _id : id},
            success : (r) => {
                /**to stop loader */
                this.setState({ isLoading: false});
                /**refresh list after deletion */
                this.getCMS({ type:"cms-blocks", page: page ? parseInt(page) : 1 });
            },
            error : (e) => {
                this.setState({ isLoading: false});
            }
        });
        

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
            this.getCMS({
                type : "cms-blocks",
                order:"title",
                page: this.state.activePage ? this.state.activePage : 1,
                searchQuery: e.target.value ? e.target.value : '',
                filter: this.state.filter ? this.state.filter : 2,
            });
        }, 1000);
    }

    /**to get list of roles */
    getCMS(params={}){
        /**to start Loader */
        this.setState({  isLoading: true }) 
        this.props.dispatch({
            type : "Admin-getCMS",
            data : params,
            success : (response) => {
                this.setState({
                    array : (response.data.records)?response.data.records:[],
                    isLoading:false,
                    totalItemsCount: response.data.paging.count
                }) 
            },
            error : (e) => {
                this.setState({
                    array : [],
                    isLoading:false,
                    totalItemsCount: 0
                })
            }
        });
    }
}

export default Table ;