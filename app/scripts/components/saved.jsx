var React = require('react')
var Reactdom = require('react-dom')
var Backbone = require('backbone')

var House = require('../models/homes.js').House;
var HouseCollection = require('../models/homes.js').HouseCollection
var RenovationCollection = require('../models/homes.js').RenovationCollection
var MapContainer = require('./savedmap.jsx').MapContainer;


var NavBar = require('../../template.jsx').NavBar;
var $ = require('jQuery');

var Items = React.createClass({
  render: function(){
    // console.log(encodeURIComponent());
    var houses = this.props.houses.models
      // console.log('houses', houses);
    var houseListing = houses.map(function(house){
      // console.log(house);
      var address = encodeURIComponent(house.get('Address')).replace(/%20/g, '+');
      var amount;
      amount = parseFloat(house.get('amount').replace(',', ''))
        var SoldAmount = parseFloat(house.get('SoldAmount').replace('$', '').replace(',', ''))
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
    return (
        <ul>
          {houseListing}
        </ul>
    )
  }
})

var SavedPage = React.createClass({
  getInitialState: function(){
    var self = this;
    return{
      renovationCollection: new RenovationCollection(),
      house: new House(),
      houses: new HouseCollection()
    }
  },
  componentWillMount: function(){
    var self = this;
    var renoData = new House();
    var RenovationCollection = this.state.renovationCollection
      RenovationCollection.parseWhere('saved', '_User', localStorage.objectId).fetch().then(function(response){
      if(RenovationCollection.length >= 1){
      } else {
        console.log('we got none');
      };
      response.results.map(function(data){
        return (
          // console.log(data),
          renoData.set('objectId', data.house.objectId),
          renoData.fetch().then(function(data){
            self.state.houses.add(data)
            self.setState({ houses: self.state.houses })
          })
        )
      })
    })
  },
  render: function(){
    // console.log('state:', this.state);
    return(
      <div>
        <div>
          <NavBar/>
        </div>
        <div className="container">
          <div className="col-md-12">
            <section>
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
              <Items houses={this.state.houses}/>
              <MapContainer renovationCollection={this.state.renovationCollection}/>
            </section>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = {
  SavedPage
}
