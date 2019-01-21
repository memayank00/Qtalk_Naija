import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
/**services */
import HTTP from "../../services/http";
import * as ApiUrl from "../../utils/endpoints";
import session from "../../services/session";
/**endpoints */
import { trackList } from "../../utils/endpoints";
import CallIcon from "../../assets/images/call-icon.png";
import AddIcon from "../../assets/images/add-icon2.png";
import ChatIcon from "../../assets/images/chat-icon1.png";
import AddIcon2 from "../../assets/images/add-icon.png";
import AddPeople from "../../assets/images/add-people-icon.png";
import TrackIcon from "../../assets/images/hdr-track-icon.png";
import LocatIcon from "../../assets/images/location.png";
import Loader from '../common/loader';
/**actions */
import { POPUP } from "../common/actions";
import ChatFormModule from './msg.js';
import DefaultImage from "../../assets/images/img_avatar_default.png";
/**CSS */
import "./Tracking.css";

//import ErrorBoundry from "../common/errorBoundry";

const RenderFriendsList = props => {
  const { list, converSationId } = props;
  return (
    <div className="col-md-6">
   
      <div className=" addFrdInn">
        <div className="row">
          <div className="col-3 frdListImg">
            <img src={list.profilePicture} onError={(e)=>{e.target.src = DefaultImage}} alt="" />
          </div>
          <div className="col-5 frdListName">
            <strong>{list.name}</strong>
            <small>{list.location}</small>
            <span>
              <img src={CallIcon} alt="" /> {list.mobile}
            </span>
          </div>
          <div className="col-4 frdListBtn-new">
            {/* <Link to="/AddFriendSearch">
              <img src={AddIcon} /> Follow
            </Link> */}
            <a
              onClick={() => converSationId({ userId: list._id })}
              className="frdMsgBtn"
            >
              {/* <Link to={`/message?id=${list._id}`} > */}
              <img src={ChatIcon} /> Message
              </a>
            {/* </Link> */}
            <a href="#" className="locatBtn"><img src={LocatIcon} /> Location</a>
          </div>
        </div>
      </div>
    </div>
  );
};

class Tracking extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      array: [],
      conversationId: "",
      userId: ""
    };
    this.getFriends = this.getFriends.bind(this);
    this.converSationId = this.converSationId.bind(this);
  }
  componentDidMount() {
    this.getFriends();
  }

  render() {
    const { content, tests, array,isLoading,conversationId, userId } = this.state;
    const { match } = this.props;
    return (
      <div className="App">
        <div className="findFrdBg">
          <div className="container">
            <div className="row">
              <div className="col-md-2 col-xs-12 findfrdHd">Friends</div>
              {/*       <div className="col-md-5 col-xs-12 findSrchBx">
                <FormGroup>
                  <Input type="text" name="name" id="search" placeholder="Search" />
                  <Button><img src="/assets/images/srch-icon.png" /></Button>
                </FormGroup>
             </div> */}
              <div className="col-md-8 col-xs-12 addfrdBx">
                <Link to="/Tracks">
                  <img src={AddIcon2} /> Add New Tracks
                </Link>
                <Link to="/RequestTracking">
                  <img src={AddPeople} /> Tracking
                </Link>
                <Link to="/RequestTracker">
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
              {array.length > 0 ? (
                array.map(list => {
                  return (
                    <RenderFriendsList
                      key={list._id}
                      list={list}
                      converSationId={this.converSationId}
                    />
                  );
                })
              ) : (
                <div className="dashBg">
                  <div className="container">
                    <h5>No Friends available yet!</h5>
                  </div>
                </div>
              )}
            </div>
            {conversationId && (
              <ChatFormModule conversationId={conversationId} userId={userId} />
            )}
          </div>
        </div>
      </div>
    );
  }

  getFriends() {
    this.setState({ isLoading: true });
    HTTP.Request("get", trackList, {})
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
export default connect()(Tracking);
