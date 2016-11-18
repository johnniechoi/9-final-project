var $ = require('jquery');
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;

var DisplayDetail = React.createClass({
  render: function(){
    var house = this.props.house
    console.log(house);
    var foreclosedValue = house.get('SoldAmount')?parseFloat(house.get('SoldAmount').replace('$', '').replace(',', '')):null
    var zestimate = house.get('amount')?parseFloat(house.get('amount').replace(',', '')):null
    var difference = foreclosedValue - zestimate;
    console.log(difference);

    return (
      <div className="container">
        <div className="col-md-4">
          <img src="https://unsplash.it/300/300/?random" ></img>
        </div>
        <div className="col-md-8">
          <h1>{house.get('Address')}</h1>
          <ul>
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
          </ul>
        </div>
      </div>
    )
  }
})

var DetailForm = React.createClass({
  render: function(){
    return (
      <div>
        <h1>Form! Form! Form!</h1>
        <input className="list-group-item" placeholder="Project Estimates Here!" ></input>
        <input className="list-group-item" placeholder="Dollar Amount!" ></input>
      </div>
    )
  }
})

var DetailsPage = React.createClass({
  getInitialState: function(){
    return {
      house: new House(),
      Address: '',
      zipcode: '',
      city: '',
      Attorney: '',
      Plaintiff: '',
      SoldAmount: '',
      amount: '',
      DateofSale: '',
      CaseNumer: ''
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
    // console.log(house.get('amount'));
  },
  render: function(){
    return(
      <div className="container">
        <NavBar/>
        <DisplayDetail house={this.state.house}/>
        <DetailForm/>
      </div>
    )
  }
})

module.exports = {
  DetailsPage: DetailsPage
}
