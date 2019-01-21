import React, { Component } from 'react';
import Moment from "react-moment";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TT from "../../common/tooltip";
import Modal from '../../common/modal';

class ROW extends Component {
    constructor(props){
        super(props);

        this.state={
            show: false
        }
        /*bind this with methods*/
        this.showModal = this.showModal.bind(this);
        //this.deleteRow = this.deleteRow.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    
    render() {
        const {admin,adminID,callbackFromParent} = this.props;

 

        return (
            <tr className="odd gradeX" >
                <td> {admin.name} </td>
                <td> {admin.email} </td>
                <td> {admin.mobile ? admin.mobile:"NA"} </td>
                <td> {admin.username} </td>
                <td><Moment format="DD MMM YYYY">{admin.created_at}</Moment></td>            
                <td className="center"> <label className={admin.status ? 'label label-info' : 'label label-danger'}>{admin.status ? "Active" : "In-Active"}</label> </td> 
                {/* <td ><span  onClick={()=>callbackFromParent(1)}><i className="fa fa-trash"></i></span> </td> */}
                <td ><TT tooltip="Remove"><a className=" btn btn-xs red-mint" onClick={this.showModal}><i className="fa fa-trash no-pointer"  ></i></a></TT></td>
                {this.state.show && <Modal show={true} func={()=>callbackFromParent(admin._id,admin.index)} closeParentModal={this.closeModal} message={admin.name} />}
                {/* {(adminID !== admin._id)?<td>                    
                    <TT tooltip="Edit"><Link to={'/user-management/edit/' + admin._id} className=" btn btn-xs grey-mint"><i className="fa fa-pencil-square-o" ></i></Link></TT>
                </td>:
                <td >- </td>
                } */}
            </tr>
        );
    }
    showModal() {
        /*show popup and confirm before delete*/
        this.setState({ show: true });
    }

    // deleteRow(){
    //     this.setState({ isLoading: true,show:false });
    //     /*delete row by call prop func*/
    //     this.props.delete(this.props.cms._id);        
    // }

    closeModal() {
        this.setState({ show: false });
    }
}

/*get props*/
const mapStatesToProps =(state) => {
    return ({
        adminID: state.admin && state.admin.user ? state.admin.user._id : null
    });
}

export default connect(mapStatesToProps)(ROW);
