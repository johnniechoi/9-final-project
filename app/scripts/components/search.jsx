var React = require('react')
var Reactdom = require('react-dom')
var Backbone = require('backbone')

var House = require('../models/homes.js').House;
var HouseCollection = require('../models/homes.js').HouseCollection
var NavBar = require('../../template.jsx').NavBar;
var $ = require('jQuery');

var Items = React.createClass({
  render: function(){
    // console.log(encodeURIComponent());

    // var zillowGetRequest =  $.get(http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz19hs5hlzz0r_493z4&address=2+Wild+Eve+Way&citystatezip=29650 , function(xml) {
    //   var $jsonObj = $(xml);
    //   amount = $jsonObj.find('amount').text()
    //   console.log('amount', '$' + amount);
    //   // var SoldAmount = house.get('SoldAmount')
    //   console.log('encoding:', parseFloat(SoldAmount.replace('$', '').replace(',', '')));
    // })

    var house = this.props.state.houseCollection.models
    var houseListing = house.map(function(house){

      //this following is for when I can pull from the Zillow server and didn't hit the limit!
      // var address = encodeURIComponent(house.get('Address')).replace(/%20/g, '+');
      // var zipcode = house.get('zipcode');
      // var zillowAddress = "http://localhost:3000/zillow/?address=" + address + "&zipcode=" + zipcode;
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
      return (
        <tr key={house.get('objectId')}>
          <th>
            <img src="https://unsplash.it/300/200/?random"></img>
          </th>
          <th>
            Foreclose Value: {house.get('SoldAmount')}
          </th>
          <th>
            Estimated Value: {house.get('amount')}
          </th>
          <th>
            <a href={'#/details/' + house.get('objectId') + '/'}>
              Difference: {SoldAmount-amount}
            </a>
          </th>
          <th> {house.get('Address')} {house.get('city')} {house.get('zipcode')}</th>
        </tr>
      )
    })
    // console.log('house:', house);
    return (
      <div>
        <ul>
          {houseListing}
        </ul>
      </div>
    )
  }
})

var SearchBar = React.createClass({
  render: function(){
    return(
      <div>
        <form className="navbar-form navbar-left">
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Dunno how this works yet!"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
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
    // console.log('state:', this.state);
    return(
      <div>
        <div className="row">
          <NavBar/>
          <SearchBar/>
        </div>
        <div>
          <h1>Search this houses!</h1>
          <Items state={this.state}/>
        </div>
      </div>
    )
  }
})

module.exports = {
  SearchPage
}
