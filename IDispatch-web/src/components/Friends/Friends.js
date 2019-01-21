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
/**endpoints */
import { getFriendList,sendTrackRequest,unFriend } from "../../utils/endpoints";
import CallIcon from "../../assets/images/call-icon.png";
import AddIcon from "../../assets/images/add-icon2.png";
import ChatIcon from "../../assets/images/chat-icon1.png";
import RemoveIcon from "../../assets/images/remove-icon.png";
import AddIcon2 from "../../assets/images/add-icon.png";
import AddPeople from "../../assets/images/add-people-icon.png";
import Loader from '../common/loader';
/**actions */
import { POPUP } from "../common/actions";
import ChatFormModule from './msg.js';
import _ from "lodash";
import Socket from "../../socket";
import DefaultImage from "../../assets/images/img_avatar_default.png";
import { ValidateOnlyAlpha } from "../common/fieldValidations";
import searchIcon from "../../assets/images/search-icon.png";
/**CSS */
import "./Friends.css";

//import ErrorBoundry from "../common/errorBoundry";
var timer;
const RenderFriendsList = props => {

  const { list, converSationId,onlineUser,sendTrackRequest,openConirmationPopUP } = props;
  onlineUser.filter((val)=>{if(val==list._id) list.isOnline=true});
  let trackButton=<a onClick={()=>sendTrackRequest(list._id)}><img src={AddIcon} /> Follow</a>;
    // if(list.trackStatus=="Rejected" || list.trackStatus=="Pending"){
    //   trackButton=<div className="rejectedRqst">{list.trackStatus}</div>
    // }
    if(list.trackStatus=="Accepted"){
      trackButton=<Link to={`/user-location/${list._id}`}>
      <img src={AddIcon} /> Following</Link>;
    }
    
  return (
    <div className="col-md-6">
      <div className=" addFrdInn">
        <div className="row">
          <div className="col-3 frdListImg">
            <img src={list.profilePicture ?list.profilePicture:DefaultImage} alt="" 
            onError={(e)=>{e.target.src = DefaultImage}}/>
            {list.isOnline &&<i className="online"></i>}
          </div>
          <div className="col-5 frdListName">
            <Link to={`user-detail/${list._id}`}><strong>{list.name}</strong></Link>
            <small>{list.location ?`${list.location.substring(0,40)}...`:""}</small>
            <span>
              <img src={CallIcon} alt="" /> {list.mobile}
            </span>
          </div>
          <div className="col-4 frdListBtn-new">
            {trackButton}
            <a
              onClick={() => converSationId({ userId: list._id })}
              className="frdMsgBtn"
            >
              <img src={ChatIcon} /> Message
              </a>

               <a
                onClick={() => openConirmationPopUP({ friendId: list._id })}
             
              >
              <img src={RemoveIcon} /> Unfriend
              </a>
          </div>
        </div>
      </div>
    </div>
  );
};

class Friends extends Component {
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
      array: [],
      conversationId: "",
      userId: "",
      onlineUser:[],
      searchQuery:''
    };
    this.getFriends = this.getFriends.bind(this);
    this.converSationId = this.converSationId.bind(this);
    this.updateUser=this.updateUser.bind(this);
    this.sendTrackRequest=this.sendTrackRequest.bind(this);
    this.search = this.search.bind(this);
    this.remove = this.remove.bind(this);
    this.openConirmationPopUP=this.openConirmationPopUP.bind(this);
  }
  componentDidMount() {
    let {user} =this.props;
    if(this.props.user){
      Socket.callEvent("get.online.friends",{userId:user._id});
      Socket.OnlineFrndStatus("get.online.friends",{userId:user._id}).then(response=>{
        this.updateUser(response);
      });
    }
    Socket.OnlineUser("friend.online", {}).then(response => {
      const {array}=this.state;
      if(array.length){
        let newFrndsArray=array.map((value)=>{
          if(value._id==response.friendId){
            value.isOnline=true;
          }
          return value;
        })
        this.setState({array:newFrndsArray})
      }
    });
    this.getFriends();
  }

  sendTrackRequest(id){
    let obj = {};
    obj.to_userId = id;
    obj.type = "Track";
    HTTP.Request("post", sendTrackRequest, obj)
      .then(response => {
        if (response.type === "error") {
          toast(response.errors, { type: "info" });
        } else {
          toast(response.message, { type: "success" });
          let page=this.state.activePage;
          this.getFriends();
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  updateUser(response){
    let {friends:{online}}=response;
    this.setState({onlineUser:online})
  }

  render() {
    const { content, tests, array,isLoading,conversationId,onlineUser,userId } = this.state;
    const { match } = this.props;
    let newArray=[];
     if(array.length>0){
       newArray=_.orderBy(array, [array => array.name.toLowerCase()],['asc']);
     }
    
    return (
      <div className="App">
        <div className="findFrdBg">
          <div className="container">
            <div className="row">
              <div className="col-md-2 col-xs-12 findfrdHd">Friends</div>
             
              <div className="col-md-10 col-xs-12 addfrdBx friendsRight">
                <Link to="/AddFriendSearch">
                  <img src={AddIcon2} /> Add New Friends
                </Link>
                <Link to="/FriendRequestReceived">
                  <img src={AddPeople} /> Friend
                  Requests
                </Link>
                <div className="chatting-user-search">
                  <input 
                    type="text"
                    id="search"
                    autoComplete="off"
                    onChange={this.search}
                    placeholder="Search Friends"
                 />
                  <img src={searchIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashBg friendsBackBg">
          <div className="container">
          {isLoading && <Loader />}
            <div className="row">
              {array.length > 0 ? (
                newArray.map(list => {
                  return (
                    <RenderFriendsList
                      key={list._id}
                      list={list}
                      openConirmationPopUP={this.openConirmationPopUP}
                      sendTrackRequest={this.sendTrackRequest}
                      onlineUser={onlineUser}
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

  getFriends(params={}) {
    
    this.setState({ isLoading: true });
    HTTP.Request("get", getFriendList,params )
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

  /**SEARCH */
  search(e) {
    /**to remove Event Pooling  */
    e.persist();
    let seracherror = ValidateOnlyAlpha(e.target.value)
    if (seracherror) {
        this.setState({ seracherror: seracherror });
        return;
    }
    this.setState({ searchQuery: e.target.value, seracherror: seracherror });
    clearTimeout(timer);
    timer = setTimeout(() => {
        this.getFriends({
            text: e.target.value ? e.target.value : '',
        });
    }, 1000);
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

  remove(data){
    HTTP.Request('post',unFriend,data)
    .then((response)=>{
      if(response.type === 'success'){
        toast(response.data, { type: "info" });
      }else{
        toast('Something went wrong', { type: "info" });
      }
      this.getFriends();

    })
    .catch((err)=>{
      console.log(err)
    })
  }



  openConirmationPopUP(funcData = undefined) {
    this.props.dispatch({
    type: POPUP,
    data: "confirmation",
    funcData: funcData,
    delteFunction: this.remove
  })
}

}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
};
export default connect(mapStateToProps)(Friends);
