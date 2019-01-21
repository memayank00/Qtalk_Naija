/* global _ */
import React from 'react';
import DefaultImage from "../../assets/images/img_avatar_default.png";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
const style = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    }

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
  };

   onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };
 
  onMapClicked(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  componentDidMount() {
    this.onMarkerClick();
  }

  componentWillReceiveProps() {
    this.onMarkerClick();
  }
  componentWillUnmount(){
  }

  render() {
    //console.log(this.props.site)
    const {cordinate,user, google} = this.props;
    return (
      <Map style={style} 
      initialCenter={{lat: _.toNumber(cordinate.lat),
       lng: _.toNumber(cordinate.lon)}} google={google} zoom={14} 
       minZoom={2.5}
       onClick={this.onMapClicked}>
         <Marker 
            position={{lat: _.toNumber(cordinate.lat), lng: _.toNumber(cordinate.lon)}} 
            icon={{
                url: user.profilePicture?user.profilePicture:DefaultImage,
                anchor: new google.maps.Point(32,32),
                scaledSize: new google.maps.Size(64,64)
                }}
            onClick={this.onMarkerClick} 
        />
        <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
        >
          <div style={{ width: "50%", height: "10%" }} className="map-pro-box">
            <img  alt="" src={user.profilePicture ?user.profilePicture : DefaultImage}
             onError={(e)=>{e.target.src = DefaultImage}} />
            <div className="map-prop-detail">
              <h3>{ user.name? user.name : ""}</h3>
              <p>{user.fullno ? user.fullno : ""}</p>
            </div>
            <div className="map-prop-price">
              {user ? user.location : ""}
            </div>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyA8aQ_1ntOgoUEndDMbc6gZeUdSGU_QBdw'
})(MapContainer)
