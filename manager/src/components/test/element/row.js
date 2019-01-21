import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';
import TT from "../../common/tooltip";
class ROW extends Component {
    render() {
        const {element} = this.props;
        return (
            <tr className="odd gradeX" >
                <td> {element.title} </td>
                <td className="center text-center"> {element.image ? <img src={element.image.secure_url} alt="Test" width="70px" height="50px" className="scaleup-image" /> : <label className="label label-danger" >No Image </label> } </td>
                <td><Moment format="DD MMM YYYY">{element.created_at}</Moment></td>
                <td className="center"> <label className={element.status ? 'label label-info' : 'label label-danger'}>{element.status ? "Active" : "In-Active"}</label> </td> 
                <td>                    
                    <TT tooltip="Edit"><Link to={'/test/edit/' + element._id} className=" btn btn-xs grey-mint"><i className="fa fa-pencil-square-o"></i></Link>   </TT>
                </td>
            </tr>
        );
    }
}

export default ROW;