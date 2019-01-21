/* global _ */
import React from 'react';
import loc_icon from "../../assets/images/loc_icon.png";

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
const style = {
  width: '100%',
  height: '100%'
};
//const cordinate={lat: 28.5776327,lng: 77.34828829999992};
const icon={url: loc_icon};

export class MapContainer extends React.Component {
 
   constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    }
    

    // binding this to event-handler functions
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
    //
    this.onMarkerClick();
  }
  componentWillReceiveProps() {
    //
    this.onMarkerClick();
  }

  render() {
    const {site, google} = this.props;
    return (
      <Map style={style} 
      initialCenter={{lat: _.toNumber(site.lat),
       lng: _.toNumber(site.lng)}} google={google}
        zoom={14} onClick={this.onMapClicked}>
 
        <Marker 
    position={{lat: _.toNumber(site.lat), lng: _.toNumber(site.lng)}} 
    icon={icon} onClick={this.onMarkerClick} />
          <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div >
                <ul >
                    <li>
                      <div className="contact_icon"><span className="glyphicon glyphicon-map-marker"></span></div>
                      <div className="contact_icontxt">{site.address}</div>
                    </li>
                    <li>
                      <div className="contact_icon"><span className="glyphicon glyphicon-earphone"></span></div>
                      <div className="contact_icontxt">{site.city}, {site.state} </div>
                    </li>
                </ul>   
              </div>
        </InfoWindow>
        
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyA8aQ_1ntOgoUEndDMbc6gZeUdSGU_QBdw'
})(MapContainer)
