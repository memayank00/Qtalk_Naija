import React, { Component } from 'react';
import { Alert } from "react-bootstrap";
import HTTP from '../../../services/http';
import Pagination from "react-js-pagination";

/**COMPONENTS */
import Loader from "../../common/loader";
import ROW from "./row"

import { ValidateOnlyAlpha } from "../../common/fieldValidations";
import { HelpBlock, Table } from 'react-bootstrap';


var timer;
class TableComp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            array: [],
            isLoading: false,
            searchQuery: '',
            activePage: 1,
            totalItemsCount: 1
        }
        /**event binding */
        this.getList = this.getList.bind(this);
        this.search = this.search.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    componentWillMount() {
        this.getList();
    }
    render() {
        const { array, isLoading,seracherror } = this.state;
        return (
            <div >
                {isLoading && <Loader />}

                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh">

                        {/* actions search addnew  */}
                        <div className="table-toolbar">
                            <div className="row">

                                <div className="col-md-4">
                                    <div className="btn-group width-100">
                                        <input type="text" className="form-control" placeholder="Search Payment(s)" onChange={this.search} />
                                        <HelpBlock style={{ color: '#e73d4a' }}>
                                            {seracherror ? seracherror : null}
                                        </HelpBlock>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* actions search addnew END */}

                        {/* if list is empty */}
                        {!isLoading && !array.length ? <Alert bsStyle="warning">
                            <strong>No Data Found !</strong>
                        </Alert> :
                            <div style={{ display: "flow-root" }}>
                                <Table responsive striped bordered condensed hover> 
                                    <thead>
                                        <tr>
                                            <th >Name</th>
                                            <th >Email</th>
                                            <th >Charge ID </th>
                                            <th >TRF ID </th>
                                            <th >RRF ID </th>
                                            <th> Payment Date </th>
                                            <th> Status </th>
                                            <th width='15%'> Actions </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {array.map(element => {
                                            return (
                                                <ROW key={element._id} element={element} />
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
            this.getList({
                page: this.state.activePage ? this.state.activePage : 1,
                searchQuery: e.target.value ? e.target.value : '',
                filter: this.state.filter ? this.state.filter : 2,
            });
        }, 1000);
    }

    /**to get list  */
    getList(params = {}) {
        /**to start Loader */
        this.setState({ isLoading: true });
        HTTP.Request("get", window.admin.getPayments, params)
        .then(result => {
            this.setState({
                isLoading: false,
                array: result.data.list,
                totalItemsCount: result.data.count
            });
        })
        .catch(err => this.setState({ isLoading: false }));

    }

}

export default TableComp;

