import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

/**Use WithoutLogin to define routes  which are accessible by users without login 
 *eg:- /login,/forgot-password,/reset-password*/
import WithoutLogin from './withoutLogin';

/** Use PrivateRoute to define routes  which are accessible only by logged in  users*/
import PrivateRoute from './private';

/**Components */
/**Visitors com[ponents */
//import Header from '../components/Partials/MainHeader/MainHeader.js';
//import Footer from '../components/Partials/Footer/Footer.js';

// import HomePage from '../components/HomePage/HomePage.js';
import CommingSoon from '../components/HomePage/commingsoon.js';
import DetectMobile from '../components/HomePage/DetectMobile.js';
import Header from '../components/common/header/header.js';
import HeaderAftrLogin from '../components/common/HeaderAftrLogin/HeaderAftrLogin.js';
import Footer from '../components/common/footer/footer.js';
//import Aboutus from '../components/Aboutus/Aboutus.js';
//import Contactus from '../components/Contactus/Contactus.js';
import AddFriendSearch from '../components/AddFriendSearch/AddFriendSearch.js';
import TrackingByMe from '../components/TrackingByMe/TrackingByMe.js';
import TrackingMe from '../components/TrackingMe/TrackingMe.js';
import Notification from '../components/Notification/Notification.js';
import FriendRequestReceived from '../components/FriendRequestReceived/FriendRequestReceived.js';
import FriendRequestSent from '../components/FriendRequestSent/FriendRequestSent.js';
import Dashboard from '../components/Dashboard/Dashboard.js';
import MyAccount from '../components/MyAccount/MyAccount.js';
import Friends from '../components/Friends/Friends.js';
import Tracks from '../components/Tracks/Tracks';
import message from '../components/message/message.js';
import sendAlert from '../components/sendAlert/sendAlert.js';
import SendAlertTo from '../components/SendAlertTo/SendAlertTo.js';
import RequestTracking from '../components/RequestTracking/RequestTracking.js';
import RequestTracker from '../components/RequestTracker/RequestTracker.js';
import MessageModal from '../components/MessageModal/MessageModal.js';
/**logged in user Components */

/**common */
import {ToastContainer} from "react-toastify";
import ForgotPass from '../components/forgotPass/forgotPass';
import ChangePassword from '../components/ChangePass/ChangePass';
import NotFound from '../components/NotFound/404';
import MyProfile from '../components/MyProfile/MyProfile';
import Tracking from "../components/Tracking/Tracking";
import ConfirmationPopUp from "../components/common/modal";
import OtherUserDetail from "../components/otherUserDetail/otherUserDetail";
import ParticularMap from "../components/ParticularMap/ParticularMap";
/**CSS */
import 'react-toastify/dist/ReactToastify.css';

import "../assets/css/pagination.css";


