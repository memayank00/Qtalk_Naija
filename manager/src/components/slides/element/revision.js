import React, { Component } from 'react';
import Moment from "react-moment";
import { Link } from 'react-router-dom';
import RestoreModal from '../../common/restoreModal';
import InfoModal from '../../common/infoModal';

class RevROW extends Component {
    
    constructor(props){
        super(props);

        this.state={
            show: false,
            showInfo: false
        }
        /*bind this with methods*/
        this.showModal = this.showModal.bind(this);
        this.showInfoModal = this.showInfoModal.bind(this);
        this.restore = this.restore.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    
    render() {
        const {revision} = this.props;
        return (
            <tr className="odd gradeX">
                <td> {revision.title} </td>
                <td className="center"> {revision._Admin.firstname} </td>
                <td className="center"> {revision.order} </td>
                <td><Moment format="DD MMM YYYY hh:mm:ss A">{revision.created_at}</Moment></td>
                <td className="center"> <label className={revision.status?'label label-info':'label label-danger'}>{revision.status?"Active":"Pending"}</label> </td>
                <td>
                    <a className="btn btn-xs purple-sharp" onClick={this.showInfoModal} title="View"><i className="fa fa-search no-pointer"></i></a>
                    <a className="btn btn-xs green-haze" onClick={this.showModal} title="Restore"><i className="fa fa-refresh no-pointer" ></i></a>
                    {this.state.show && <RestoreModal show={true} func={this.restore} closeParentModal={this.closeModal} title={revision.title} />}                    
                    {this.state.showInfo && <InfoModal show={true} closeParentModal={this.closeModal} data={revision} />}                    
                </td>
            </tr>
        );
    }

    showInfoModal() {
        /*show popup and confirm before delete*/
        this.setState({ showInfo: true });
    }


    showModal() {
        /*show popup and confirm before delete*/
        this.setState({ show: true });
    }

    restore(){
        this.setState({ isLoading: true, show:false });
        /*delete row by call prop func*/
        this.props.restore(this.props.revision._id, this.props.revision.revision);        
    }

    closeModal() {
        this.setState({ show: false, showInfo: false });
    }

}

export default RevROW;