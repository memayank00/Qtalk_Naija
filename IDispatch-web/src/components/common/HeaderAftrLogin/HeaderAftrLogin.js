import React, { Component } from 'react';
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu,
  DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import {Link, NavLink} from 'react-router-dom';
import dashlogo from "../../../assets/images/logo.png";
import MapLogo from "../../../assets/images/hdr-map-icon.png";
import MsgIcon from "../../../assets/images/hdr-msg-icon.png";
import FrdIcon from "../../../assets/images/hdr-frd-icon.png";
import TrackIcon from "../../../assets/images/user@4x.png";
import NotifIcon from "../../../assets/images/hdr-notifi-icon.png";
import Alert from "../../../assets/images/andro_alert_icon/alert.png";
import Socket from "../../../socket";
/**Components */
import { toast } from "react-toastify";
/**services */
/*import HTTP from '../../services/http';
import session from '../../services/session';*/
import './HeaderAftrLogin.css';
/**CSS */
//import ErrorBoundry from "../common/errorBoundry";
import Example from './mobileHeader';



class HeaderAftrLogin extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.notificationCount =this.notificationCount.bind(this);

    /**event binding  */
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount(){
    const {user} = this.props;
    this.props.fetchNotificationCount();
    Socket.callEvent("login",{userId:user._id});
            // Socket.callEvent("get.online.friends",{userId:user._id});
    Socket.callEvent("acknowledge.login",{userId:user._id});
    window.socket.on("request.type",(response)=>{
      this.props.increaseCount();
      toast(response.message, { type: "success" });
    })
  }

  notificationCount(){
    this.props.resetCount();
  }

  render() {
    const {user,notificationCount} = this.props;
    return (
      
      <div className="App">
        <header className="headerBg aftLogBg">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-sm-8 col-xs-8">
                <div className="logoBx">
                <Link to={""}>
                <img src={dashlogo} alt="Logo" />
                </Link>
               {/*    <a href=""><img src="/assets/images/dash-logo.png" alt="Logo" /></a> */}
                </div>
              </div>
              <div className="col-md-8 col-sm-4 col-xs-4 aftLogHdr_Right">
              <Navbar color="light" light expand="md">
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto">
                  <NavItem>
                      <NavLink 
                        to='/dashboard' 
                        ariaCurrent='page' 
                        activeclassname="activeNavigation"
                        className="nav-link"
                       >
                      <i><img src={MapLogo} alt="" /></i>
                        <span>Map</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to='/message' activeclassname="active" className="nav-link ">
                      <i><img src={MsgIcon} alt=""/>
                        {/* <small>1</small> */}
                      </i>
                      <span>Messages</span>
                      </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to='/Friends' activeclassname="active" className="nav-link ">
                      <i><img src={FrdIcon} alt=""/></i>
                        <span>Friends</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to='/tracking-users' activeclassname={"active"} className="nav-link">
                        <i><img src={TrackIcon} alt=""/></i>
                        <span>Tracking</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/notification-view" className="nav-link"  onClick={this.notificationCount}>
                      <i><img src={NotifIcon} alt=""/>
                         {notificationCount>0 ? <small>{notificationCount}</small>:""}
                      </i>
                        <span>Notification</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/send-alert" className="nav-link" >
                      <i><img src={Alert} alt=""/>
                        
                      </i>
                        <span>Send Alert</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                  {/*   <NavLink href="#"> */}
                  <NavLink to='/MyAccount' className="nav-link">
                     <i className="user-hed-img">
                     <img src={user.profilePicture} alt="" />
                      </i>
                        <span>My Account</span>
                        </NavLink>
                   {/*  </NavLink> */}
                  </NavItem>
                </Nav>
                </Collapse>
                </Navbar>
              </div>
            </div>
          </div>
        </header>
    </div>
    );
  }
}


const mapStatesToProps = state => {
  const {routing:{location}} = state;
return {
  location,
  user:state.user.user,
  notificationCount:state.notificationCount.data
};
};

const mapDispatchToProps = dispatch => ({
  fetchNotificationCount: (params={}) => dispatch({ type: "NOTIFICATIONS_COUNT_REQUEST" ,data:params}),
  resetCount:()=> dispatch ({type:'RESET_BATCH'}),
  increaseCount:()=>dispatch({type:'INCREASE_BATCH'})
});



export default connect(mapStatesToProps,mapDispatchToProps)(HeaderAftrLogin);