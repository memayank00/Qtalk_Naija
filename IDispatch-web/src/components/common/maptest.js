/* global _ */
import React from "react";
import axios from 'axios';
import loc_icon from "../../assets/images/for-sale-marker-icon.png";
//import {Modal,Button} from 'react-bootstrap';

import { Button, Form, FormGroup, Label, Input, FormText,  Collapse, CardBody, Card } from "reactstrap";
import "./map.css";
import DefaultImage from "../../assets/images/img_avatar_default.png";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import HTTP from "../../services/http";
const style = {
  width: "100%",
  height: "100%",
  
};

const icon = { url: loc_icon };

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      open: false,
      markerObjects: [],
      bounds: new this.props.google.maps.LatLngBounds()
    };

    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.handleMapMount = this.handleMapMount.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onMarkerMounted = element => {
      this.setState(prevState => ({
        markerObjects: [...prevState.markerObjects, element.marker]
      }))
    };
    
  }


  onMarkerClick(props, marker, e) {
    console.log("mqarker clicked-->",{props,marker,e})
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  toggle(){
    this.setState({ open: !this.state.open })
   }

   handleInfowindow(e,selectedItem){
     const {markerObjects}=this.state;
    let selectedMarker = markerObjects.find(m => {
        return m.id === selectedItem._id;
      });
      console.log(selectedMarker.getPosition())
      if(selectedMarker){
          this.setState({
            selectedPlace:selectedMarker,
            activeMarker:selectedMarker,
            showingInfoWindow: true
          })
      }
      console.log({selectedItem,selectedMarker})

    

     console.log("this.props-->",this.props)
     console.log("this.state----->",this.state)
    console.log("inside selected--->",{e,selectedItem})
   }


  onMapClicked(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.compteur);

    this.compteur = false;
  }
  
  componentDidMount() {
    // console.log(document.querySelector('.gmnoprint'))
    const { users, google } = this.props;
    let bounds = new google.maps.LatLngBounds();
    this.compteur = setInterval(
      function() {
        this.getGeolocationPos();
      }.bind(this),
      //5000
     300000
    );

  

    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (users[i] && users[i].cordinate.length) {
          let latitude = users[i].cordinate[0]["lat"];
          let longitude = users[i].cordinate[0]["lon"];
          bounds.extend(new google.maps.LatLng(latitude, longitude));
        }
      }
    }
    this.setState({
      bounds,
      center: {
        lat: bounds.getCenter().lat(),
        lng: bounds.getCenter().lng()
      }
    });
    if(!users.length>0){
      this.setState({
        bounds,
        center: {
          lat: 28.535517,
          lng: 77.391029
        }
      });
      
    }
  }

  addressObj(value) {
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };
    let obj = {};
    for (var i = 0; i < value.address_components.length; i++) {
      var addressType = value.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = value.address_components[i][componentForm[addressType]];
        obj[addressType] = val;
      }
    }
    if (value.geometry) {
      let latObj = value.geometry.location;
      obj['lat'] = latObj.lat;
      obj['lng'] = latObj.lng;
      obj['formatted_address'] = value.formatted_address;
    }
    return obj;
  }

  getGeolocationPos = () => {
    const {currentLocation,google}=this.props;
    let url="https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAVf8ozEwneDeVCcM8z_byfxwPvdtHWDCY";
    axios.post(url, { })
      .then(res => {
        if(res.location && res.location.lat){
          let placeUrl=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.location.lat},${res.location.lng}&key=AIzaSyA8aQ_1ntOgoUEndDMbc6gZeUdSGU_QBdw`;
          axios.get(placeUrl)
          .then((response)=>{
            if (response['status'] == 'OK'){
              let formattedAdrs=this.addressObj(response['results'][0]);
              currentLocation(formattedAdrs)
            }
          })
        }
      }) 
  };

  handleMapMount(mapProps, map) {
    this.map = map;
    setTimeout(() => {
      console.log(this.map.getBounds());
    }, 200);
  }

  preparePin = (elem, index) => {
    const {google}=this.props;
    
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    if (elem.cordinate.length) {
      return (
        <Marker
          key={index}
          onClick={this.onMarkerClick}
          // icon={icon}
          ref={this.onMarkerMounted}
          icon={{
            url: elem.profilePicture?elem.profilePicture:DefaultImage,
            anchor: new google.maps.Point(32,32),
            scaledSize: new google.maps.Size(64,64),
            origin: new google.maps.Point(0, 0),
          }}
          location={elem.location}
          id={elem._id}
          profilePicture={elem.profilePicture}
          name={elem.name}
          fullno={elem.fullno}
          position={{
            lat: Number(elem.cordinate[0]["lat"]),
            lng: Number(elem.cordinate[0]["lon"])
          }}
        />
      );
    } else {
      return (
        <Marker
          key={index}
          // icon={icon}

          ref={this.onMarkerMounted}
          icon={{
            url: elem.profilePicture?elem.profilePicture:DefaultImage,
            anchor: new google.maps.Point(32,32),
            scaledSize: new google.maps.Size(64,64),
            shape:{type:'circle'},
            optimized:false
          }}
          location={elem.location}
          profilePicture={elem.profilePicture}
          name={elem.name}
          id={elem._id}
          fullno={elem.fullno}
          onClick={this.onMarkerClick}
        />
      );
    }
  };

  render() {
    const { users, google,currentLocation,markerClicked} = this.props;
    const { selectedPlace, center, bounds } = this.state;

    return (
<div>
      <div className="maptoggle">          
            <Collapse isOpen={this.state.open}>
              <Card>
                <CardBody className="mapleftBx">
                  <ul>
                  {users &&users.length>0&&
                    users.map((list)=>
                    <li key={list._id}
                    onClick={e => this.handleInfowindow(e, list)}
                    >
                     {list.name}</li>)
                  }
                  </ul>
                </CardBody>
              </Card>
            </Collapse>
            <Button className="maplistBtn" color="primary"  onClick={this.toggle} style={{ marginBottom: '1rem' }}>&nbsp;</Button>
          </div>
      <Map
        style={style}
        google={google}
        zoom={14}
        streetViewControl={false}
        initialCenter={center}
        disableDefaultUI={false}
        // bounds={bounds}
        center={center}
        onClick={this.onMapClicked}
      >
        {users.map((elem, index) => this.preparePin(elem, index))}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div style={{ width: "50%", height: "10%" }} className="map-pro-box">
            <img src={selectedPlace ? selectedPlace.profilePicture : ""} />
            <div className="map-prop-detail">
              <h3>{selectedPlace ? selectedPlace.name : ""}</h3>
              <p>{selectedPlace ? selectedPlace.fullno : ""}</p>
            </div>
            <div className="map-prop-price">
              {selectedPlace ? selectedPlace.location : ""}
            </div>
          </div>
        </InfoWindow>
        


        {/* <Marker
          position={{ lat: _.toNumber(site.lat), lng: _.toNumber(site.lng) }}
          icon={icon} onClick={this.onMarkerClick} />
       
         */}
      </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyA8aQ_1ntOgoUEndDMbc6gZeUdSGU_QBdw"
})(MapContainer);
