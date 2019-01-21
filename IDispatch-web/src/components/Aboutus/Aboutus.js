import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import {toast} from "react-toastify";

/**Components */
//import HomeBanner from './Banner.js';
//import PerformanceCycle from './PerformanceCycle.js';
//import TypeTest from './TypeTest.js';
//import GetStarted from '../GetStarted/GetStarted.js';
//import ResestPassword from '../Popup/ResestPassword';
/**services */

import HTTP from '../../services/http';
import session from '../../services/session';

/**endpoints */
import { getTestsHomePage, getPagesContent} from '../../utils/endpoints';
/**actions */
//import { POPUP } from '../common/actions.js';
/**CSS */
import './Aboutus.css';
//import ErrorBoundry from "../common/errorBoundry";


class Aboutus extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
      isLoadingTests:false,
    };

  }

  componentDidMount(){
    window.scroll(0,0)
  }

  render() {
    const {content,tests} =this.state;
    const {match} = this.props;
    return (
      <div className="App">
       <div class="aboutBanner">
          <div class="container">
            <div class="aboutBanInn">
              <div class="aboutBanBx">about us</div>
              <div class="breatcrum_Outer">
                  <Breadcrumb tag="nav">
                    <BreadcrumbItem tag="a" href="#">Home</BreadcrumbItem>
                    <BreadcrumbItem tag="a" href="#">About us</BreadcrumbItem>
                  </Breadcrumb>
              </div>  
            </div>
          </div>
        </div>
        <section class="aboutsection">
            <div class="container">
              <ListGroup>
                <ListGroupItem>
                  <ListGroupItemHeading>Experience</ListGroupItemHeading>
                  <ListGroupItemText>
                  We are a 21st century company with over 20 years of experience in the trucking industry.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>Family</ListGroupItemHeading>
                  <ListGroupItemText>
                  We are a family of truck drivers with a long history driving trucks. We also have connections with numerous friends who have worked in the trucking industry.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>Friendly</ListGroupItemHeading>
                  <ListGroupItemText>
                  While we are tech savvy (we understand the Internet and have useful Apple/Android phone applications), our aim is to help make it easy for drivers, owner operators, brokers, carriers and shippers find loads.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>Location</ListGroupItemHeading>
                  <ListGroupItemText>
                  Based in California, we will be servicing trucks and loads across the United States and in California and in Mexico.
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>How to contact us</ListGroupItemHeading>
                  <ListGroupItemText>
                  You can reach us by: <a href="">infor@trackingapp.com</a>
                  </ListGroupItemText>
                </ListGroupItem>
              </ListGroup>             
            </div>
        </section>
      </div>
    );
  }
}
export default connect()(Aboutus);
