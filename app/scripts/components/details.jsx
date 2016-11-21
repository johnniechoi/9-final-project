var $ = require('jquery');
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;
var RenovationContainer = require('./form.jsx').RenovationContainer;

var DisplayDetail = React.createClass({
  render: function(){
    var house = this.props.house
    // console.log(house);
    var foreclosedValue = house.get('SoldAmount')?parseFloat(house.get('SoldAmount').replace('$', '').replace(',', '')):null
    var zestimate = house.get('amount')?parseFloat(house.get('amount').replace(',', '')):null
    var difference = foreclosedValue - zestimate;
    // console.log(difference);

    return (
      <div className="container">
        <div className="col-md-6">
          <h1>{house.get('Address')}</h1>
          <img src="https://maps.googleapis.com/maps/api/streetview?channel=ldp-publicrecord&location=512+Sellwood+Cir%2C+Simpsonville%2C+SC+29680&size=665x441&client=gme-redfin&signature=raAoVuSezjKPjkGNFm3W_MTYDsk=" ></img>
        </div>
        <div className="col-md-6 detail-listing">
          <ol className="rectangle-list">
            <li>Case Number: {house.get('CaseNumber')}</li>
            <li>Attorney: {house.get('Attorney')}</li>
            <li>Date of Sale: {house.get('DateofSale')}</li>
            <li>Defendant: {house.get('Defendant')}</li>
            <li>Plaintiff: {house.get('Plaintiff')}</li>
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
      // console.log(house.get('amount'));
    })
  },
  render: function(){
    // console.log('details state:', this.state);
    return(
      <div>
        <NavBar/>
        <div className="container">
          <DisplayDetail house={this.state.house}/>
          <RenovationContainer state={this.state}/>
        </div>
      </div>
    )
  }
})

module.exports = {
  DetailsPage: DetailsPage
}
