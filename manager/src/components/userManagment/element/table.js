import React, { Component } from 'react';
import {Alert } from "react-bootstrap";
import HTTP from '../../../services/http';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
        this.getUsers = this.getUsers.bind(this);
        this.search = this.search.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.parentToChild = this.parentToChild.bind(this);

    }

    componentDidMount(){
         this.getUsers({page:1});
    }
    render() {
        const {array ,isLoading,seracherror} = this.state;
        return (
            <div >
                {isLoading &&<Loader />}
               
                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh">

                        {/* actions search addnew  */}
                        <div className="table-toolbar">
                            <div className="row">
                               

                                {/* <!-- search --> */}
                                <div className="col-md-3">
                                    <div className="btn-group pull-right">
                                        <input type="text" className="form-control" placeholder="Search User(s)" onChange={this.search} />
                                        <HelpBlock style={{ color: '#e73d4a' }}>
                                            {seracherror ? seracherror : null}
                                        </HelpBlock>
                                    </div>
                                </div>

                                {/* <!-- add new --> */}
                                {/*<div className="col-md-1 col-sm-offset-8">
                                    <div className="btn-group pull-right">
                                        <Link to="/user-management/add"><button id="sample_editable_1_new" className="btn sbold green"> Add New
                                        </button></Link>
                                    </div>
                                </div>*/}
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
                                        <th> Name </th>
                                        <th> Email </th>
                                        <th> Mobile NO. </th>
                                        <th> Username </th>
                                        <th> Created At </th>                                    
                                        <th> Status </th>
                                        <th width='15%'> Actions </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {array.map((element,index)=> {
                                        element.index = index;
                                        return (
                                            <ROW  callbackFromParent={this.parentToChild} key={element._id} admin={element}/>
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
        this.getUsers({
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
            this.getUsers({
                page: 1,
                //page: this.state.activePage ? this.state.activePage : 1,
                searchQuery: e.target.value ? e.target.value : '',
                filter: this.state.filter ? this.state.filter : 2,

            });
        }, 1000);
    }

    /**to get list of users */
    getUsers(params={}){
        /**to start Loader */
        this.setState({  isLoading: true }) 
        HTTP.Request("get",window.admin.getUsers,params)
        .then((response) =>{
            console.log('response--- ',response)
             this.setState({
                array : response.data.users,
                isLoading:false,
                totalItemsCount: response.data.total
            })     
        })
    }

     /**to delete user from list*/
    parentToChild (data,index){
        HTTP.Request("post", window.admin.deleteUser, {_id:data})
		.then(result => {
            this.state.array.splice(index, 1);
            this.setState({
                array : this.state.array
            })
			toast(result.message,{type:"success"});
		})
		.catch(err => toast(err.message,{type:"error"}))
    }

   
}

export default TableComp ;