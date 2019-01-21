import React, { Component } from "react";
import { connect } from "react-redux";
import { Breadcrumb, BreadcrumbItem} from "reactstrap";
import { Button, Form, FormGroup, Label, Input, FormText,  Collapse, CardBody, Card, Fade } from "reactstrap";

import { toast } from "react-toastify";
import GoogleMap from "../common/GoogleMap";
import VisibilityPopup from "../common/VisibilityPopup/VisibilityPopup";
/**services */
import HTTP from "../../services/http";
import session from "../../services/session";
import * as ApiUrl from "../../utils/endpoints";
/**endpoints */
import { getTestsHomePage, getPagesContent } from "../../utils/endpoints";
/**actions */
/**CSS */
import "./Dashboard.css";
import ViewIcon from "../../assets/images/view-icon.png";
import RadiusIcon from "../../assets/images/radius-icon.png";
import SearchIcon from "../../assets/images/srch-icon.png";
import gpsLocat from "../../assets/images/gps-location.png";
import Socket from "../../socket";
import { POPUP } from "../common/actions";
import { push } from "react-router-redux";
import axios from 'axios';
import ListGroupCollapse from "./test";



const mapStateToProps = state => {
  return {
    trackingUser: state.trackingUser,
    user: state.user.user,
    currentLocation: state.location
  };
};

class Dashboard extends Component {
  didMount=false;
  constructor(props) {
    super(props);
    
    this.toggle2 = this.toggle2.bind(this);
    this.state = { collapse: false };

    /** defining state for component */
    this.state = {
      isLoading: false,
      isLoadingTests: false,
      open:false,
      selectedItem: null,
      markers: [],
      currentPlace: '',
      clubDetails:{},
      onlineUser:[],
      markerShowing: false,
      list:[],
      mapRef:'',
      currentLoc:{
        lat:'',
        lng:''
      },
      currentIndex:null

    };

 
    this.VisibilityPop = this.VisibilityPop.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.filterUser=this.filterUser.bind(this);
    this.sendMessage=this.sendMessage.bind(this);
    this.setMapToCentre=this.setMapToCentre.bind(this);
    this.mapInstanse= this.mapInstanse.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.listItemClicked = this.listItemClicked.bind(this);
    this.currentPopUpIndex = this.currentPopUpIndex.bind(this);
  }
  
  getMarkerRef = (ref) => {
    if (ref !== null) {
      this.setState(prevState => ({
        markers: [...prevState.markers, ref]
      }));
    }
  }

  mapInstanse(mapIn){
    this.setState({mapRef:mapIn})
  }

  setMapToCentre(){
    const {currentLoc,mapRef} = this.state;
    if(currentLoc.lat && currentLoc.lng && mapRef){
      mapRef.setCenter({lat: currentLoc.lat, lng: currentLoc.lng})
    }
   
  }

  onMarkerClick = (props, marker) => {
    const animatingMarkers = this.state.markers;
    animatingMarkers.forEach(m => {
      if (m.marker.name === marker.name) {
        m.marker.setAnimation(1);
      } else {
        m.marker.setAnimation(null);
      }
  })

  const {list}=this.state;
    if(list&& Array.isArray(list)){
      let selectedMarker = list.find(m => {
        return m._id === props.id;
      });
      this.setState({
        clubDetails: selectedMarker,
        currentPlace: props,
        currentMarker: marker,
        markerShowing: true,
        mapCenter: props.position,
        markers: animatingMarkers
      });
    }
   
  }


  onMapClicked(props) {
    if (this.state.markerShowing) {
      this.setState({
        markerShowing: false,
        currentMarker: null
      });
    }
  }

  filterUser(event){
    let query=event.target.value;
    this.setState({searchQuery:query})
   
  }

   listItemClicked = (clubName) => {
    const clickedMarker = this.state.markers.filter(marker => marker.props.id === clubName);
    this.onMarkerClick(clickedMarker[0].props, clickedMarker[0].marker);
  }

