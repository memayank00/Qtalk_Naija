import React, { Component } from "react";
import { connect } from "react-redux";
import { SubmissionError } from "redux-form";
import "./map.css";
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText,  Collapse, CardBody, Card } from "reactstrap";
import mapIconImg from "../../assets/images/for-sale-marker-icon.png";
import scriptLoader from 'react-async-script-loader';
import DefaultImage from "../../assets/images/img_avatar_default.png";
const mapStyle = {
  width: "100%",
  height: "100%",
};
const RenderInfoWindow = props => {
  const selectedPlace={}
  return(
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
  )
}

class MapDisplay extends Component {
  constructor(props, context) {
    super(props, context);
    this.markers = [];
    this.infoWindow = null;    
    this.state = {
      isLoading: false,
      open: false,
      selectedItem:null
    };
    this.toggle = this.toggle.bind(this);
  }

  
  componentWillReceiveProps({isScriptLoadSucceed}){
    if (isScriptLoadSucceed) {
      const google=window.google;
      let options = {
        zoom: this.props.zoom,
        center: this.props.center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      let map = new google.maps.Map(document.getElementById("map"), options);
        this.infoWindow = new google.maps.InfoWindow({});
        let bounds = new google.maps.LatLngBounds();
        this.props.users.forEach(item => {
          if(Array.isArray(item.cordinate)&& item.cordinate.length>0){
            let position = new google.maps.LatLng(
              item["cordinate"][0]["lat"],
              item["cordinate"][0]["lon"]
            );
           const marker = new window.google.maps.Marker({
              position: position,
              map: map,
              icon:{
                url: item.profilePicture?item.profilePicture:DefaultImage,
                anchor: new google.maps.Point(32,32),
                scaledSize: new google.maps.Size(64,64),
                shape:{type:'circle'},
                optimized:false
              },
              animation: google.maps.Animation.DROP,
              item:item
              /*  title: this.state.markers[i][0] */
            });
         
          marker.addListener("click", () => {
            console.log("inside if",this.infoWindow)
            // if(this.infowindow){
            //   this.infowindow.close();
            // }
              this.showInfoWindow(marker);
          });
          bounds.extend(marker.getPosition());
          this.markers.push(marker);
          }
         

        })
        map.fitBounds(bounds);
        this.compteur = setInterval(
          function() {
            this.getGeolocationPos();
          }.bind(this),
          //5000
         300000
        );
    }else{
      alert('not loaded')
    }
  }

  handleInfowindow(e,selectedItem){
    e.preventDefault();
    let selectedMarker = this.markers.find(m => {
      return m.item._id === selectedItem._id;
      });
      
      if(selectedMarker){
        this.setState({selectedItem:selectedMarker},
          this.showInfoWindow(selectedMarker)
        )
       

      }else{
        this.infoWindow.close();
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
    const {currentLocation}=this.props;
    const google=window.google;
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

  toggle(){
    this.setState({ open: !this.state.open })
   }


  showInfoWindow(marker) {
    let html = `<div
     className="map-pro-box">
     <div class="row">
        <div class="col-sm-3">
          <img style="width: 80px;" src=${marker.item ? marker.item.profilePicture : ""} />
        </div>
        <div class="col-sm-9">
          <div className="map-prop-detail">
            <h3>${marker.item ? marker.item.name : ""}</h3>
            <p>${marker.item ? marker.item.fullno : ""}</p>
          </div>
          <div className="map-prop-price">
            ${marker.item ? marker.item.location : ""}
          </div>
        </div>
     </div>
</div>`;
console.log("inside-->",marker);
console.log(this.infoWindow)
    this.infoWindow.setContent(html);
    this.infoWindow.open(marker.map, marker);
  }

  componentWillUnmount() {
    clearInterval(this.compteur);

    this.compteur = false;
  }
 

  render() {
    const {users}=this.props;
    
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
                    onClick={(e) => this.handleInfowindow(e, list)}
                    >
                     {list.name}</li>)
                  }
                  </ul>
                </CardBody>
              </Card>
            </Collapse>
            <Button className="maplistBtn" color="primary"  onClick={this.toggle} style={{ marginBottom: '1rem' }}>&nbsp;</Button>
          </div>
            <div id="map" style={{height: "600px"}}></div>
        </div>
    );
    // return <div ref="map" style={mapStyle} />;
  }
}

export default scriptLoader([
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyDgn-FeKaGAs0-QF_AuITL6TubYxaAGZDA"
])(MapDisplay);
