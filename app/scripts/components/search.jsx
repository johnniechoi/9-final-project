var React = require('react')
var Reactdom = require('react-dom')
var Backbone = require('backbone')
var $ = require('jQuery');

var House = require('../models/homes.js').House;
var HouseCollection = require('../models/homes.js').HouseCollection;
var NavBar = require('../../template.jsx').NavBar;
var MapContainer = require('./map.jsx').MapContainer;

var Items = React.createClass({
  render: function(){
    var self = this
    // console.log(encodeURIComponent());
    var house = this.props.houseCollection.models
    var houseListing = house.map(function(house){
// https://private-03bdb-zillowdata.apiary-mock.com/questions
      //this following is for when I can pull from the Zillow server and didn't hit the limit!
      var address = encodeURIComponent(house.get('Address')).replace(/%20/g, '+');
      // var zipcode = house.get('zipcode');
      // var zillowAddress = "http://localhost:3000/zillow/?address=" + address + "&zipcode=" + zipcode;
      // // var zillowAddress = 'https://private-03bdb-zillowdata.apiary-mock.com/questions'
      var amount;
      amount = parseFloat(house.get('amount').replace(',', ''))
      // console.log(amount);
      // var zillowGetRequest =  $.get(zillowAddress , function(xml) {
      //   var $jsonObj = $(xml);
      //   amount = $jsonObj.find('amount').text()
      //   console.log('amount', '$' + amount);
        var SoldAmount = parseFloat(house.get('SoldAmount').replace('$', '').replace(',', ''))
        // console.log('encoding:', SoldAmount);
      // })
      // console.log(self);
      return (
        <a key={house.get('objectId')} href={'#/details/' + house.get('objectId') + '/'} className="search-tile">
          <table cellPadding="0" cellSpacing="0" border="0">
            <tbody>
              <tr>
                <td>${amount-SoldAmount}</td>
                <td>{house.get('Address')}</td>
                <td>{house.get('city')} {house.get('zipcode')}</td>
                <td>{house.get('SoldAmount')}</td>
                <td>${house.get('amount')}</td>
              </tr>
            </tbody>
          </table>
        </a>
      )
    })
    // console.log('house:', house);
    return (
      <div className="tbl-content ">
        {houseListing}
      </div>
    )
  }
})

var SearchPage = React.createClass({
  getInitialState: function(){
    var self = this;
    var house = new House();
    house.fetch().then(function(){
      self.setState({ house })
    });
    var houseCollection = new HouseCollection();
    houseCollection.fetch().then(function(){
      self.setState({ houseCollection })
    })
    return{
      house,
      houseCollection
    }
  },
  render: function(){
    return(
      <div>
        <div>
          <NavBar/>
        </div>


        <div className="container">
          <div className="col-xs-12 ">
            <div className="search-title" ><h1>Greenville SC Foreclosed Homes</h1></div>
            <section>
              <div className="map-size">
                <MapContainer HouseCollection={this.state.houseCollection}/>
              </div>
              <div className="tbl-header house">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <thead>
                    <tr>
                      <th>Difference</th>
                      <th>Street</th>
                      <th>City/State</th>
                      <th>Foreclosed Value</th>
                      <th>Estimated Value</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <Items houseCollection={this.state.houseCollection} setFavorite={this.setFavorite}/>
            </section>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = {
  SearchPage
}
