import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, ClassNames, CardTitle, CardText, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
import { POPUP } from "../common/actions";
/**services */
import HTTP from "../../services/http";
import * as ApiUrl from "../../utils/endpoints";
import session from "../../services/session";
import CallIcon from "../../assets/images/call-icon.png";
import ChatIcon from "../../assets/images/chat-icon1.png";
import canclIcon from "../../assets/images/remove-icon.png";
import Loader from '../common/loader';
import {recievedSentTrackRequest,cancleTrackRequest} from "../../utils/endpoints";
import DefaultImage from "../../assets/images/img_avatar_default.png";

class RenderTrackList extends Component{

    constructor(props){
      super(props);
      this.state={
        activeTab:"1",
        sendTrackRequest:[],
        isLoadingSend: false 
      }
      this.toggle=this.toggle.bind(this);
      this.recivedSendTrackList=this.recivedSendTrackList.bind(this);
      this.cancelRequest=this.cancelRequest.bind(this);
    }
    toggle(value){
      this.setState({activeTab:value})
    }

    componentDidMount(){
        this.recivedSendTrackList({type:"sent"})
    }

    recivedSendTrackList(params={}){
      this.setState({isLoadingSend: true })
        HTTP.Request("get",recievedSentTrackRequest,params)
        .then(response =>{
          this.setState({
            sendTrackRequest:response.data,
            isLoadingSend: false 
          })
        })
        .catch(err => {
          this.setState({ isLoadingSend: false  });
        });
    }
  
    render(){
    const { array, converSationId ,isLoading} = this.props;
    const {sendTrackRequest}=this.state;
    return (
      <div className="col-md-12">
       
        <Nav tabs className="TabMain">
            <NavItem>
              <NavLink
                className={ this.state.activeTab === '1' ? "active":"" }
                onClick={() => { this.toggle('1'); }}
              >
                 Tracking
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={this.state.activeTab === '2'? "active":""}
                onClick={() => { this.toggle('2'); }}
              >
              Request Sent
               
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
          {isLoading && <Loader />}
            <TabPane tabId="1">
            <Row >
            {array.length ? array.map(list =>{
                       return (
                        
                        <Col key={list._id} sm="6">
                          <div className=" addFrdInn">
                            <div className="row">
                              <div className="col-3 frdListImg">
                                <img src={list.profilePicture} onError={(e)=>{e.target.src = DefaultImage}} alt="" />
                              </div>
                              <div className="col-5 frdListName">
                                <strong>{list.name}</strong>
                                <small>{list.location ?`${list.location.substring(0,40)}...`:""}</small>
                                {list.mobile &&<span>
                                  <img src={CallIcon} alt="" /> {list.mobile}
                                </span>}
                              </div>
                              <div className="col-4 frdListBtn-new">
                                
                                <a
                                  onClick={() => converSationId({ userId: list._id })}
                                  className="frdMsgBtn">
                                  <img src={ChatIcon} /> Message
                                </a>
                                <a class="remove_Btn"><img src={canclIcon} /> Cancel</a>
                                
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
              <Row >
            {sendTrackRequest.length ? sendTrackRequest.map(list =>{
                       return (
                        
                        <Col sm="6" key={list._id}>
                        <div className=" addFrdInn">
                          <div className="row">
                            <div className="col-3 frdListImg"><img src={list.profilePicture ?list.profilePicture:DefaultImage} onError={(e)=>{e.target.src = DefaultImage}} alt="" /></div>
                            <div className="col-5 frdListName">
                               <strong>{list.name}</strong>
                               <small>{list.location?`${list.location.substring(0,40)}...` :""}</small>
                            </div>
                            <div className="col-4 frdListBtn">
                              <a onClick={()=>{this.openConirmationPopUP(list._id)}} className="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                            </div>
                          </div>
                        </div> 
                      </Col>
                    
                       )
            }):<div className="no-user-yet"> 
            No Pending Tracking
        </div>}
              </Row>
            
                
              
            </TabPane>
          </TabContent>
        
      </div>
    );
  }

  cancelRequest(id){
    let obj={
      "to_userId":id
    }
     HTTP.Request("post",cancleTrackRequest,obj)
     .then((response)=>{
      this.recivedSendTrackList({type:"sent"})
     })
     .catch(error=>{
       console.log("error-->",error)
     })
  }

    /**open the confirmation popup */
    openConirmationPopUP(funcData = undefined) {
         this.props.dispatch({
            type: POPUP,
            data: "confirmation",
            funcData: funcData,
            msg:'Are you sure you want to cancel your tracking request?',
            delteFunction: this.cancelRequest
        })
    }
  };

  export default connect() (RenderTrackList);