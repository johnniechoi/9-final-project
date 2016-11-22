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
      return (
        <a key={house.get('objectId')} href={'#/details/' + house.get('objectId') + '/'} className="search-tile">
          <div className="col-md-4">
          <img src="https://unsplash.it/300/200/?random"></img>
          <h3>Difference: ${amount-SoldAmount}</h3>
          <h4 href={'#/details/' + house.get('objectId') + '/'}> {house.get('Address')} </h4>
          <p>{house.get('city')} {house.get('zipcode')}</p>
          <p>Foreclose Value: {house.get('SoldAmount')}</p>
          <p>Estimated Value: ${house.get('amount')}</p>
        </div></a>
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

// var SearchBar = React.createClass({
//   render: function(){
//     return(
//       <div className="">
//         <form className="navbar-form navbar-left">
//           <div className="form-group">
//             <input type="text" className="form-control" placeholder="Dunno how this works yet!"/>
//           </div>
//           <button type="submit" className="btn btn-default">Submit</button>
//         </form>
//       </div>
//     )
//   }
// })

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
        <div>
          <NavBar/>
          {/*
          <div className="float-right">
            <SearchBar/>
          </div>
          */}
        </div>
        <div className="container">
          <div className="col-md-12">
            <Items state={this.state}/>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = {
  SearchPage
}
