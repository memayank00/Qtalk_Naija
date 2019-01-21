/**
 * This component is usde for creating dynamic tables
 * @prop array :- data type must be array and have datato be fill in table
 * @prop thead :- mut be array and conatain headings in same order as to be shown in table thead
 * @prop tbody :- must be an array and contain key values 
 * @prop dateFormat :- String to show date in diffrent format
 * @prop noDate :-  to delete date column 
 * @prop noStatus :- to delete status column 
 */
import React, { Component } from 'react';
import {Table} from "react-bootstrap";
import Moment from "react-moment";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TT from "./tooltip";

class DyanmicTable extends Component {    
    render(){
        let { array, tbody, thead, dateFormat, noDate, noStatus, showActions, redirectLink} =this.props;
        return(
            <Table responsive striped bordered condensed hover>
                <thead>
                    <tr>{ thead.map((e,i)=><th key={i}>{e}</th>)}</tr>
                </thead>

                <tbody>
                    {array.map((element,i) => {                 
                        
                        return (
                            
                            <tr className="odd gradeX"key={element._id} >
                                {tbody.map((cell,index) => <td key={index}> {this.getData(element, cell)} </td>)}

                                {/* Thsi will be static for all tables.... */}
                                {!noStatus&& <td className="center"> <label className={element.status ? 'label label-info' : 'label label-danger'}>{element.status  ? "Active" : "In-Active"}</label> </td> }
                                {!noDate &&<td className="center"> <Moment format={dateFormat ||"DD MMM YYYY"}>{element.created_at}</Moment></td>}

                                {showActions && <TT tooltip="View"><Link to={redirectLink + element._id} className=" btn btn-xs blue-hoki"  ><i className="fa fa-eye"  ></i></Link></TT>}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

    getData(data, keys){
        // if key is at first level
        if (keys.indexOf(",") >= 0) return (keys.split(",").map(txt => data[txt])).join(" ");
        if (keys.indexOf(".") < 0) return data[keys];
        // If plain string, split it to array
        if (typeof keys === 'string') {
            keys = keys.split('.')
        }

        // Get key
        var key = keys.shift();

        // Get data for that key
        var keyData = data[key]

        // Check if there is data
        if (!keyData) {
            return undefined;
        }

        // Check if we reached the end of query string
        if (keys.length === 0) {
            return keyData;
        }

        // recusrive call!
        return this.getData(Object.assign({}, keyData), keys);
    }
}
/**to check for the props */
DyanmicTable.propTypes = {
    array: PropTypes.array.isRequired,
    tbody: PropTypes.array.isRequired,
    thead: PropTypes.array.isRequired,
    dateFormat:PropTypes.string,
    noDate:PropTypes.any
};

export default DyanmicTable;