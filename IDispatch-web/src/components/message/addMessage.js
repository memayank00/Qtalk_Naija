import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Input, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Field, reduxForm } from "redux-form";
import attacmentIcon from "../../assets/images/attachment-icon.png";
import sendBtnIcon from "../../assets/images/send-icon-btn.png";
import galleryBtn from "../../assets/images/gallery.png";
import MapIcon from "../../assets/images/map-icon.png";
import FormField from "../common/renderField";
import {addMessage, getConversationId } from "../../actionCreator/ActionCreators";
import URLSearchParams from "url-search-params";
import {required} from "../common/fieldValidations";
import HTTP from "../../services/http";
import axios from 'axios';

const mapDispatchToProps = dispatch => ({

  getConversationId:(userId)=>
  dispatch(getConversationId(userId)),
  addMessage: (ConversationId, Receiver, Body,Attachment) =>
  dispatch(addMessage(ConversationId, Receiver, Body,Attachment))
});

class AddMessage extends Component {
  constructor(props) {
    super(props);

    this.state = ({popoverOpen: false});
    this.sendMessage = this.sendMessage.bind(this);
    this.getFile = this.getFile.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleLocation=this.handleLocation.bind(this);
  }
  

  toggle() {
    this.setState({popoverOpen: !this.state.popoverOpen });
  }

  render() {
    const { handleSubmit } = this.props;
    return (<div className="writeMessage" >
        <form onSubmit={handleSubmit(this.sendMessage)}>
          <Field component={FormField}  type="text" name="message" placeholder="Write a Message or attached file" />
          {/*   <input type="text" placeholder="Write a Message or attached file" /> */}

          <div className="msgsendOuter">
            <span className="upload-btn-wrapper attach-icon">
              <Button id="Popover1" onClick={this.toggle}>
                <img src={attacmentIcon}  />
              </Button>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                <ul className="popoverList">
                  <li><a className="galleryImg"><img src={galleryBtn} /><Input type="file" onChange={this.getFile} name="file" id="exampleFile" accept="image/*"/></a></li>
                  <li><a onClick={this.handleLocation} className="LocationImg"  ><img src={MapIcon} /></a></li>
                </ul>
              </Popover>
               
            </span>

            <button disabled={this.props.invalid || this.props.submitting}>
              <img src={sendBtnIcon} /> Send
            </button>
          </div>
        </form>
      </div>);
  }

  checkWhiteSpace=(str)=>{
    if (!str.replace(/\s/g, '').length) {
      console.log("inside")
    return true;
  }
    return false;
  }
  scrollToBottom () {
    let element=document.querySelector(".allChats");
    setTimeout(() => {
      if(element){
        element.scrollTop = element.scrollHeight + 100;
        
        setTimeout(() => this.setState({initialLoad : false}), 100);
      }
    }, 1000);
  }
    sendMessage(data) {
      if(this.checkWhiteSpace(data.message)){
        return;
      }
        const { message, user: { user }, reset, ConversationId } = this.props;
        const { location } = this.props.routing;
        const Body = data.message;
        if (location) {
          let Receiver = new URLSearchParams(location.search).get("id");
          this.props.addMessage(ConversationId, Receiver, Body);
          this.props.reset();
          this.scrollToBottom();
        }
      
    }
    
    handleLocation(){
      let url="https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAVf8ozEwneDeVCcM8z_byfxwPvdtHWDCY";
      axios.post(url, { })
      .then(res => {
        if(res.location && res.location.lat){
          let placeUrl=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.location.lat},${res.location.lng}&key=AIzaSyA8aQ_1ntOgoUEndDMbc6gZeUdSGU_QBdw`;
              const { message, user: { user }, reset, ConversationId } = this.props;
              const { location } = this.props.routing;
              const Body = `@#LOCATION - ${res.location.lat} - ${res.location.lng}`
               if (location) {
                  let Receiver = new URLSearchParams(location.search).get("id");
                  this.props.addMessage(ConversationId, Receiver, Body);
                  this.setState({popoverOpen: !this.state.popoverOpen });
                }
              }
           
          })
      }
    
   
    getFile(event) {
      const { message, user: { user }, reset, ConversationId } = this.props;
      const { location } = this.props.routing;
      let Receiver = new URLSearchParams(location.search).get("id");
      var selected=event.target.files[0]// CREATE AN NEW INSTANCE.
      this.setState({popoverOpen: !this.state.popoverOpen });
      this.props.addMessage(ConversationId, Receiver,"",event.target.files[0]);
      //this.props.loadUserList({page:1});
    }
  }





//decorate form component
let Add_Message_Form = reduxForm({
  form: "Add_Message_Form",
  validate: values => {
    const errors = {};
    if (!values.message) {
      errors.message = " ";
    }
    return errors;
  }
})(AddMessage);
export default Add_Message_Form;

/* export default connect(
  () => ({}),
  mapDispatchToProps
)(Add_Message_Form); */

/* export default AddMessage; */