import { HomePage , PrivacyPolicy, TermsCond , Aboutus , Contactus} from './chunks';

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false
        }
        this.chk = this.chk.bind(this);
    }

    chk() {
        this.setState({ flag: !this.state.flag })
    }

    componentDidMount(){
        //const socket = openSocket(window._env.uri.socket,{ transports: ['websocket'], upgrade: false });
    }
  /**remove after */
    render() {
        const { isUserLoggedIn} = this.props;
        /* console.log("---",this.props) */
        return (
            <ConnectedRouter history={this.props.history}>      
                <div>
                  
                    {/* dont render  component if user is looged in  */}
                    {isUserLoggedIn ?<HeaderAftrLogin/>:<Header history={this.props.history}/> }  



                    {/* render components only if user is logged in  */}

                    {/*isUserLoggedIn && <DashboardHeader  func={this.chk}/> */ }
                    {/*isUserLoggedIn && <SideBar flag={this.state.flag} func={this.chk}/>*/ }   

                    <div className={isUserLoggedIn ?"dashboard-right-section":null}>
                        <div className={isUserLoggedIn ? "dashboard-box" : null}>
                            <Switch>
                                <Route exact path="/" component={HomePage} />
                                {/* <Route exact path="/" component={CommingSoon} /> */}
                                {/* mobile app routing */}
                                <Route exact path="/detect-device" component={DetectMobile} />
                                {/* withoutlogin routes */}
                                <Route exact path="/about-us" component={Aboutus} />
                                <Route exact path="/contact-us" component={Contactus} />
                                <PrivateRoute exact path="/AddFriendSearch" component={AddFriendSearch} />
                                <PrivateRoute exact path="/TrackingByMe" component={TrackingByMe} />
                                <PrivateRoute exact path="/TrackingMe" component={TrackingMe} />
                                <PrivateRoute exact path="/notification-view" component={Notification} />
                                <PrivateRoute exact path="/FriendRequestReceived" component={FriendRequestReceived} />
                                <PrivateRoute exact path="/FriendRequestSent" component={FriendRequestSent} />
                                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                                <PrivateRoute exact path="/MyAccount" component={MyAccount} />
                                <PrivateRoute exact path="/change-password" component={ChangePassword} />
                                <PrivateRoute exact path="/MyProfile" component={MyProfile}/>
                                <PrivateRoute exact path="/user-detail/:id" component={OtherUserDetail}/>
                                <PrivateRoute exact path="/user-location/:id" component={ParticularMap}/>
                               {/*  <WithoutLogin exact path="/Dashboard" component={Dashboard} />
                                <WithoutLogin exact path="/MyAccount" component={MyAccount} /> */}
                                <PrivateRoute exact path="/Friends" component={Friends} />
                                <PrivateRoute exact path="/Tracks" component={Tracks} />
                                <PrivateRoute exact path="/tracking-users" component={RequestTracking}/>
                                <PrivateRoute exact path="/message" component={message} />
                                <PrivateRoute exact path="/send-alert" component={sendAlert} />
                                {/* <PrivateRoute exact path="/send-alert-to" component={SendAlertTo} /> */}
                                {/* <PrivateRoute exact path="/RequestTracking" component={Tracking} /> */}
                                <PrivateRoute exact path="/trackers" component={RequestTracker} />
                                {/* <PrivateRoute exact path="/RequestTracking" component={RequestTracking} /> */}
                                <WithoutLogin exact path="/MessageModal" component={MessageModal} />
                                <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                                <Route exact path='/termscondition' component={TermsCond}/>

                                {/* <PrivateRoute exact path="/RequestTracker" component={RequestTracker} /> */}

                                {/* <WithoutLogin exact path="/plans" component={Plans} /> */}

                                <WithoutLogin exact path="/user-reset-password/:token" component={HomePage} />
                                <WithoutLogin exact path="/common/header" component={Header} />
                                <Route path="*" component={NotFound} />
                                {/*test route*/}
                                {/*logged in users*/}
                                {/*<PrivateRoute exact path="/profile" component={Profile} />
                                <PrivateRoute exact path="/pro.file/edit" component={ProfileEdit} />
                                <PrivateRoute exact path="/user-list" component={UserList} />*/}
                            </Switch>
                        </div>
                    </div>
                    {!isUserLoggedIn && <Footer history={this.props.history}/>}
                    
                    {/* dont render  component if user is looged in  */}
                    {!isUserLoggedIn && <ForgotPass/>}
                    {isUserLoggedIn && <ConfirmationPopUp/>}
                   {/* {isUserLoggedIn && <ChatFormModule/>} */}
                    {/*!isUserLoggedIn && <Footer />*/}
                    {/*!isUserLoggedIn &&<LoginPopup />*/}
                    {/*!isUserLoggedIn &&<ForgotPopup />*/}  
                    {/*!isUserLoggedIn && <SignUp />*/}     
                  <ToastContainer
                        position="top-right"
                        type="error"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                    />              
                </div>
            </ConnectedRouter>
        );
    }
}

const mapStatesToProps = (state) => {
    return ({     
        isUserLoggedIn: (state.user && state.user.token) ? true : false    
    });
}

export default connect(mapStatesToProps)(AppRouter);
