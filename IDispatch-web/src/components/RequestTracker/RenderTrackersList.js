
import React, { Component } from "react";
import { connect } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from "reactstrap";
import { toast } from "react-toastify";
import HTTP from "../../services/http";
import { POPUP } from "../common/actions";
import CallIcon from "../../assets/images/call-icon.png";
import ChatIcon from "../../assets/images/chat-icon1.png";
import RemoveIcon from "../../assets/images/remove-icon.png";
import {recievedSentTrackRequest,acceptDeclineTrackRequest} from "../../utils/endpoints";
import DefaultImage from "../../assets/images/img_avatar_default.png";


class RenderTrackersList extends Component{

    constructor(props){
      super(props);
      this.state={
        activeTab:"1",
        sendTrackRequest:[],
        isLoadingSend: false 
        
      }
      this.toggle=this.toggle.bind(this);
      this.recivedSendTrackList=this.recivedSendTrackList.bind(this);
     this.acceptDeclineRequest=this.acceptDeclineRequest.bind(this);
     
    }

    toggle(value){
      this.setState({activeTab:value})
    }

    componentDidMount(){
        this.recivedSendTrackList({type:"recieved"})
    }

    recivedSendTrackList(params={}){
      console.log("inside api calling")
      this.setState({ isLoadingSend: true });
        HTTP.Request("get",recievedSentTrackRequest,params)
        .then(response =>{
          console.log("response---====",response)
          this.setState({
            sendTrackRequest:response.data,
            isLoadingSend: false 
          })
        })
        .catch(err => {
          this.setState({ isLoadingSend: false });
        });
    }

    acceptDeclineRequest(data){
        HTTP.Request("post",acceptDeclineTrackRequest,data)
        .then((response)=>{
            this.recivedSendTrackList({type:"recieved"})
        })
        .catch(error=>{
            toast("Something went wrong",{ type: "info" })
        })
    }

    openConirmationPopUPRemove(funcData = undefined,list) {
        this.props.dispatch({
        type: POPUP,
        data: "confirmation",
        msg:`Are you sure you want ${list.name} to stop tracking you?`,
        funcData: funcData,
        delteFunction: this.props.remove
      })
    }


 
  
    render(){
    const {  converSationId,array ,isLoading ,remove} = this.props;
    const {sendTrackRequest}=this.state;
    return (
      <div className="col-md-12">
        <Nav tabs className="TabMain">
            <NavItem>
              <NavLink
                className={ this.state.activeTab === '1' ? "active":"" }
                onClick={() => { this.toggle('1'); }}
              >
              Trackers
               
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={this.state.activeTab === '2'? "active":""}
                onClick={() => { this.toggle('2'); }}
              >
                Request Received
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
              {array.length ? array.map(list =>{
                  return (
                <Col sm="6"  key={list._id}>
                  <div className=" addFrdInn">
                    <div className="row">
                      <div className="col-3 frdListImg">
                        <img src={list.profilePicture ?list.profilePicture:DefaultImage} onError={(e)=>{e.target.src = DefaultImage}} alt="" />
                      </div>
                      <div className="col-5 frdListName">
                        <strong>{list.name}</strong>
                        <small>{list.location ?`${list.location.substring(0,40)}...`:""}</small>
                        {list.mobile&&<span>
                          <img src={CallIcon} alt="" /> {list.mobile}
                        </span>}
                      </div>
                      <div className="col-4 frdListBtn-new">
                        <a
                          onClick={() => converSationId({ userId: list._id })}
                          className="frdMsgBtn"
                        >
                          <img src={ChatIcon} alt="" /> Message
                          </a>
                          <a
                           onClick={() => this.openConirmationPopUPRemove(list,list)}
                          
                        >
                          <img src={RemoveIcon} alt="" /> Cancel
                          </a>
                      </div>
                    </div>
                  </div>
                </Col>
                             )
                }): <div className="no-user-yet"> 
                No User Yet!
            </div>}
              
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
              {sendTrackRequest.length ? sendTrackRequest.map(list =>{
                       return (

                <Col sm="6" key={list._id}>
                  <div className=" addFrdInn">
                    <div className="row">
                      <div className="col-3 frdListImg"><img src={list.profilePicture ?list.profilePicture:DefaultImage} alt="" onError={(e)=>{e.target.src = DefaultImage}}/></div>
                      <div className="col-5 frdListName">
                         <strong>{list.name}</strong>
                         <small>{list.location?`${list.location.substring(0,40)}...` :""}</small>
                        {/*  <a href="#"><img src="/assets/images/tracking-note-icon.png" alt=""/> Tiles delivery in toronto</a> */}
                      </div>
                      <div className="col-4 frdListBtn trackersBtn">
                      <a  className="send_reqBtn acceptBtnNew" onClick={()=>this.acceptDeclineRequest({_id:list._id,type:"Accepted"})}><img src="/assets/images/right-icon.png" /> Accept</a>
                        <a  className="remove_Btn" onClick={()=>this.openConirmationPopUP({_id:list._id,type:"Rejected"})}><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                      </div>
                    </div>
                  </div> 
                </Col>
                     
                    )
                }):
                
                
                   <div className="no-user-yet"> 
                     No Pending Trackers
                 </div>

                }
              </Row>
            </TabPane>
          </TabContent>
        
      </div>
    );
  }

  openConirmationPopUP(funcData = undefined) {
            this.props.dispatch({
            type: POPUP,
            data: "confirmation",
            funcData: funcData,
            delteFunction: this.acceptDeclineRequest
        })
    }
  };

  export default connect() (RenderTrackersList);