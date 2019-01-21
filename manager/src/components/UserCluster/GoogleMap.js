import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarkerIcon from '../../assets/images/loc_icon.png';
import ClusterIcon from '../../assets/images/circle.png';

import MarkerClusterer from 'node-js-marker-clusterer';

class GoogleMap extends Component {
  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.google !== this.props.google || prevProps.locations !== this.props.locations) {
      //this.loadMap();
    }
    if(this.props.typeCheck != prevProps.typeCheck){
      this.loadMap();
      //console.log("this.props-->",this.props)
    }
  }
 

  loadMap() {
    console.log("ugewueurgewurwgurg")
    if (window["google"]) {
       
      const { google ,typeCheck } = this.props;
       
        const node = document.getElementById("mapsetup")
      const mapConfig = Object.assign({}, {
        center: { lat: 40.416775, lng: -3.703790 }, //Madrid,Spain
        //center: { lat: 28.535517, lng: 77.391029 },
        zoom: 2,
        mapTypeControl: true,
        streetViewControl: false,
        gestureHandling: 'cooperative',
      });

      this.map = new google.maps.Map(node, mapConfig);

      const infowindow = new google.maps.InfoWindow({
        content: 'this.props.labels.loading',
      });

      const markers = this.props.locations.map((location) => {
         console.log('location---- ',location.name) 
        const marker = new google.maps.Marker({
          position: { lat: parseInt(location.cordinate.lat), lng: parseInt(location.cordinate.lng) },
          map: this.map,
          content: `<div class="c-maps__callout">
          ${location.name}
          </div>`,
          icon: {
            url:location.profilePicture,
            anchor: new google.maps.Point(32,32),
            scaledSize: new google.maps.Size(30,30),
            origin: new google.maps.Point(0, 1),
          },

        });

        if (location.isOpen) {
          setTimeout(() => {
            infowindow.setContent(marker.content);
            infowindow.open(this.map, marker);
          }, 1000);
        }

        google.maps.event.addListener(marker, 'click', () => {
          infowindow.setContent(marker.content);
          infowindow.open(this.map, marker);
        });

        return marker;
      });
console.log(typeCheck)
if(typeCheck  && typeCheck.params.type=== 'cluster')
      return new MarkerClusterer(
        this.map,
        markers,
        {
          styles: [{
            width: 27,
            height: 28,
            textalign:'center',
            anchor:[0, 0],
            url: ClusterIcon,
            textColor: 'white',
          }],
        },
      );
    }

    return {};
  }

  render() {
    return (
      <div
        className="c-maps"
        id = "mapsetup"
        // ref={(e) => {
        //   this.mapRef = e;
        // }}
      />
    );
  }
}

export default GoogleMap;