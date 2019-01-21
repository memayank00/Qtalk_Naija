import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';
import TT from "../../common/tooltip";

class ROW extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }
    render() {
        const {element} = this.props;

        let done = <label className='label label-success'>Done</label>;
        let notdone = <label className='label label-danger'>Pending</label>
        return (
            <tr className="odd gradeX" >
                <td> {element.userDetails.firstname} </td>
                <td> {element.userDetails.email} </td>
                <td> {element.charge.chargeId} </td>
                <td> {element.trfId} </td>
                <td> {element.rrfId}</td>
                <td><Moment format="DD MMM YYYY hh:mm:ss A">{element.created_at}</Moment></td>            
                <td> {element.status && element.status === "done" ? done : notdone} </td>
                <td>                    
                    <TT tooltip="View"><Link to={'/payment/action/' + element._id} className=" btn btn-xs blue-hoki"  ><i className="fa fa-eye"  ></i></Link></TT>
                </td>
            </tr>
        );
    }

}

export default ROW;