   clearData = () => {
    const animatingMarkers = this.state.markers;
    animatingMarkers.forEach(m => m.marker.setAnimation(null))
    this.setState({
      clubDetails: {},
      markerShowing: false,
      currentMarker: null,
      markers: animatingMarkers
    });
}

  componentDidMount() {
    this.didMount = true;
    this.handleLocationChange();
    this.getUsers();
    this.getCurrentLocation();
    this.updateUserLocation();
    Socket.callEvent("get.online.friends",{userId:this.props.user._id});
    Socket.OnlineFrndStatus("get.online.friends",{userId:this.props.user._id}).then(response=>{
      console.log('response---- ',response)
      this.updateUser(response);
    });
   
  }
  updateUser(response){
    let {friends:{online}}=response;
    console.log('state--- ',this.state)
    console.log('friends--- ',online)
    const {list} = this.state;
    console.log('list--- ',list)
    this.setState({onlineUser:online},()=>{
      var v = list.map((val)=>{
        online.filter((val2)=>{if(val2==val._id) val.isOnline=true});
        return val;
      })
      this.setState({list:v})
     
    })
  }
  getCurrentLocation(){
    let url="https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAVf8ozEwneDeVCcM8z_byfxwPvdtHWDCY";
    axios.post(url, { })
      .then(res => {
        if(res && res.location){
          const { lng,lat} = res.location ;
          this.setState({currentLoc: res.location})
        }
      })
  }
 

  componentWillUnmount() {
    this.didMount = false;
  }

  updateUserLocation(){
    const { list } = this.state;
    Socket.getUpdatedLocation("send.alert", {}).then(response => {
            const {list} = this.state;
            let newArray=list.map((val,i)=>{
              if(val._id == response.userId){
                val.cordinate=[{"lat": response.lat,"lon": response.lon }];
                val.speedTime=response.speedTime;
                val.speed=response.speed;
              }
                return val;
            })

            this.setState({list:newArray})
    })
   
  }
  currentPopUpIndex(currentIndex=null){        
    this.setState(state=>{
      if(state.currentIndex === currentIndex)
      return ({currentIndex:null })
      else return ({currentIndex})
    })
  }
 
  // componentWillReceiveProps(nextProps){
  
  //   if(Array.isArray(nextProps.trackingUser.users) && !Array.isArray(this.props.trackingUser.users)){
  //     console.log("insie if condition",nextProps.trackingUser.users)
  //     this.setState({list:nextProps.trackingUser.users})
  //   }
  // }

