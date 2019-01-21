import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import callIconBlue from "../../assets/images/call-icon2.png";
import towIcon from "../../assets/images/tow-icon.png";
import needFuelIcon from "../../assets/images/need-fuel-icon.png";
import runningLate from "../../assets/images/running-late.png";
import { getFriendList } from "../../utils/endpoints";
import { push } from "react-router-redux";
import flateTyre from "../../assets/images/flate-tyre.png";
import orangeRightIcon from "../../assets/images/orange-right-icon.png";
import searchIcon from "../../assets/images/search-icon.png";
import popupCloseIcon from "../../assets/images/popup-close-btn.png";
import { Field, reduxForm, reset, SubmissionError } from "redux-form";
import InfiniteScroll from "react-infinite-scroller";
import ROW from "./row";
import FormField from "../common/renderField";
import CheckBoxArray from "../common/arrayCheckBox";
import CheckBoxArray2 from "../common/arrayCheckBox2";
import _ from "lodash";

/**Components */
/**services */
import HTTP from "../../services/http";
/**endpoints */
import { getUsersToAlert, sendAlertToUsers } from "../../utils/endpoints";

/**CSS */
import "./SendAlertTo.css";

class SendAlertTo extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      hasMore: true,
      page:1,
      per:10,
      trackPage:1,
      hasMoreTrack:true,
      totalFrnds:null,
      totalTracks:null,
      scrolling:false,
      scrollingTrack:false,
      data: { frndsData: {}, tracksData: {} },
      frndsSelected: [],
      trackSelected: [],
    };
    /**event binding  */
    this.getAlertUser = this.getAlertUser.bind(this);
    this.submitFrom = this.submitFrom.bind(this);
 
  }

  componentDidMount() {
    this.getAlertUser({ page: 1 });
  }

  getAlertUser(params = {}) {
    this.setState({ isLoading: true });
    let finalfrndsArray = [],
      finaltrackArray = [];
    HTTP.Request("get", getUsersToAlert, params)
      .then(response => {
        if (
          response.data &&
          response.data.frndsData &&
          Array.isArray(response.data.frndsData.userInfo)
        ) {
          response.data.frndsData.userInfo.map(val => {
            if (val.alertSent) {
              finalfrndsArray.push(val);
            }
          });
          this.setState({totalFrnds:response.data.frndsData.count[0]?response.data.frndsData.count[0].total:null})
        }

        if (
          response.data &&
          response.data.tracksData &&
          Array.isArray(response.data.tracksData.userInfo)
        ) {
          response.data.tracksData.userInfo.map(val => {
            if (val.alertSent) {
              finaltrackArray.push(val);
            }
          });
          this.setState({totalTracks:response.data.tracksData.count[0]?response.data.tracksData.count[0].total:null})
          
        }
        this.setState({
          data: response.data ? response.data : {},
          frndsSelected: finalfrndsArray,
          trackSelected: finaltrackArray,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  getUserALertFriends(params = {}) {
    const { frndsSelected, data } = this.state;
    let finalfrndsArray = [], userInfo = [];
    let objCopy = JSON.parse(JSON.stringify(data));
    HTTP.Request("get", getUsersToAlert, params)
      .then(async response => {
        if (response.data && response.data.frndsData &&
          Array.isArray(response.data.frndsData.userInfo)) {
          response.data.frndsData.userInfo.map(val => {
            if (val.alertSent) {
              finalfrndsArray.push(val);
            }
          });
          response.data.frndsData.userInfo.map(val => {
            if (objCopy.frndsData && objCopy.frndsData.userInfo) {
              objCopy.frndsData.userInfo.push(val);
            }
          });
          this.setState({
            data: { ...data, ...objCopy },
            frndsSelected: [...frndsSelected, ...finalfrndsArray],
            isLoading: false
          });
        }

      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }


  getUserALertTracks(params = {}) {
    const { trackSelected, data } = this.state;
    let finalfrndsArray = [], userInfo = [];
    let objCopy = JSON.parse(JSON.stringify(data));
    HTTP.Request("get", getUsersToAlert, params)
      .then(async response => {
        if (response.data && response.data.tracksData &&
          Array.isArray(response.data.tracksData.userInfo)) {
          response.data.tracksData.userInfo.map(val => {
            if (val.alertSent) {
              finalfrndsArray.push(val);
            }
          });
          response.data.tracksData.userInfo.map(val => {
            if (objCopy.tracksData && objCopy.tracksData.userInfo) {
              objCopy.tracksData.userInfo.push(val);
            }
          });
          this.setState({
            data: { ...data, ...objCopy },
            trackSelected: [...trackSelected, ...finalfrndsArray],
            isLoading: false
          });
        }

      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  

  
  handleScrollTrack=(e)=>{
    const {scrollingTrack,totalTracks,data,per,trackPage}=this.state;
    if(Math.ceil(totalTracks/10)<=trackPage) {
      this.setState({hasMoreTrack:false});
      return;
    }else{
      this.loadMoreTrack();
    }
  }

  loadTrackUsers=()=>{
    const {per,trackPage}=this.state;
    this.getUserALertTracks({"page":trackPage})   
    this.setState({scrollingTrack:false})
  }

  loadMoreTrack=()=>{
    this.setState(prevState=>({
      trackPage:prevState.trackPage+1,
      scrollingTrack:true,
    }),this.loadTrackUsers)
  }



  handleScroll=(e)=>{
    const {scrolling,totalFrnds,data,per,page}=this.state;
    if(Math.ceil(totalFrnds/10)<=page) {
      this.setState({hasMore:false});
      return;
    }else{
      this.loadMore();
    }
  }

  loadUsers=()=>{
    const {per,page}=this.state;
    this.getUserALertFriends({"page":page})   
    this.setState({scrolling:false})
  }

  loadMore=()=>{
    this.setState(prevState=>({
      page:prevState.page+1,
      scrolling:true,
    }),this.loadUsers)
  }



  render() {
    console.log("this.props-->",this.props)
    const {data,frndsSelected,trackSelected,hasMore,scrolling,scrollingTrack } = this.state;
    const { match, showSendalertTo, handleSubmit } = this.props;
    return (
      <div className="App">
        <div className="dashBg sendalertOuter">
          <div className="container">
          <div className="alertBackBtn">
              <a href="">Back</a>
          </div>
            <Form onSubmit={handleSubmit(this.submitFrom)}>
              <div className="SendAlertTo_Outer">
                <h4>SEND ALERT TO</h4>

                <div className="serach-bar-on-poup">
                  <Field
                    type="text"
                    name="message"
                    placeholder="Enter Message"
                    component={FormField}
                  />
                  {/*  <img src={searchIcon} /> */}
                </div>
             
             <div className="row">

<div className="col-sm-6">
<p>Friends</p>
               <div  className="send-alert-user-list-section" 
                ref={(ref) => this.scrollParentRef = ref}>
                  {data.frndsData && data.frndsData.userInfo ? (
                   <InfiniteScroll
                   pageStart={0}
                   initialLoad={false}
                   loadMore={this.handleScroll}
                   hasMore={this.state.hasMore}
                   useWindow={false}
                   getScrollParent={() => this.scrollParentRef}
                   loader={scrolling?<div className="loader" key={0}>Loading ...</div>:""}
               >   
                  <Field
                        name="alertArray"
                        component={CheckBoxArray}
                        options={data.frndsData.userInfo}
                        selcetedByProps={frndsSelected ? frndsSelected : []}
                      />
                      </InfiniteScroll>
               
                  ) : (
                    ""
                  )}


                </div>

</div>


<div className="col-sm-6">
<p>Trackers</p>
<div className="send-alert-user-list-section"  ref={(ref) => this.scrollParentRef = ref}>
   {data.tracksData&&
   data.tracksData.userInfo &&
   data.tracksData.userInfo.length ? (
    <InfiniteScroll
    pageStart={0}
    initialLoad={false}
    loadMore={this.handleScrollTrack}
    hasMore={this.state.hasMoreTrack}
    useWindow={false}
    getScrollParent={() => this.scrollParentRef}
    loader={scrollingTrack?<div className="loader" key={0}>Loading ...</div>:""}
> 
       <Field
         name="alertArrayTrack"
         component={CheckBoxArray2}
         options={data.tracksData.userInfo}
         selcetedByProps={trackSelected ? trackSelected : []}
       />
    </InfiniteScroll>
   ) : (
     ""
   )}
 </div>

</div>



</div>

                <button
                  type="submit"
                  disabled={this.props.invalid || this.props.submitting}
                  className="send-alert-btn-popup"
                >
                  Send
                </button>
              </div>
            </Form>




          </div>
        </div>
      </div>
    );
  }
  submitFrom(values) {
    let newUserIds = [],msg,finalmsg="";
    const { dispatch, reset,showSendalertTo} = this.props;
    if (values.message || showSendalertTo) {
      if(values.message){
        msg=` : ${values.message || ""}`
      }
      finalmsg = `@#ALERT - ${showSendalertTo}${msg || ""}`;
    }
    if (values.alertArray && Array.isArray(values.alertArray)) {
      newUserIds = _.map(values.alertArray, function(el) {
        return el._id;
      });
    }
    if (values.alertArrayTrack && Array.isArray(values.alertArrayTrack)) {
      let trackIds = _.map(values.alertArrayTrack, function(el) {
        return el._id;
      });
      newUserIds=[...newUserIds,...trackIds];
    }
    console.log({showSendalertTo,finalmsg})
   
    let obj = {
      userIds: newUserIds,
      message: finalmsg
    };
  
    HTTP.Request("post", sendAlertToUsers, obj)
      .then(response => {
        if(response.type === "success"){
          toast(response.message, { type: "success" });
        }
        this.props.handleClose();
      })
      .catch(error => {
        console.log("error-->", error);
      });
  }
}

let SendAlertForm = reduxForm({
  form: "SendAlertForm"
})(SendAlertTo);
export default connect()(SendAlertForm);
