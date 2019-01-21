import React, { Component } from 'react';
import { connect } from 'react-redux';
import {toast} from "react-toastify";

import HTTP from '../../services/http';
import session from '../../services/session';
/**endpoints */
import { getTestsHomePage, getPagesContent} from '../../utils/endpoints';
/**actions */
import { POPUP } from '../common/actions.js';
import ResestPassword from '../../components/resetPass/resetPass';
/**CSS */
import './HomePage.css';
//import ErrorBoundry from "../common/errorBoundry";
import AppleBtn from "../../assets/images/apple_btn.png";
import Anroidbtn from "../../assets/images/android_btn.png";
import BannerImg from "../../assets/images/banner_img.png";
import VideoImge from "../../assets/images/video-icon.png";
import Feauture1Icon from "../../assets/images/feature_icon1.png";
import Feauture2Icon from "../../assets/images/feature_icon2.png";
import Feauture3Icon from "../../assets/images/feature_icon3.png";
import Feauture4Icon from "../../assets/images/feature_icon4.png";
import Feauture5Icon from "../../assets/images/feature_icon5.png";
import Feauture6Icon from "../../assets/images/feature_icon6.png";
import Feauture7Icon from "../../assets/images/feature_icon7.png";
import FeautureImg from "../../assets/images/feature_img.png";
import HowItWorks from "../../assets/images/hiw_img.png";
import CreateAccount from "../../assets/images/create_account.png";
import LogoutImg from "../../assets/images/logout.png";
import TrackDriver from "../../assets/images/tracks_driver.png";
import InstallApp from "../../assets/images/install_app.png";
import SignUpImg from "../../assets/images/signin.png";
import CommunicateImg from "../../assets/images/communicate.png";


