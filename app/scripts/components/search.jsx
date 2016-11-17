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

    var house = this.props.state.houseCollection.models
    var houseListing = house.map(function(house){
      var address = encodeURIComponent(house.get('Address')).replace(/%20/g, '+');
      var zipcode = house.get('zipcode');
      var zillowAddress = "http://localhost:3000/zillow/?address=" + address + "&zipcode=" + zipcode;
      var amount;
      var zillowGetRequest =  $.get(zillowAddress , function(xml) {
        var $jsonObj = $(xml);
        amount = $jsonObj.find('amount').text()
        console.log('amount', '$' + amount);
        // var SoldAmount = house.get('SoldAmount')
        // console.log('encoding:', parseFloat(SoldAmount.replace('$', '').replace(',', '')));
      })
      return (
        <tr key={house.get('objectId')}>
          <th>
            <img src="https://unsplash.it/300/200/?random"></img>
          </th>
          <th>
            <a href={'#/house/' + house.get('objectId') + '/'}>
              {house.get('SoldAmount')}
            </a>
          </th>
          <th> {house.get('Address')}</th><th>{house.get('city')}</th><th>{house.get('zipcode')}</th>
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
