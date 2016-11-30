var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var $ = require('jquery');
require('backbone-react-component');
var google = require('react-google-maps');
var ScriptjsLoader = require("react-google-maps/lib/async/ScriptjsLoader");
var GoogleMapLoader = google.GoogleMapLoader;
var GoogleMap = google.GoogleMap;
var Marker = google.Marker;
var InfoWindow = google.InfoWindow;
var HouseCollection = require('../models/homes.js').HouseCollection;
// THANKS GRAYSON! :
// https://github.com/graysonhicks/parkary/blob/master/app/scripts/components/mapview/dynamicmap.jsx

var HouseMap = React.createClass({
  getInitialState: function(){
    var state = {
      zoom: 11,
      center: {
        lat:  (34.852619),
        lng:  (-82.394012)
      },
    }
    // console.log(this.props.houses);
    return state;
  },
  onMarkerClick: function(props, marker, e){
    console.log("marker clicked")
    this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true
  });
},
  render: function(){
    var self = this;
    var center = this.state.center;
    var zoom = this.state.zoom;
    var houses = this.props.renovationCollection.map(function(house, index){
      var lat = house.get('lat')
      var long = house.get('long')
      var address = house.get('Address')
        // console.log(typeof house.get('Address'));
      return (
        <Marker key={house.cid} position={{lat: lat, lng:long}}>
          <InfoWindow
            marker={self.state.activeMarker}
            visible={self.state.showingInfoWindow}
            >
            <a href={'#/details/' + house.get('objectId') + '/'}>{address}</a>
          </InfoWindow>
        </Marker>
      )
    }.bind(this));
    return (
      <div>
        <section id="map-section" style={{height:"525px"}}>
          <GoogleMapLoader containerElement={
              <div
                {...this.props}
                style={{
                  height: "100%"
                }}
              />
            }
             googleMapElement={
              <GoogleMap
                id="map"
                zoom={zoom}
                ref="map"
                center={center}
                defaultCenter={center}
              >
                {houses}
              </GoogleMap>
            }
          />
        </section>
      </div>
    );
  }
});

var MapContainer = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  handleClick: function(e){
    e.preventDefault();
    Backbone.history.navigate('#items/', {trigger:true});
  },
  // handleMap: function(){
  //   new google.maps.Map(), {
  //     zoom: 16,
  //     center: new google.maps.LatLng(-34.397, 150.644),
  //     mapTypeId: 'roadmap'
  //   }
  // },
  // getDefaultProps: function(){
  //     return {
  //       center: {
  //         lat: 59.938043,
  //         lng: 30.337157
  //       }, // [59.938043, 30.337157],
  //       zoom: 9,
  //       greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  //     };
  // },
  render: function(){
    console.log('savedmap', this.props);
    return (
      <HouseMap renovationCollection={this.props.renovationCollection}/>
    )
  }
});


//STATIC MAP:
// <img src="https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyCWDL-fy7OiIh4k8_aaIGusHC6EhehTRfo" id="map"></img>


module.exports = {
  MapContainer: MapContainer
}
