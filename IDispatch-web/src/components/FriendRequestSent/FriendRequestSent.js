import React, { Component } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { POPUP } from "../common/actions";
/**services */
import HTTP from "../../services/http";

/**endpoints */
import { recievedSentFriendRequest,cancleFriendRequest } from "../../utils/endpoints";
/**actions */
//import { POPUP } from '../common/actions.js';
/**CSS */
import "./FriendRequestSent.css";
import ROW from "./row";
//import ErrorBoundry from "../common/errorBoundry";

class FriendRequestSent extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      array: [],
      arraySent: []
    };

    /**event binding  */
    this.friendList = this.friendList.bind(this);
    this.friendRecieved = this.friendRecieved.bind(this);
    this.remove     = this.remove.bind(this);
    this.openConirmationPopUP=this.openConirmationPopUP.bind(this);
    
  }
  componentDidMount() {
    this.friendList({ type: "sent" });
    this.friendRecieved({ type: "recieved" });
  }

  /*Listing */
  friendRecieved(params = {}) {
    this.setState({ isLoading: true });
    HTTP.Request("get", recievedSentFriendRequest, params)
      .then(response => {
        this.setState({ isLoading: false, arraySent: response.data });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log("err", err);
      });
  }

  render() {
    const { array,arraySent } = this.state;
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
                <Link to="/FriendRequestReceived">
                  <span>{(arraySent.length>0)? arraySent.length:""}</span>
                   Received Requests
                </Link>{" "}
                |{" "}
                <Link to="/FriendRequestSent" className="trackingActiveSent">
                  {/* <span>13</span>  */}
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
                  return <ROW key={list._id} openConirmationPopUP={this.openConirmationPopUP}  list={list} remove={this.remove} />;
                })
              ) : (
                <div className="dashBg">
                  <div className="container">
                    <h5>No Friends available yet!</h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  friendList(params = {}) {
    this.setState({ isLoading: true });
    HTTP.Request("get", recievedSentFriendRequest, params)
      .then(response => {
        console.log("response", response);
        this.setState({
          array: response.data,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  remove(data){
    let obj={};
    obj.to_userId=data;
    HTTP.Request("post",cancleFriendRequest,obj)
    .then((response)=>{
      toast(response.message,{type:"info"})
      this.friendList({type:"sent"});
    })
    .catch((err)=>{
      console.log("err",err)
    })

  }

  openConirmationPopUP=(funcData = undefined ,username="")=> {
    
    this.props.dispatch({
    type: POPUP,
    data: "confirmation",
    funcData: funcData,
    msg:`Are you sure you want to unfriend ${username}`,
    delteFunction: this.remove
  })
}


}
export default connect()(FriendRequestSent);
