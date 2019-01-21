import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";

/**COMPONENTS */
import Loader from "../../common/loader";
import ROW from "./row";
import DateFilter from "../../common/filter";
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
        this.getPages = this.getPages.bind(this);
        this.filterByDate=this.filterByDate.bind(this);
        this.search = this.search.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.delete = this.delete.bind(this);

    }

    componentWillMount(){
        this.getPages({type:"page", order:"title"});
    }
    render() {
        const {array ,isLoading,seracherror,totalItemsCount} = this.state;
        var divStyle = {
            padding: "8px 8px 8px",
          };
       
        return (
            <div className='relative'>
                {isLoading && <Loader />}
             
               
                <div className="portlet light bordered">

                    

                    <div className="portlet-body min-heigh-">

                        {/* actions search addnew  */}
                        <div className="table-toolbar">


                            <div className="row">
                            <div className="col-md-9">
                                   <DateFilter filterByDate={this.filterByDate}></DateFilter>
                                </div>
                                {/* <div className="col-md-3">
                                    <div className="form-actions filter-actions ">
                                        <label style={divStyle} className={'label label-info bg-blue-steel bg-font-blue-steel'}><strong>Total Count  {totalItemsCount}</strong></label>
                                    </div>
                                </div> */}
                                
                            </div>
                            <div className="row">
                                {/* search */}
                                <div className="col-md-3">
                                    <div className="btn-group">
                                        <input type="text" className="form-control" placeholder="Search Page(s)" onChange={this.search} />
                                        <HelpBlock style={{ color: '#e73d4a' }}>
                                            {seracherror ? seracherror : null}
                                        </HelpBlock>
                                    </div>
                                </div>
                                <div className="col-md-1 col-sm-offset-2">
                                    <div >
                                        <label style={divStyle} className={'label label-info bg-blue-steel bg-font-blue-steel'}>Total Count <strong>-</strong> {totalItemsCount}</label>
                                    </div>
                                </div>

                                {/* <!-- add new --> */}
                                <div className="col-md-1 col-sm-offset-4 ">
                                    <div className="btn-group">
                                        <Link to="/pages/add"><button id="sample_editable_1_new" className="btn sbold green"> Add New
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
                                        <th> Title </th>
                                        <th> Image </th>
                                        {/* <th> Meta Title </th> */}
                                        <th> Author </th>                                                                                                       
                                        <th> Created At </th>                                    
                                        <th> Status </th>
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

    /* search data by date */
     
     filterByDate(data){
         console.log(data)
         const { end_date,start_date } = data;
         this.setState({
             start_date:start_date,
             end_date:end_date
         })
        this.getPages({
            type : "page",
            order:"title",
            page:1,
            searchQuery: this.state.searchQuery ? this.state.searchQuery : '',
            filter: this.state.filter ? this.state.filter : 2,
            ...data
        });
        
    }
    

    /**PAGINATION */
    handlePageChange(eventKey){
        console.log(this.state.start_date);
        console.log(this.state.end_date);
        this.setState({ activePage: eventKey });
        this.getPages({
            type: "page",
            order: "title",
            page: eventKey ? eventKey : 1,
            start_date:this.state.start_date,
            end_date:this.state.end_date,
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
                this.getPages({ type:"page", page: page ? parseInt(page) : 1 });
            },
            error : (e) => {
                this.setState({ isLoading: false});
            }
        });
        

    }
    /**SEARCH */
    search(e) {
        console.log(this.state.start_date);
        console.log(this.state.end_date);
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
            this.getPages({
                type : "page",
                order:"title",
                page:1,
                start_date:this.state.start_date,
                end_date:this.state.end_date,
                searchQuery: e.target.value ? e.target.value : '',
                filter: this.state.filter ? this.state.filter : 2,
            });
        }, 1000);
    }

    /**to get list of roles */
    getPages(params={}){
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

export default TableComp ;
