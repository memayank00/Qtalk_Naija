
import React, { Component } from "react";
import { connect } from "react-redux";
import callIconBlue from "../../assets/images/mechanical_fail@1.5x.png";
import FormField from "../common/renderField";
import towIcon from "../../assets/images/tow-icon.png";
import needFuelIcon from "../../assets/images/need-fuel-icon.png";
import runningLate from "../../assets/images/running-late.png";
import flateTyre from "../../assets/images/flate-tyre.png";
import orangeRightIcon from "../../assets/images/orange-right-icon.png";
import searchIcon from "../../assets/images/search-icon.png";
import popupCloseIcon from "../../assets/images/popup-close-btn.png";
import { Field, reduxForm,reset} from "redux-form";
/**CSS */
import SendAlertTo from '../SendAlertTo/SendAlertTo';
import "./sendAlert.css";
import TimeComponent from '../common/Time_picker';
//import ErrorBoundry from "../common/errorBoundry";
class sendAlert extends Component {
        constructor(props) {
            super(props);
/** defining state for component */
this.state = {
isLoading: false,
array:[],
hour:"",
minute:"",
showSendalertTo:"",
show:false,
runningLateClass:""
};
/**event binding */
this.submitFrom = this.submitFrom.bind(this);
this.handleChange=this.handleChange.bind(this);
this.handleClose=this.handleClose.bind(this);
this.handleClock=this.handleClock.bind(this);
this.classForLate=this.classForLate.bind(this);
}
handleChange(event){
const target = event.target;
const value = target.value;
if(value){
this.setState({showSendalertTo:value})
}
}
handleClock(options){
let {hour,minute}=options;
if(minute!=="00"){ minute=`${minute}min`}else{minute=""};
if(hour!=="00"){hour=`${hour || ""}h`}else{hour=""};
let msg=`Running Late ${hour} ${minute}`
this.setState({showSendalertTo:msg})
}
handleClose(){
this.setState({show:false});
}
classForLate(value){
this.setState({runningLateClass:value})
}
render() {
const { content, tests,alertArray,showSendalertTo,runningLateClass } = this.state;
const { match,handleSubmit } = this.props;
return (
<div className="App">
<div className="dashBg sendalertOuter">
<div className="container">
{/* <div className="sendAlertToPopupBg"> */}
{/* <div className="sendAlertPopupBox">
<img className="popup-close-btn" src={popupCloseIcon} />
<h4>SEND ALERT TO</h4>
<div className="serach-bar-on-poup">
<input type="text" placeholder="Search" />
<img src={searchIcon}/>
</div>
<div className="send-alert-user-list-section">
<div className="chatting-user-box">
<img src="/assets/images/frd-list-img.png" alt="" />
<div className="chatting-user-list-text">
<h5>Mathew Peterson</h5>
<p>West Coast, Virginia</p>
<div className="checkb-box">
<input id="box1" type="checkbox" />
<label for="box1" className="alertbefore"></label>
</div>
</div>
</div>
<div className="chatting-user-box ">
<img src="/assets/images/frd-list-img.png" alt="" />
<div className="chatting-user-list-text">
<h5>Danny Evra</h5>
<p>West Coast, Virginia</p>
<div className="checkb-box">
<input id="box2" type="checkbox" />
<label for="box2" className="alertbefore"></label>
</div>
</div>
</div>
<div className="chatting-user-box">
<img src="/assets/images/frd-list-img.png" alt="" />
<div className="chatting-user-list-text">
<h5>Danny Evra</h5>
<p>West Coast, Virginia</p>
<div className="checkb-box">
<input id="box3" type="checkbox" />
<label for="box3" className="alertbefore"></label>
</div>
</div>
</div>
<div className="chatting-user-box ">
<img src="/assets/images/frd-list-img.png" alt="" />
<div className="chatting-user-list-text">
<h5>Danny Evra</h5>
<p>West Coast, Virginia</p>
<div className="checkb-box">
<input id="box4" type="checkbox" />
<label for="box4" className="alertbefore"></label>
</div>
</div>
</div>
<div className="chatting-user-box ">
<img src="/assets/images/frd-list-img.png" alt="" />
<div className="chatting-user-list-text">
<h5>Danny Evra</h5>
<p>West Coast, Virginia</p>
<div className="checkb-box">
<input id="box5" type="checkbox" />
<label for="box5" className="alertbefore"></label>
</div>
</div>
</div>
<div className="chatting-user-box ">
<img src="/assets/images/frd-list-img.png" alt="" />
<div className="chatting-user-list-text">
<h5>Danny Evra</h5>
<p>West Coast, Virginia</p>
<div className="checkb-box">
<input id="box6" type="checkbox" />
<label for="box6" className="alertbefore"></label>
</div>
</div>
</div>
</div>
<button className="send-alert-btn-popup">Send</button>
</div> */}
{/* </div> */}
{!this.state.show &&<div className="sendAlert">

<form onSubmit={handleSubmit(this.submitFrom)} className="newinputDesign">
<div className="row">
<div className="sendalertHd">
<h4>
{/* <img src={towIcon} /> */}
        <span>Breakdown</span>
        </h4>
        </div>
        <div className="col-sm-12 sendalertlistInn">
        <div className={(showSendalertTo=="Breakdown Need Fuel") ?"sendAlertBoxActive sendAlertBox" :"sendAlertBox"}>
        <div className="row">
        <div className="col-9">
        <h4>
        <img src={needFuelIcon} />
        <span>Need Fuel</span>{" "}
        </h4>
        </div>
        <div className="col-3">
        <span className="right-icon">
        <img src={orangeRightIcon} />
        </span>
        </div>
        <Field
        name="sendAlert"
        value="Breakdown Need Fuel"
        type="radio"
        component={FormField}
        className="sendAlertCheck"
        onChange={this.handleChange}
        />
    </div>
    </div>
    </div>
    </div>
    <div className="row">
    <div className="col-sm-12 sendalertlistInn">
    <div className={(showSendalertTo=="Breakdown Flat Tire") ?"sendAlertBoxActive sendAlertBox" :"sendAlertBox"}>
    <div className="row">
    <div className="col-9">
    <h4>
    <img src={flateTyre} />
    <span>Flat Tire</span>{" "}
    </h4>
    </div>
    <div className="col-3">
    <span className="right-icon">
    <img src={orangeRightIcon} />

</span>
</div>
<Field
name="sendAlert"
value="Breakdown Flat Tire"
type="radio"
component={FormField}
className="sendAlertCheck"
onChange={this.handleChange}
/>
</div>
</div>
</div>
<div className="col-sm-12 sendalertlistInn">
<div className={(showSendalertTo=="Breakdown Mechanical Failure") ?"sendAlertBoxActive sendAlertBox" :"sendAlertBox"}>
<div className="row">
<div className="col-9">
<h4>
<img src={callIconBlue} />
<span>Mechanical Failure</span>{" "}
</h4>
</div>
<div className="col-3">
<span className="right-icon">
<img src={orangeRightIcon} />

{/* <input
type="radio"
name="sendAlert"
value="Call Me"
className="sendAlertCheck"
onChange={this.handleChange}
/> */}
</span>
</div>
<Field
name="sendAlert"
value="Breakdown Mechanical Failure"
type="radio"
component={FormField}
className="sendAlertCheck"
onChange={this.handleChange}
/>
</div>
</div>
</div>
</div>
<div className="sendalertHd paddright0">
<h4>
{/* <img src={flateTyre} /> */}
<span>Running Late</span>
</h4>
</div>
<div className="row">
<div className="col-sm-12 sendalertlistInn">
<div className={(showSendalertTo.indexOf("Running Late")>-1 || runningLateClass)?"sendAlertBoxActive sendAlertBox" :"sendAlertBox"}>
<div className="row">
<div className="col-7">
<h4>
<img src={runningLate} />
<span>How Late?</span>{" "}
</h4>
</div>
<div className="col-5">
{/* <span className="right-icon">
<img src={orangeRightIcon} />
</span> */}
<div className="dataPickerNew">
<Field
name="sendAlert"
classForLate={this.classForLate}
component={TimeComponent}
onChange={this.handleClock}
/>
</div>
{/* <input
type="radio"
name="sendAlert"
value="Running Late"
className="sendAlertCheck"
onChange={this.handleChange}
/> */}
</div>
</div>
</div>
</div>
</div>
<button className="sendAlertBtn"
type="submit"
//onClick={this.submitFrom}
>
Send
</button>
</form>
</div>}
{this.state.show&&<SendAlertTo showSendalertTo={this.state.showSendalertTo} show={this.state.show} handleClose={this.handleClose}/>}
</div>
</div>
</div>
);
}
submitFrom(values){
if(!values.sendAlert){
this.setState({show:false})
return;
}else{
this.setState({show:true})
}
}
}
let SendAlertToRunning = reduxForm({
form: "SendAlertTo"
})(sendAlert);
export default connect()(SendAlertToRunning);

