var $ = require('jquery');
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;
var RenovationContainer = require('./form.jsx').RenovationContainer;
var RenovationCollection = require('../models/homes.js').RenovationCollection;
var Renovation = require('../models/homes.js').Renovation;


var DisplayDetail = React.createClass({
  componentWillMount: function(){
    var self = this;
    var houseId = this.props.house.get('objectId')
    var renovationCollection = new RenovationCollection();
    renovationCollection
      .parseWhere('user', '_User', localStorage.getItem('objectId'))
      .parseWhere('house', 'foreclosedData', houseId)
      .fetch().then(function(data){
        // Get the renovation model

        var reno = renovationCollection.shift();

        if (reno){
          self.setState({reno: reno})
        }
    });
  },
  render: function(){
    var photo = this.state ? this.state.reno.get('photo'): "https://maps.googleapis.com/maps/api/streetview?channel=ldp-publicrecord&location=512+Sellwood+Cir%2C+Simpsonville%2C+SC+29680&size=665x441&client=gme-redfin&signature=raAoVuSezjKPjkGNFm3W_MTYDsk="
    // console.log('photo', photo);
    var house = this.props.house
    var foreclosedValue = house.get('SoldAmount')?parseFloat(house.get('SoldAmount').replace('$', '').replace(',', '')):null
    var zestimate = house.get('amount')?parseFloat(house.get('amount').replace(',', '')):null
    var difference = zestimate - foreclosedValue;
    return (
      <div className="">
        <div className="col-md-6">
          <h1>{house.get('Address')}</h1>
          <img src={photo}></img>
        </div>
        <div className="col-md-6 detail-listing">
          <ol className="rectangle-list row">
            <li>Case Number: {house.get('CaseNumber')}</li>
            <li>Attorney: {house.get('Attorney')}</li>
            <li>Date of Sale: {house.get('DateofSale')}</li>
            <li>Defendant: {house.get('Defendant')}</li>
            <li>Plaintiff: {house.get('Plaintiff')}</li>
          </ol>
          <ol>
            <li>Foreclosed Value: {house.get('SoldAmount')}</li>
            <li>Estimated Value: ${house.get('amount')}</li>
            <li>City: {house.get('city')}</li>
            <li>Zipcode: {house.get('zipcode')}</li>
            <li><h4>Difference: ${difference}</h4></li>
          </ol>
        </div>
      </div>
    )
  }
})

import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

export default function SimpleMap (props) {
  return (
    <section style={{height: "100%"}}>
      <GoogleMapLoader
        containerElement={
          <div
            {...props.containerElementProps}
            style={{
              height: "100%",
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => console.log(map)}
            defaultZoom={3}
            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
            onClick={props.onMapClick}
          >
            {props.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                  onRightclick={() => props.onMarkerRightclick(index)} />
              );
            })}
          </GoogleMap>
        }
      />
    </section>
  );
}

var DetailsPage = React.createClass({
  getInitialState: function(){
    return {
      house: new House(),
    }
  },
  componentWillMount: function(){
    var self = this;
    var house = this.state.house
    , objectId = this.props.objectId;
    house.set({ objectId })
    house.fetch().then(function(){
      self.setState({ house })
    })
    var renovation = new Renovation();
    renovation.fetch().then(function(data){
    })
  },
  render: function(){
    return(
      <div>
        <NavBar/>
        <div className="container">
          <DisplayDetail house={this.state.house} photo={this.state.reno}/>
          <RenovationContainer house={this.state.house}/>
        </div>
      </div>
    )
  }
})

module.exports = {
  DetailsPage: DetailsPage
}
