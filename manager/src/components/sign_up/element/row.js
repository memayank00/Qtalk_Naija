import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';
import TT from "../../common/tooltip";

class ROW extends Component {

    render() {
        const {element} = this.props;
        const divStyle = {
            textAlign: 'center'
        
          };
        let replied = <label className='label label-success'>Replied</label>;
        let notReplied = <label className='label label-danger'>Not Replied</label>
        return (
            <tr className="odd gradeX" >
                <td  width="10%"> {element.email} </td>
                <td  width="10%"> {element.address ?element.address.formatted_address:'NA'} </td>
                <td  width="10%"><Moment format="DD MMM YYYY">{element.created_at}</Moment></td>            
                <td style={divStyle} width="5%">                    
                    <TT tooltip="View"><Link to={'/get-out-of-market-lead-view/' + element._id} className=" btn btn-xs blue-madison"><i className="fa fa-search"></i></Link></TT>
                </td> 
            </tr>
        );
    }

}



export default ROW;

