import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';

import List from "../../common/list";
import TT from "../../common/tooltip";

class ROW extends Component {
    
    
    render() {
        const {role} = this.props;
        return (
            <tr className="odd gradeX" >
                <td> {role.title} </td>
                <td className="center"> {role.permissions.map((permission, i) => <List permission={permission} key={i} /> )} </td>
                <td><Moment format="DD MMM YYYY">{role.created_at}</Moment></td>    
                <td className="center"> <label className={role.status ? 'label label-info' : 'label label-danger'}>{role.status ? "Active" : "In-Active"}</label> </td>                  
                <td>
                    {!role.preBuilt ?
                        <TT tooltip="Edit"><Link to={'/role-management/edit/' + role._id} className="btn btn-xs grey-mint"><i className="fa fa-pencil-square-o"  ></i></Link></TT>
                    :
                    ""
                    }
                </td>
            </tr>
        );
    }

}



export default ROW;

