var React = require('react')
var Reactdom = require('react-dom')
var Backbone = require('backbone')

var House = require('../models/homes.js').House;
var HouseCollection = require('../models/homes.js').HouseCollection
var RenovationCollection = require('../models/homes.js').RenovationCollection

var NavBar = require('../../template.jsx').NavBar;
var $ = require('jQuery');

var Items = React.createClass({
  render: function(){
    // console.log(encodeURIComponent());
    var houses = this.props.houses.models
      // console.log('houses', houses);
    var houseListing = houses.map(function(house){
      console.warn('inside map', house);
      // var address = encodeURIComponent(house.get('Address')).replace(/%20/g, '+');
      // var amount;
      // amount = parseFloat(house.get('amount').replace(',', ''))
      //   var SoldAmount = parseFloat(house.get('SoldAmount').replace('$', '').replace(',', ''))
      return (
        <h1>{house}</h1>
        // <a key={house.get('objectId')} href={'#/details/' + house.get('objectId') + '/'} className="search-tile">
        //   <div className="col-md-4">
        //   <img src="https://unsplash.it/300/200/?random"></img>
        //   <h3>Difference: ${amount-SoldAmount}</h3>
        //   <h4 href={'#/details/' + house.get('objectId') + '/'}> {house.get('Address')} </h4>
        //   <p>{house.get('city')} {house.get('zipcode')}</p>
        //   <p>Foreclose Value: {house.get('SoldAmount')}</p>
        //   <p>Estimated Value: ${house.get('amount')}</p>
        // </div></a>
      )
    })
    // console.log('house:', house);
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
          })
        )
      })
    })
  },
  render: function(){
    console.log('state:', this.state);
    var houses = this.state.houses
      console.log('houses', houses);
    var Listing = houses.map(function(){
      return
    })
      console.log('houselisting', Listing);
    return(
      <div>
        <div>
          <NavBar/>
        </div>
        <div className="container">
          <div className="col-md-12">
        <Items houses={this.state.houses}/>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = {
  SavedPage
}
