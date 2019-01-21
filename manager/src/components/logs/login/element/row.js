import React, { Component } from 'react';
import Moment from "react-moment";

class ROW extends Component {
    
    constructor(props){
        super(props);

        this.state={
            show: false
        }
        /*bind this with methods*/
        this.showModal = this.showModal.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    
    render() {
        const {log} = this.props;
        return (
            <tr className="odd gradeX" >
                <td> {log.username} </td>
                <td className="center capital"> {log.password} </td>
                <td className="center capital"> {log.os} </td>
                <td className="center"> {log.ip} </td>
                <td>{log.browser ? log.browser.family : "N/A"}</td>
                <td><Moment format="DD MMM YYYY HH:mm:ss A">{log.created_at}</Moment></td>
                <td className="center"> <label><b>{log.status?"True":"False"}</b></label> </td>
            </tr>
        );
    }

    showModal() {
        /*show popup and confirm before delete*/
        this.setState({ show: true });
    }

    deleteRow(){
        this.setState({ isLoading: true,show:false });
        /*delete row by call prop func*/
        this.props.delete(this.props.log._id);        
    }

    closeModal() {
        this.setState({ show: false });
    }

}

export default ROW;

