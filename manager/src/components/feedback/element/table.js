import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import HTTP from '../../../services/http';
import Pagination from "react-js-pagination";

/**COMPONENTS */
import Loader from "../../common/loader";
import ROW from "./row";
import DateFilter from "../../common/filter";


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
        this.getList = this.getList.bind(this);
        this.search = this.search.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.filterByDate=this.filterByDate.bind(this);

    }

    componentWillMount(){
        this.getList();
    }
    render() {
        const {array ,isLoading,totalItemsCount} = this.state;
        var divStyle = {
            padding: "8px 8px 8px",
          };
        return (
            <div >
                {isLoading &&<Loader />}
               
                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh">                

                        {/* actions search addnew  */}
                        <div className="table-toolbar">
                        <div className="row">
                            <div className="col-md-9">
                                   <DateFilter filterByDate={this.filterByDate}></DateFilter>
                            </div>
                            </div>
                            <div className="row">

                                <div className="col-md-3">
                                    <div className="btn-group pull-right">
                                        <input type="text" className="form-control" placeholder="Search Short form lead(s)" onChange={this.search} />
                                    </div>
                                </div>
                                <div className="col-md-1 col-sm-offset-2">
                                    <div >
                                        <label style={divStyle} className={'label label-info bg-blue-steel bg-font-blue-steel'}>Total Count <strong>-</strong> {totalItemsCount}</label>
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
                                        <th width='15%' >First Name</th>
                                        <th width='15%' >Last Name </th>
                                        <th width='20%'> Email </th>
                                        <th width='15%'> Phone Number</th>                                    
                                        <th width='15%'> Posted At</th>
                                        {/* <th width='10%'> Actions </th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    {array.map(element => {
                                        return (
                                            <ROW key={element._id} element={element} delete={this.delete}/>
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

     /* search data by date */
     filterByDate(data) {
        const { end_date,start_date } = data;
        this.setState({
            start_date: start_date,
            end_date: end_date
        })
        this.getList({
            page: 1,
            filter: this.state.filter ? this.state.filter : 2,
            ...data
        });
    }
    /**PAGINATION */
    handlePageChange(eventKey) {
        this.setState({ activePage: eventKey });
        this.getList({
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
        e.persist()
        this.setState({ searchQuery: e.target.value });
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.getList({
                page: 1,
                start_date: this.state.start_date,
                end_date: this.state.end_date,
                searchQuery: e.target.value ? e.target.value : '',
                filter: this.state.filter ? this.state.filter : 2,
            });
        }, 1000);
    }

    /**to get list  */
    getList(params = {}) {
        /**to start Loader */
        this.setState({ isLoading: true });
        HTTP.Request("get",window.admin.getFeedbacks,params)
        .then(result => {
            this.setState({
                isLoading: false,
                array: result.data.list,
                totalItemsCount: result.data.count
            });
        })
        .catch(err =>this.setState({isLoading:false}));
       
    }
  
}

export default Table ;