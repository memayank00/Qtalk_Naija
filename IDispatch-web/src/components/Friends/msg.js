
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './msg.css';
import { connect } from "react-redux";
import { POPUP } from "../common/actions";
import { Field, reduxForm,reset,SubmissionError} from "redux-form";
import FormField from "../common/renderField";
import {push} from 'react-router-redux';
import { toast } from "react-toastify";
import { AUTH_REQUEST } from '../../reducers/ActionTypes';
import { required, emailValiadte } from "../common/fieldValidations";
import Socket from "../../socket";
import {addMessage} from "../../actionCreator/ActionCreators";

class ModalExample extends React.Component {
  constructor(props){
    super(props);

    this.closePopup = this.closePopup.bind(this);
    this.submitFrom = this.submitFrom.bind(this);
  }

  closePopup() {
    const { dispatch } = this.props;
   this.props.dispatch({ type: POPUP, data: false });
  }

 
  render() {
    const {isOpen,handleSubmit,userId,conversationId} = this.props;
    return (
      <div>
        <Button color="danger" onClick={this.closePopup}>{this.props.buttonLabel}</Button>
        <Modal isOpen={isOpen} toggle={this.closePopup} className={this.props.className}>
          <ModalHeader toggle={this.closePopup}>
              <div className="modalLogo">
                {/* <img src="/assets/images/logo.png" /> */}
                <span>Send Message!</span>
              </div>
          </ModalHeader>
          <ModalBody>
          <Form onSubmit={handleSubmit(this.submitFrom)}>
            <div className="signInOuter">
          <Field
                    component={FormField}
                    type="text"
                    name="body"
                    placeholder="Message"
                    validate={[required]}
              />
       
            </div>
            <Button type="submit" 
              disabled={this.props.invalid || this.props.submitting}>
              Send
            </Button>
            </Form>
         
          </ModalBody>
            
        </Modal>
      </div>
    );
  }

  submitFrom(values){
    const {userId,conversationId} = this.props;
    this.props.addMessage(conversationId, userId, values.body); 
    this.props.dispatch({ type: POPUP, data: false });
    /* dispatch(push(`/message?id=${params.userId}`)); */
  }
}

let chatForm=reduxForm({
  form:"chatForm"
})(ModalExample)

const mapDispatchToProps = dispatch => ({
    dispatch:(value)=>
    dispatch(value),
    addMessage: (ConversationId, Receiver, Body,Attachment) =>
    dispatch(addMessage(ConversationId, Receiver, Body,Attachment))
  });

const mapStatesToProps = (state) => {  
  return ({
      isOpen: state.popup && state.popup.popup === "message" ? true : false
  });
}

export default connect(mapStatesToProps,mapDispatchToProps)(chatForm);