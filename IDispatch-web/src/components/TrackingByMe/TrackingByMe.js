import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
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
import './TrackingByMe.css';
import FrndListIcon from "../../assets/images/frd-list-img.png";
import TrackNotIcon from "../../assets/images/tracking-note-icon.png";
import RemoveIcon from "../../assets/images/remove-icon.png";
//import ErrorBoundry from "../common/errorBoundry";


class TrackingByMe extends Component {
  constructor(props){
    super(props);
    /** defining state for component */
    this.state = {
      isLoading:false,
      isLoadingTests:false,
    };

    /**event binding  */
   // this.pageContent = this.pageContent.bind(this);
    //this.testsList = this.testsList.bind(this);
  }

  render() {
    const {content,tests} =this.state;
    const {match} = this.props;
    return (
      <div className="App">
       <div class="findFrdBg">
         <div class="container">
           <div class="row">
             <div class="col-md-6 col-xs-12 findfrdHd">
               Tracking List
             </div>
             <div class="col-md-6 col-xs-12 trackingBy">
                <a href="#"><span>20</span> Tracking Me</a> | <a href="#"><span>13</span> Tracked by Me</a>
             </div>
             
           </div>
         </div>
       </div>
       <div class="dashBg">
         <div class="container">
           <div class="row">
             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src={FrndListIcon} alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       <a href="#"><img src={TrackNotIcon} alt=""/> Tiles delivery in toronto</a>
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src={RemoveIcon} alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-req-img1.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src={RemoveIcon} alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-req-img2.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-list-img.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       <a href="#"><img src="/assets/images/tracking-note-icon.png" alt=""/> Tiles delivery in toronto</a>
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-req-img1.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-req-img2.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-list-img.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       <a href="#"><img src="/assets/images/tracking-note-icon.png" alt=""/> Tiles delivery in toronto</a>
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-req-img1.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-req-img2.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>

             <div class="col-md-6">
              <div class=" addFrdInn">
                  <div class="row">
                    <div class="col-3 frdListImg"><img src="/assets/images/frd-list-img.png" alt="" /></div>
                    <div class="col-5 frdListName">
                       <strong>Andrew Berymore</strong>
                       <small>West Coast, Virginia</small>
                       
                    </div>
                    <div class="col-4 frdListBtn">
                      <a href="" class="remove_Btn"><img src="/assets/images/remove-icon.png" alt=""/> Cancel</a>
                    </div>
                  </div>
                </div> 
             </div>
           </div>
         </div>
       </div>
      </div>
    );
  }

}
export default connect()(TrackingByMe);
