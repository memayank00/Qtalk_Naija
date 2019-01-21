import React, { Component } from 'react';
import { connect } from 'react-redux';
import {toast} from "react-toastify";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
/**Components */
import FacebookIconwht from "../../../assets/images/facebook-wht.png";
import FacebookPng from "../../../assets/images/facebook.png";
import TwitterIconwht from "../../../assets/images/twitter-wht.png";
import TwitterIcon from "../../../assets/images/twitter.png";
import GooglePlusewht from "../../../assets/images/google_pluse-wht.png";
import GooglePlus from "../../../assets/images/google_pluse.png";
import Instagramwht from "../../../assets/images/instagram-wht.png";
import Instagram from "../../../assets/images/instagram.png";
import AppleIcon from "../../../assets/images/apple_btn.png";
import AnroidIcon from "../../../assets/images/android_btn.png";


/**services */
/*import HTTP from '../../services/http';
import session from '../../services/session';*/
import './footer.css';
/**CSS */
//import ErrorBoundry from "../common/errorBoundry";


class Footer extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
    };

    /**event binding  */
  }

  render() {
    const {content,tests} =this.state;
  console.log({location:this.props.history})
  const {match,history:{location}} = this.props;
    //if(location.pathname === "/") return (null);
    return (
      <div className="App">
        <footer>

          <section className="getappOuter">
            <div className="container">
              <div className="getappInn">
                  <h2>GET THE APP</h2>
                  <span>Download Tracking app Driver by clicking on any of the buttons, below.</span>
                  <i>
                    <a href="https://itunes.apple.com/us/app/tracking-app-live/id1444722171?ls=1&mt=8" target="_blank"><img src={AppleIcon}/></a>
                    <a href="https://play.google.com/store/apps/details?id=com.trackingapplivetrack" target="_blank"><img src={AnroidIcon}/></a>
                  </i>
              </div>
            </div>
          </section>

          <section className="contactBx">
            <div className="container">
              <div className="contactInn">
                  <h2>CONTACT US</h2>
                  <p>Your satisfaction is our top priority! For more information and for further enquired, 
contact Tracking app Team at the following details.</p>
                  <strong>We look forward to hearing from you</strong>
                  <span>Email: <a href="">info@trackingapp.com</a></span>
              </div>
            </div>
          </section>

          <div className="footerTopBx">
            <div className="container">
              <div className="newsletterInn">
                  Sign Up For Newsletter!
                  <span className="newslettFrm">
                    <FormGroup>
                      <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email address" />
                    </FormGroup>
                    <Button className="newsBtn" color="warning">Signup</Button>{' '}
                  </span>
              </div>
            </div>
          </div>
          <div className="footerBotBx">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-sm-12 footNav">
                    <Link to="">Home</Link>
                    <Link to={`/about-us`}>About Us</Link>        
                    {/* <a href="">What We Do ?</a>        
                    <a href="">Who We Are ?</a>        
                    <a href="">Help</a>  */}
                    <Link to={`/privacy-policy`}>Privacy Policy</Link>       
                           
                    <Link to="/termscondition">Terms and Conditions</Link>        
                    {/* <a href="">Sitemap</a>         */}
                    <Link to={`/contact-us`}>Contact</Link>
                </div>
                {/* <div className="col-md-3 col-sm-12 footsocial">
                  <a href=""><img src={FacebookIconwht} className="img"/><img src={FacebookPng} className="over"/></a>
                  <a href=""><img src={TwitterIconwht} className="img"/><img src={TwitterIcon} className="over"/></a>
                  <a href=""><img src={GooglePlusewht} className="img"/><img src={GooglePlus} className="over"/></a>
                  <a href=""><img src={Instagramwht} className="img"/><img src={Instagram} className="over"/></a>
                </div> */}
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }


}

export default connect()(Footer);
