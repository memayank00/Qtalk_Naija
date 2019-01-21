import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, ClassNames, CardTitle, CardText, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
/**services */
import HTTP from "../../services/http";
import * as ApiUrl from "../../utils/endpoints";
import session from "../../services/session";
/**endpoints */
import { whoTrackMe,stopBeingTrack } from "../../utils/endpoints";

import AddIcon from "../../assets/images/add-icon2.png";

import AddIcon2 from "../../assets/images/add-icon.png";
import AddPeople from "../../assets/images/add-people-icon.png";
import TrackIcon from "../../assets/images/hdr-track-icon.png";
import ChatFormModule from '../Friends/msg.js';

import Loader from '../common/loader';
/*actions */
import { POPUP } from "../common/actions";

/*CSS */
import "./RequestTracker.css";
import RenderTrackersList from './RenderTrackersList';

//import ErrorBoundry from "../common/errorBoundry";



class RequestTracker extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      array: [],
      conversationId: "",
      userId: "",

    };
    this.getFriends = this.getFriends.bind(this);
    this.converSationId = this.converSationId.bind(this);
    this.remove = this.remove.bind(this);
  }
  componentDidMount() {
    this.getFriends();
  }

  remove(data){
    data.trackById=data._id
    HTTP.Request('post',stopBeingTrack,data)
    .then((response)=>{
      if(response.type === 'success'){
        toast(response.message, { type: "info" });
      }else{
        toast('Something went wrong', { type: "info" });
      }
      this.getFriends();
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  render() {
    const { content, tests, array,isLoading,conversationId, userId } = this.state;
    const { match } = this.props;
    return (
      <div className="App">
        <div className="findFrdBg">
          <div className="container">
            <div className="row">
              <div className="col-md-2 col-xs-12 findfrdHd">Trackers</div>
              <div className="col-md-8 col-xs-12 addfrdBx">
                <Link to="/Tracks">
                  <img src={AddIcon2} /> Add New Users
                </Link>
                <Link to="/tracking-users">
                  <img src={AddPeople} /> Tracking
                </Link>
                <Link className="active" to="/trackers">
                  <img src={AddPeople} /> Trackers
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dashBg">
          <div className="container">
          {isLoading && <Loader />}
            <div className="row">
                    <RenderTrackersList
                       array={array}
                       remove={this.remove}
                       isLoading={isLoading}
                       converSationId={this.converSationId}
                    />
            </div>
            
          </div>
        </div>
        {conversationId && (
              <ChatFormModule conversationId={conversationId} userId={userId} />
            )}
      </div>
    );
  }

  getFriends() {
    this.setState({ isLoading: true });
    HTTP.Request("get", whoTrackMe, {})
      .then(response => {
        this.setState({
          array: response.data ? response.data : [],
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  converSationId(params = {}) {
    const { history, dispatch } = this.props;
    this.setState({ isLoading: true, userId: params.userId });
    HTTP.Request("get", ApiUrl.getConversationId, params)
      .then(response => {
        if (response.type === "success") {
          this.setState({ isLoading: false, conversationId: response.data });
          HTTP.Request("post", ApiUrl.messageTrails, {
            conversationId: response.data
          })
            .then(_result => {
              if (_result.type === "success") {
                dispatch(push(`/message?id=${params.userId}`));
              } else {
                this.props.dispatch({ type: POPUP, data: "message" });
              }
            })
            .catch(error => {
              console.log("insde error");
            });
        } else {
          this.setState({ isLoading: false });
          dispatch(push("/dashboard"));
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }
}
export default connect()(RequestTracker);
