import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { push } from "react-router-redux";
import { toast } from "react-toastify";
import HTTP from "../../services/http";
import Moment from "react-moment";
import { Panel, Table } from "react-bootstrap";

import { required, ValidateOnlyAlpha } from "../common/fieldValidations";

/**COMPONENT */
import RenderFiled from "../common/renderField";
import PageHeader from "../common/pageheader";
import Multiselect from "../common/multiselect";
import Loader from "../common/loader";
import DropdownComp from "../common/DropdownList";
import infoOf from "../common/tooltip-text";

/**CONSTANT DATA */
import { OPTIONS } from "../common/options";

class ViewSign_up extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            status: true,
            market: {},
            adrs:""
        };
        /**event binding  */
        this.getList = this.getList.bind(this);
    }

    componentWillMount() {
        this.getList();
    }
    render() {
        const { isLoading, market, status, adrs } = this.state;
        return (
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <PageHeader
                            route={"View Lead"}
                            parent="Out of Market Leads"
                            parentRoute="/get-out-of-market-leads"
                        />
                        <div className="tab-pane active">
                            {/* payment details  start */}
                            <div>
                                <Panel bsStyle="info">
                                    <Panel.Heading>View Lead</Panel.Heading>
                                    <Panel.Body>
                                        <Table striped bordered condensed hover>
                                            <tbody>
                                                <tr>
                                                    <td width="20%">
                                                        <strong>Email</strong>
                                                    </td>
                                                    <td>{market.email}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20%">
                                                        <strong>Address</strong>
                                                    </td>
                                                    <td>{adrs ? adrs : "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20%">
                                                        <strong>Latitude</strong>
                                                    </td>
                                                    <td>{market.address ? market.address.lat : "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20%">
                                                        <strong>Longitutde</strong>
                                                    </td>
                                                    <td>{market.address ? market.address.lng : "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20%">
                                                        <strong>County</strong>
                                                    </td>
                                                    <td>{market.address ? market.address.county : "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20%">
                                                        <strong>
                                                            Date
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <Moment format="DD MMM YYYY hh:mm:ss A">
                                                                {market.ts ? market.ts : market.created_at}
                                                        </Moment>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Panel.Body>
                                </Panel>
                            </div>
                            {/* payment details  end */}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    getList(params = {}) {
        /**to start Loader */
        this.setState({ isLoading: true });
        let id = this.props.match.params;
        HTTP.Request("get", window.admin.gerOutMarketView, id)
            .then(result => {
                let adrs = [];
                
                if (result && result.data && result.data.address && result.data.address.route) adrs.push(result.data.address.route);
                if (result && result.data && result.data.address && result.data.address.unit_no) adrs.push(result.data.address.unit_no);
                if (result && result.data && result.data.address && result.data.address.locality) adrs.push(result.data.address.locality);
                console.log(result)
                this.setState({
                    isLoading: false,
                    market: result.data,
                    adrs : adrs.join(" ")
                });
            })
            .catch(err => this.setState({ isLoading: false }));
    }
}

export default ViewSign_up;
