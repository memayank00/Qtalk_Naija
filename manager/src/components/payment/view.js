import React, { Component } from 'react';
import HTTP from "../../services/http";
import { Panel, Table} from "react-bootstrap";
import Moment from "react-moment";

/**COMPONENT */
import PageHeader from "../common/pageheader";
import Loader from "../common/loader";

class Payments extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            formAction: "ADD",
            status: true,
        }

        /**event binding  */
        this.one = this.one.bind(this);
    }

    componentWillMount() {
        this.one();
    }

    render() {

        const { isLoading, payment } = this.state;
        return (
            <div>
                {isLoading ? <Loader /> : <div><PageHeader route="View" parent="Payment" parentRoute="/payment" />

                    <div className="tab-pane active" >
                        {/* payment details  start */}
                        <div>
                            <Panel bsStyle="info">
                                <Panel.Heading>Details</Panel.Heading>
                                <Panel.Body>
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            <tr>
                                                <td width="20%"><strong> Customer Name</strong></td>
                                                <td>{payment.userDetails.firstname}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>Customer Email</strong></td>
                                                <td>{payment.userDetails.email}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>Charge ID</strong></td>
                                                <td>{payment.charge.chargeId}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>TRF ID</strong></td>
                                                <td>{payment.trfId}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>RRF ID</strong></td>
                                                <td>{payment.rrfId}</td>
                                            </tr>
                                            <tr>
                                                <td width="20%"><strong>Payment Date</strong></td>
                                                <td><Moment format="DD MMM YYYY hh:mm:ss A">{payment.created_at}</Moment></td>  
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Panel.Body>
                            </Panel>
                        </div>
                        {/* payment details  end */}
                    </div>
                </div>
                }

            </div>
        );
    }

    one() {
        const { match } = this.props;
        /*extract plant id from request*/
        let ID = (match.params._id) ? match.params._id : null;
        if (ID) {
            this.setState({ isLoading: true, formAction: "EDIT" })
            HTTP.Request("get", window.admin.getAPayment, { _id: ID })
            .then(result => {
                this.setState({ isLoading: false, payment: result.data })
            })
        }
    }

}

export default Payments;