  sendMessage(params = {}) {
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

  toggle2() {
    this.setState({ collapse: !this.state.collapse });
  }
  render() {
    const { content, list, visibilityshow,searchQuery,markerClicked,clubDetails,markerShowing,currentPlace,currentMarker } = this.state;
    const { match, trackingUser } = this.props;
    let filterData=searchQuery ? list.filter(e=> e.name.toLowerCase().match(searchQuery) ): list;
  
    return (
      <div className="App">
        <div className="findFrdBg dashboardVisiblity maptopstrip">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <div className="row">
                  <div className="col-md-12 clearfix">
                    <div className="col-md-6 col-xs-6 locationtrack">
                      {/* <button onClick={this.VisibilityPop}>
                        <img src={ViewIcon} />
                      </button> */}
                    </div>
                    <div className="col-md-6 col-xs-6 locationtrack2">
                      {/* <a href="">
                        <img src={RadiusIcon} />
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="NewCssMapBg">
          <button className="gpsLocat" onClick={()=>{this.setMapToCentre()}}><img src={gpsLocat} alt="" /></button>
        <div className="maptoggle">         
            <Collapse isOpen={this.state.open}>
              <Card>
                <CardBody className="mapleftBx">
                  <div className="mapsrchBx">
                    <div className="mapsrchInn">
                      <input name="firstname" type="text" autoComplete="off" onChange={this.filterUser} placeholder="Search" />
                      <Button className="srchBtn"><img src={SearchIcon} alt="" /></Button>
                    </div>
                  </div>
                  <ul >
                  {filterData && filterData.length>0 &&
                    filterData.map((list,index)=><ListGroupCollapse key={index}  index={index} list={list} listItemClicked={this.listItemClicked} sendMessage={this.sendMessage} currentIndexFunc={this.currentPopUpIndex} currentIndex={this.state.currentIndex} />)}
                    
                  {/* {filterData && filterData.length>0&&
                    filterData.map((list)=>
                    <li key={list._id}
                    >
                     
                     <i><img src={list.profilePicture}/>
                      {list.isOnline && <small></small>}
                     </i>
                     <span  onClick={this.listItemClicked.bind(this, list._id)}>{list.name}</span>
                     <Button className="addtrackLink" onClick={this.toggle2}>
                      <span></span>
                      <span></span>
                      <span></span>
                     </Button>
                     <Collapse isOpen={this.state.collapse}>
                     <div className="mapmsgList" isOpen={this.state.collapse}>
                      <span><Button className="frdMsgBtn" onClick={()=>this.sendMessage({userId:list._id})}>Message</Button></span>
                      <span><Button className="frdMsgBtn">Track</Button></span>
                     </div>
                     </Collapse>
                    
                     </li>)
                  } */}
                  </ul>
                </CardBody>
              </Card>
            </Collapse>
            <Button className="maplistBtn" color="primary"  onClick={this.toggle} style={{ marginBottom: '1rem' }}>&nbsp;</Button>
          </div>
          {list&&<GoogleMap
            zoom={14}
            mapInstanse={this.mapInstanse}
            markerRef={this.getMarkerRef}
            selectedItem={this.state.selectedItem}
            users={filterData}
            currentPlace={currentPlace}
            clubDetails={clubDetails}
            currentMarker={currentMarker}
            onMapClicked={this.onMapClicked}
            markerShowing={markerShowing}
            markerInfo={this.onMarkerClick}
            center={{ lat: 28.535517, lng: 77.391029 }}
            currentLocation={this.handleCurrentLocation}
          />}
        </div>

        {visibilityshow && (
          <VisibilityPopup show={visibilityshow} toggle={this.VisibilityPop} />
        )}
      </div>
    );
  }

  getUsers(params = {}) {
    this.props.dispatch({
      type: "TRACKING_USERS_REQUEST",
      data: params,
      success : (response) => {
        if(response.type=='success'){
          this.setState({
            list:response.data
          })
        }
      },
      error : (e) => {
        console.log("e-->",e)
      }
    });
  }

 toggle(){
  this.setState({ open: !this.state.open })
 }

  handleLocationChange() {
    let { list } = this.state
    Socket.TrackLiveLocation("send.alert", {}).then(response => {
      if (response && Array.isArray(list)) {
        const updatedUser = list.map(val => {
          if (val._id == response.userId && val.cordinate.length) {
            val.cordinate[0]["lat"] = parseFloat(response.lat);
            val.cordinate[0]["lon"] = parseFloat(response.lon);
          }
        });
       
        this.props.dispatch({
          type: "TRACKING_USERS_UPDATE_LOCATION",
          data: updatedUser
        });
      }
    });
  }

  VisibilityPop() {
    if(this.didMount){
      this.setState({
        visibilityshow: !this.state.visibilityshow
      });
    }
  }

  handleCurrentLocation(location) {
    const { currentLocation,dispatch } = this.props;
    dispatch({
      type: "LIVE_USER_LOCATION",
      data: location
    });
  }
}

/*
 */
/* const mapDispatchToProps=dispatch=>({
  trackingUsers: () => { dispatch(getTRACKED())}
}); */

export default connect(mapStateToProps)(Dashboard);