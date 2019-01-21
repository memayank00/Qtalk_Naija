import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';
import TT from "../../common/tooltip";

class ROW extends Component {

    render() {
        const {element} = this.props;

        let replied = <label className='label label-success'>Replied</label>;
        let notReplied = <label className='label label-danger'>Not Replied</label>
        return (
            <tr className="odd gradeX" >
                <td> {element.firstname} </td>
                <td> {element.lastname} </td>
                <td> {element.email} </td>
                <td> {element.phone} </td>
                <td><Moment format="DD MMM YYYY">{element.created_at}</Moment></td>            
                {/* <td> {element.replies && element.replies.length > 0 ? replied : notReplied} </td> */}
                {/* <td>                    
                    <TT tooltip="Reply"><Link to={'/feedback/reply/' + element._id} className=" btn btn-xs blue-madison"><i className="fa fa-reply"></i></Link></TT>
                </td> */}
            </tr>
        );
    }

}



export default ROW;

