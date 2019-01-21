import React, { Component } from "react";
import { connect } from "react-redux";
import { FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import { POPUP } from "../common/actions";
/**Components */
import ROW from "./row";
/**services */
import HTTP from "../../services/http";
import { Link } from "react-router-dom";
/**endpoints */
import {
  recievedSentFriendRequest,
  acceptDeclineFriendRequest
} from "../../utils/endpoints";
/**actions */
//import { POPUP } from '../common/actions.js';
/**CSS */
import "./FriendRequestReceived.css";
//import ErrorBoundry from "../common/errorBoundry";

class FriendRequestReceived extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      array: []
    };

    /**event binding  */
    this.friendList = this.friendList.bind(this);
    this.accept = this.accept.bind(this);
    this.openConirmationPopUP=this.openConirmationPopUP.bind(this);
   
  }
  componentDidMount() {
    this.friendList({ type: "recieved" });
  }

  render() {
    const { array } = this.state;
    const { match } = this.props;
    return (
      <div className="App">
        <div className="findFrdBg">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-xs-12 findfrdHd">
                Friends Requests
              </div>
              <div className="col-md-6 col-xs-12 trackingBy">
              <Link to="/FriendRequestReceived" className="trackingActive">
                  <span>{(array.length>0)? array.length:""}</span> Received Requests
                </Link>{" "}
                |{" "}
                <Link to="/FriendRequestSent">
                   Sent Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dashBg">
          <div className="container">
            <div className="row">
              {array.length > 0 ? (
                array.map(list => {
                  return (
                    <ROW
                      key={list._id}
                      list={list}
                      accept={this.accept}
                      openConirmationPopUP={this.openConirmationPopUP} 
                      
                    />
                  );
                })
              ) : (
                <div className="dashBg">
                  <div className="container">
                    <h5>No Pending Friend Request</h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* friend Listing */
  friendList(params = {}) {
    this.setState({ isLoading: true });
    HTTP.Request("get", recievedSentFriendRequest, params)
      .then(response => {
        this.setState({ isLoading: false, array: response.data });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log("err", err);
      });
  }

  /* Accept/Reject Friend Request */
  accept(data) {
    HTTP.Request("post", acceptDeclineFriendRequest, data)
      .then(response => {
        this.friendList({ type: "recieved" });
      })
      .catch(err => {
        console.log("err==>",err)
      });
  }

  openConirmationPopUP(funcData = undefined) {
    this.props.dispatch({
    type: POPUP,
    data: "confirmation",
    funcData: funcData,
    delteFunction: this.accept
  })
}


  
}
export default connect()(FriendRequestReceived);
