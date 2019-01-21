import React, { Component } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { toast } from "react-toastify";
import URLSearchParams from "url-search-params";
import loader from "../../assets/images/wait.gif";
/**Components */

/**services */
import HTTP from "../../services/http";
import session from "../../services/session";
/**endpoints */
import { getTestsHomePage, getPagesContent } from "../../utils/endpoints";

import messagePlusIcon from "../../assets/images/message-plus-icon.png";
import searchIcon from "../../assets/images/search-icon.png";
import { AddMessage } from "./AddMessageContainer.js";
import { Sidebar } from "./sidebarContainer";
import { MessageList } from "./messageListContainer";


/**actions */
//import { POPUP } from '../common/actions.js';
/**CSS */
import "./message.css";
//import ErrorBoundry from "../common/errorBoundry";

const mapStateToProps = state => ({
  message: state.userChat.data,
});

class message extends Component {
  demount=false;
  constructor(props) {
    super(props);
    /** defining state for component */
    this.state = {
      isLoading: false,
    };

   
  }

  componentDidMount(){
    this.demount=true;
  }
  
  componentWillUnmount(){
    this.demount=false;
  }


  render() {
    const { userID } = this.state;
    const { match ,message} = this.props;
    return (
      <div className="App">


      <div className=" outerBg">
        <div className="imgOuuter">
          <button className="closeBtn">x</button>
          <img src="../../assets/images/banner_bg.jpg" alt="" />
        </div>
      </div>

        <div className="dashBg msgOuterBx">
          <div className="container">
            <div className="messageSec">
           {/*  <div className="user-list-sec">
              <div className="message-heading">
                    <h4>Messaging </h4>
              </div>

              <div className="chatting-list-tabs">
                  <ul>
                    <li>Inbox</li>
                  </ul>
              </div>
           
              <Sidebar 
                message={message}  
                history={this.props.history} 
              />
            </div> */}
              {/* <div className="chat-sec"> */}
                
                {/* <div className="loaderBx"><img src={loader} /></div> */}
                <MessageList history={this.props.history}/>
                {/* <AddMessage /> */}
                
              {/* </div> */}
              {/* CLose Chat Section  */}
            </div>
          </div>
        </div>
      </div>
    );
  }

 
}
export default connect(mapStateToProps)(message);
