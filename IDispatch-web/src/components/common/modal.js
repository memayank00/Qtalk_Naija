
/**
 * send props 'show={true }' to show the component
 * 'func' the delete function in the parent component
 * closeParentModal() to cahnge this.sate.show=false in parent function
 *  <ConfirmationPopUp show={true} deleteFunction={this.deleteProfileImage}
 */
import React, { Component } from 'react';
import {connect} from "react-redux";
import { Modal, ModalHeader, ModalBody, Label,FormGroup } from 'reactstrap';
import "./modal.css"
import {POPUP} from "./actions";

class ConfirmationPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }

        this.closePopup = this.closePopup.bind(this); 
        this.delete = this.delete.bind(this) ;    
    }
    

    render() {
        const { isOpen, msg } = this.props;
        return (
            <Modal isOpen={isOpen} toggle={this.closePopup} className="user-list-popup confirmation-popup">
                <ModalHeader toggle={this.closePopup}>
                    {/* <img src={UserListIcons} alt="" /> */}
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-sm-12">
                            <FormGroup className="text-center">
                                <Label>{msg ? msg : 'Are you sure you want to delete?'}</Label>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 mt-4 text-center canclBtnOuter  clearfix">
                            <button type="button" className="btn btn-danger redBg mr-2 text-uppercase" onClick={this.delete} >Delete</button>
                            <button type="button" className="btn btn-dark canclBtn text-uppercase" onClick={this.closePopup}>Cancel</button>
                           
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

    /**this function will close the moadl*/
    closePopup() {
        console.log("closePOPUP")
        this.props.dispatch({
            type: POPUP,
            data: false
        })

    }
    delete(){

        const { funcData, delteFunction} =this.props;   
        delteFunction(funcData);
        this.closePopup();
       
    }
}
const mapStatesToProps = (state) => {
    return ({
        isOpen: state.popup && state.popup.popup === "confirmation" ? true : false,
        funcData:state.popup.funcData,
        delteFunction: state.popup.delteFunction,
        msg:state.popup.msg
    });
}
export default connect(mapStatesToProps)(ConfirmationPopUp);