class HomePage extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
      isLoadingTests:false,
    };

    /**event binding  */
    this.pageContent = this.pageContent.bind(this);
    this.testsList = this.testsList.bind(this);
  }

  render() {
    const {match} = this.props;
    return (
      <div className="App">
          <div className="home-banner">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="bannerLeftCont">
                    <h1>user tracking just got easier</h1>
                    <p>At Tracking App, we take pride in helping transport companies maximize productivity with little additional effort! </p>
                    <span>
                      <a href="https://itunes.apple.com/us/app/tracking-app-live/id1444722171?ls=1&mt=8" target="_blank"><img src={AppleBtn} alt=" " /></a>
                      <a href="https://play.google.com/store/apps/details?id=com.trackingapplivetrack" target="_blank"><img src={Anroidbtn} alt=" " /></a>
                    </span>
                  </div>
                </div>
                <div className="col-md-6 bannerRightImg">
                    <img src={BannerImg} alt=""/>
               </div>
              </div>
            </div>
          </div>
          
          <section className="welcomeBx">
            <div className="container">
                <div className="WelcomeCont">
                  <h2>Welcome to TRACKING APP</h2>
                  <span>At Tracking app, we take pride in helping transport companies maximize productivity with little additional effort! Imagine spending less time worrying about your driver’s location or thinking if he would get to a particular place on time. What if you could focus more on growing your company while your 
drivers continue to deliver amazing results? </span>
                </div>
            </div>
          </section>
          

          <section className="VidSecBx">
            <div className="container">
                <div className="demovidBx">
                  <h3>Watch Demo Video</h3>
                  <p>With Tracking app Driver, achieving these things will become child’s play!</p>
                  <i><a href=""><img src={VideoImge}/></a></i>
                </div>
            </div>
          </section>
          
          <section className="featuresOuter">
            <div className="container">
              <div className="thefeatHd">
                <h1>OUR FEATURES</h1>
                <span>Awesome Features of Tracking App</span>
              </div>
              <div className="row">
                <div className="col-md-4 feat_left featlist">
                  <ul>
                    <li>
                        <i><img src={Feauture1Icon}/></i>
                        <strong>Real-time Driver Tracking</strong>
                        <span>Reveals driver’s location, speed limit and provides accurate information on trips.</span>
                    </li>
                    <li>
                        <i><img src={Feauture2Icon}/></i>
                        <strong>Effective Communication with Drivers</strong>
                        <span>Important information on trip numbers and trucks can be obtained with ease.</span>
                    </li>
                    <li>
                        <i><img src={Feauture3Icon}/></i>
                        <strong>Reports on Drivers’ Activities and Movement</strong>
                        <span>A driver’s activities in the last 24 hours can be retrieved from the app.</span>
                    </li>
                    <li>
                        <i><img src={Feauture4Icon}/></i>
                        <strong>Effective Communication with Drivers</strong>
                        <span>Tracking app Driver allows transport companies to send and receive messages from drivers. Custom alerts can also be sent in case of emergency.</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-4 feat_mid featlist">
                  <ul>
                    <li>
                        <i><img src={Feauture5Icon}/></i>
                        <strong>Company to Company Tracking</strong>
                        <span>With permission, a company can track the drivers working with another company.</span>
                    </li>
                    <li>
                        <i><img src={Feauture6Icon}/></i>
                        <strong>Sending of Address from a Company to its Driver</strong>
                        <span>The “send address” feature allows a company to forward an address through the app. Once the driver acknowledges the receipt of message, the navigation to that particular address will be activated.</span>
                    </li>
                    <li>
                        <i><img src={Feauture7Icon}/></i>
                        <strong>Alarm Feature to Keep Track of Drivers</strong>
                        <span>If a driver does not cover a specified distance within a period of time, the alarm feature immediately notifies the company of the situation on ground.</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-4 feat_right">
                  <img src={FeautureImg}/>
                </div>
              </div>
            </div>
          </section>
          
          <section className="howitBx">
            <div className="container">
              <div className="howitTopBx">
                <h1>HOW IT WORKS</h1>
                <span>We help grow strong markets</span>
                <i><img src={HowItWorks}/></i>
              </div>

              <div className="row howitList">
                <div className="col-md-4 col-sm-6 howlistInn">
                  <i><img src={CreateAccount}/></i>
                  <strong>Create Account</strong>
                  <span>Click on the top right of the website to create a new FREE account</span>
                </div>
                <div className="col-md-4 col-sm-6 howlistInn">
                  <i><img src={LogoutImg}/></i>
                  <strong>Login Account</strong>
                  <span>Log into the website and click on the “MANAGE DRIVERS” option to set up Tracking and create usernames and passwords for your drivers</span>
                </div>
                <div className="col-md-4 col-sm-6 howlistInn">
                  <i><img src={TrackDriver}/></i>
                  <strong>Track Drivers</strong>
                  <span>Other Companies may be given access to track your drivers or vice versa with full or limited permissions</span>
                </div>
                <div className="col-md-4 col-sm-6 howlistInn">
                  <i><img src={InstallApp}/></i>
                  <strong>Install App</strong>
                  <span>Have your drivers Install the app either from the Apple App Store or Google Play Store</span>
                </div>
                <div className="col-md-4 col-sm-6 howlistInn">
                  <i><img src={SignUpImg}/></i>
                  <strong>Sign IN</strong>
                  <span>Tell your drivers to sign into the app using the username and password that you have created for them</span>
                </div>
                <div className="col-md-4 col-sm-6 howlistInn">
                  <i><img src={CommunicateImg}/></i>
                  <strong>Communicate</strong>
                  <span>Communicate with your drivers and take full advantage of the app</span>
                </div>
              </div>
            </div>
          </section>
          {match.params && match.params.token && <ResestPassword resetQuery={match.params.token}/>}
      </div>
    );
  }

  /**this hook will run after component mounted in DOM */
  componentDidMount() {
    let data;
    let tests;
    /** get page content from server if not found in session storage */
    if (!session.get('homepage')) {
      //this.pageContent({ slug: "home-page", cache: "HomePage" });
    } else {
      /** get from session and serve to page */
      data = session.get("homepage");
      this.setState({ content: data });
    }

    /** get page content from server if not found in session storage */
    if (!session.get('testshomepage')) {
      /**to get list of Tests */
      //this.testsList({ cache: "HomePageTests" });
    } else {
      /** get from session and serve to page */
      tests = session.get("testshomepage");
      this.setState({ tests });
    }

    /**to open the reset-password  popup*/
    const { match,dispatch } = this.props; 
    if (match.params && match.params.token) {dispatch({type:POPUP,data:"reset-password"})}
    /**to show the notification of verified */
    const search = this.props.location.search; // could be '?page=1'
    const params = new URLSearchParams(search);
    if (params.get('verify')) toast("Your Account is verified",{type:"info"});
  }

  /**Called to determine whether the change in props and state should trigger a re-render. */
  shouldComponentUpdate(nextProps, nextState) {
    const { tests ,content} = nextState
    /**if there is change in state then re-render */
    if ( tests  && content) return true;
    /**otherwise no re-rendering */
    else return false;
  }


  /**to get the content of the page */
  pageContent(params = {}) {
    /**to start the lodaer   */
    this.setState({ isLoading: true });
    /**Http call to get data from server */
    HTTP.Request("get", getPagesContent, params)
      /**if request is succesfull */
      .then(result => {
        /** store data into session storage  */
        if (result.data && result.data) session.set("homepage", result.data);
        /**to set data in the state and stop loader*/
        this.setState({
          content: result.data ? result.data : undefined,
          isLoading: false
        })
      })
      /**if request is failed */
      .catch(err => this.setState({ content: undefined, isLoading: false }))
  }

  /**to get list of tests */
  testsList(params = {}) {
    /**to start the lodaer   */
    this.setState({ isLoadingTests: true });
    /**Http call to get data from server */
    HTTP.Request("get", getTestsHomePage, params)
      /**if request is succesfull */
      .then(result => {
        /** store data into session storage  */
        if (result.data) session.set("testshomepage", result.data);
        /**to set data in the state and stop loader*/
        this.setState({
          tests: result.data ? result.data :[],
          isLoading: false
        })
      })
      /**if request is failed */
      .catch(err => this.setState({ tests: [], isLoadingTests: false }))
  }
}

export default connect()(HomePage);
