import React, { Component } from 'react';
import { Alert } from "react-bootstrap";

import Pagination from "react-js-pagination";
import HTTP from "../../services/http";
import Moment from "react-moment";
import { toast } from 'react-toastify';

/**COMPONENTS */
import Loader from "../common/loader";
import PageHeader from "../common/pageheader";


import { Table ,Panel} from 'react-bootstrap';


var timer;
class TableComp extends Component {

    constructor(props) {
        super(props);

        /**to set queryObj  */
        const search = this.props.location.search; // could be '?page=1'
        const params = new URLSearchParams(search);
        let queryObj = {};
        queryObj.userId = params.get('userId');
        queryObj.url = params.get('url');
        queryObj.browser = params.get('browser');
        queryObj.os = params.get('os');
        queryObj.timezone = params.get('timezone');
        queryObj.ip = params.get('ip');

        this.state = {
            array: [],
            isLoading: false,
            searchQuery: '',
            activePage: 1,
            totalItemsCount: 1,
            queryObj: queryObj
        }
        /**event binding */
        this.getList = this.getList.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentWillMount() {
        const { queryObj } = this.state;
        this.getList({ queryObj});
    }
    render() {
        const { array, isLoading,log,user } = this.state;
        return (
            <div >
                {isLoading && <Loader />}
                <PageHeader route="View" parent='Access Log' parentRoute='/logs/access' />
                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh">

                  

                        {/* if list is empty */}
                        {!isLoading && !array.length ? <Alert bsStyle="warning">
                            <strong>No Data Found !</strong>
                        </Alert> :
                            <div style={{ display: "flow-root" }}>

                                {/* user details  start */}
                                <div>
                                    { user && log &&<Panel bsStyle="info">
                                        <Panel.Heading>Details</Panel.Heading>
                                        <Panel.Body>
                                            <Table striped bordered condensed hover>
                                                <tbody>
                                                    <tr>
                                                        <td width="20%"><strong>Name</strong></td>
                                                        <td>{`${user.firstname} ${user.lastname}`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="20%"><strong>Email</strong></td>
                                                        <td>{user.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="20%"><strong>Url</strong></td>
                                                        <td>{log.url}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="20%"><strong>Browser</strong></td>
                                                        <td>{log.browser.family}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="20%"><strong>OS</strong></td>
                                                        <td>{log.os}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="20%"><strong>IP</strong></td>
                                                        <td>{log.ip}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Panel.Body>
                                    </Panel>}
                                </div>
                                {/* user details  end */}

                                <Table responsive striped bordered condensed hover>
                                    <thead>
                                        <tr>
                                            <th> Created At </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {array.map(element => {
                                            return (
                                               <tr key={element._id}>
                                                    <td><Moment format="DD MMM YYYY hh:mm:ss A">{element.created_at}</Moment></td>
                                               </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                <div style={{ float: "right" }}>
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
    handlePageChange(eventKey) {
        this.setState({ activePage: eventKey });
        this.getList({
            page: eventKey ? eventKey : 1,
            queryObj: this.state.queryObj
        });
        /**to set query in route */
        this.props.history.push({
            search: '?page=' + eventKey
        })
    }


    /**to get list  */
    getList(params = {}) {
        /**return if the queryObj is empty */
        if (!Object.keys(params.queryObj).length) return toast("Something went wrong",{type:"error"})
        /**to start Loader */
        this.setState({ isLoading: true });
        HTTP.Request("get", window.admin.getAAccessLogs, params)
        .then(result => {
            this.setState({
                /**to stop loader */
                isLoading: false,
                /**to show listing */
                array: result.data.list,
                /**to show user deatils */
                user: result.data.user,
                log: result.data.log,
                /**for pagination */
                totalItemsCount: result.data.count
            });
        })
        .catch(err => {
            toast(err.message,{type:"error"});
            this.setState({ isLoading: false })
        });
    }

}

export default TableComp;