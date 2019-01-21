import React, { Component } from 'react';
import { Alert } from "react-bootstrap";
import HTTP from '../../../services/http';
import Pagination from "react-js-pagination";
import {toast} from "react-toastify";

/**COMPONENTS */
import Loader from "../../common/loader";
import ROW from "./row"
import FilterForm from "../../common/filterForm";
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
        this.submitFilters = this.submitFilters.bind(this);
        this.exportCsv = this.exportCsv.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    componentWillMount() {
        this.getList();
    }
    render() {
        const { array, isLoading, seracherror, filterData } = this.state;
        return (
            <div >
                {isLoading && <Loader />}

                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh">

                        <FilterForm submitFunction={this.submitFilters}
                            searchPlaceholder="Search Access log(s)"
                            limitComp
                            hideDateComp
                        />
                        {/* Export CSV button */}
                        <button className="btn" type="button" onClick={this.exportCsv}>Export Csv</button><br /><br />

                        {/* if list is empty */}
                        {!isLoading && !array.length ? <Alert bsStyle="warning">
                            <strong>No Data Found !</strong>
                        </Alert> :
                            <div style={{ display: "flow-root" }}>
                                <Table responsive striped bordered condensed hover> 
                                    <thead>
                                        <tr>
                                            <th width="15%">User Name</th>
                                            <th >User Email</th>
                                            <th style={{width:'250px'}}>Url</th>
                                            <th >count</th>
                                            <th >Browser</th>
                                            <th >OS</th>
                                            <th>Timezone</th>
                                            <th>IP</th>
                                            <th width='15%'> Actions </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {array.map((element,index) => {
                                            return (
                                                <ROW key={index} element={element} />
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                <div style={{ float: "right" }}>
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
    handlePageChange(eventKey) {
        const { filterData } = this.state;
        this.setState({ activePage: eventKey });
        this.getList({
            page: eventKey ? eventKey : 1,
            ...filterData
        });
        /**to set query in route */
        this.props.history.push({
            search: '?page=' + eventKey
        })
    }
    /**to get list  */
    getList(params = {}) {
        /**to start Loader */
        this.setState({ isLoading: true });
        HTTP.Request("get", window.admin.getAccessLogs, params)
        .then(result => {
            this.setState({
                isLoading: false,
                array: result.data.list,
                totalItemsCount: result.data.count
            });
        })
        .catch(err => this.setState({ isLoading: false }));

    }
    /**to submit all the filters */
    submitFilters(filterData) {
        this.setState({ filterData })
        let { activePage } = this.state;
        this.getList({
            page: activePage || 1,
            ...filterData
        });
    }

    /**to export Audit details */
    exportCsv() {
        let { activePage, filterData } = this.state;
        let params = { page: activePage || 1, ...filterData};
        /**to start loader */
        this.setState({ isLoading: true })
        /**call api */
        HTTP.Request("get", window.admin.exportAccessLogs, params)
            .then((response) => {
                /**open the path given by api in new window */
                window.open(response.data);
                /**stop loader */
                this.setState({ isLoading: false });
            })
            .catch(err => { toast(err.message, { type: "error" }); this.setState({ isLoading: false }) })
    }
}

export default TableComp;

