import React, { Component } from 'react';
import { Alert } from "react-bootstrap";
import HTTP from '../../../services/http';
import Pagination from "react-js-pagination";
import { toast } from "react-toastify";

/**COMPONENTS */
import Loader from "../../common/loader";
import DyanmicTable from "../../common/dyanmicTable";
import FilterForm from '../../common/filterForm';


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
        this.getUsers = this.getUsers.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.submitFilters = this.submitFilters.bind(this);
        this.exportCsv = this.exportCsv.bind(this);
        this.getRolesOptions = this.getRolesOptions.bind(this);

    }

    componentWillMount() {
        this.getUsers();
        /**to get adminuser's role options*/
        this.getRolesOptions({type:"admin"});
    }
    render() {
        const { array, isLoading, seracherror, filterData, roleOptions} = this.state;
        const { handleSubmit, submitting, invalid, internal } = this.props;

        return (
            <div >
                {isLoading && <Loader />}
                <div className="portlet light bordered">
                    <div className="portlet-body min-heigh">

                        {/* Filters Form */}
                        <FilterForm submitFunction={this.submitFilters}
                            roleOptions={roleOptions}
                            loder
                            sortByComp
                            statusComp
                            limitComp
                            roleComp
                            searchPlaceholder="Search User(s)"
                        />
                        
                        {/* Export CSV button */}
                        <button className="btn" type="button" onClick={this.exportCsv}>Export Csv</button> <br/><br/>
                        {/* if list is empty */}
                        {!isLoading && !array.length ? <Alert bsStyle="warning">
                            <strong>No Data Found !</strong>
                        </Alert> :
                            <div style={{ display: "flow-root" }}>

                                {/* Table */}
                                <DyanmicTable array={array}
                                    thead={["Name", "Email", "Mobile No.", "Role", "Status", "Created At"]}
                                    tbody={["firstname,lastname", "email", "mobile", "roleTitle.title"]}
                                />
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
        this.getUsers({
            page: eventKey ? eventKey : 1,
            ...filterData
        });
        /**to set query in route */
        this.props.history.push({
            search: '?page=' + eventKey
        })
    }


    /**to get list of roles */
    getUsers(params = {}) {
        /**to start Loader */
        this.setState({ isLoading: true })
        HTTP.Request("get", window.admin.getUsers, params)
            .then((response) => {
                this.setState({
                    array: response.data.admins,
                    isLoading: false,
                    totalItemsCount: response.data.adminCount
                })
            })
    }

    /**to submit all the filters */
    submitFilters(filterData) {
        this.setState({ filterData })
        let { activePage } = this.state;
        this.getUsers({
            page: activePage || 1,
            ...filterData
        });
    }

    /**to export customer csv file */
    exportCsv() {
        let { activePage, filterData } = this.state;
        let params = { page: activePage || 1, ...filterData ,type:"Admin"};
        /**to start loader */
        this.setState({ isLoading: true })
        /**call api */
        HTTP.Request("get", window.admin.adminCustomerCsv, params)
            .then((response) => {
                /**open the path given by api in new window */
                window.open(response.data);
                /**stop loader */
                this.setState({ isLoading: false });
            })
            .catch(err => { toast(err.message, { type: "error" }); this.setState({ isLoading: false }) })
    }


    getRolesOptions(params = {}) {
        /**start loader and stop it only in edit case */
        this.setState({ isLoading: true })
        HTTP.Request("get", window.admin.getRolesOptions, params)
            .then(result => {
                this.setState({ roleOptions: result.data,isLoading:false })
            })
            .catch(err => { console.log("err", err); this.setState({isLoading: false })})
    }
}

export default TableComp;