import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';
import TT from "../../common/tooltip";
class ROW extends Component {
    
    
    render() {
        const {role} = this.props;
        return (
            <tr className="odd gradeX" >
                <td> {role.title} </td>                
                <td><Moment format="DD MMM YYYY">{role.created_at}</Moment></td>            
                <td>
                    <TT tooltip="Edit"><Link to={'/email-management/edit/' + role._id} className="btn btn-xs grey-mint"><i className="fa fa-pencil-square-o" ></i></Link></TT>
                </td>
            </tr>
        );
    }

}



export default ROW;

