var $ = require('jquery');
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;
var RenovationContainer = require('./form.jsx').RenovationContainer;
var RenoCollection = require('../models/homes.js').RenoCollection;
var FileModel = require('../models/filesupload.js').File

var DisplayDetail = React.createClass({
  handlePicture: function(e){

    $('#app').on('change', function(event){
      event.preventDefault();
      console.log($("#pic")[0]);
      var picture = $("#pic")[0].files[0];
    //
      console.log($("#pic")[0]);

      var attachedFile = e.target.files[0];
      this.setState({profilePic: attachedFile});

      var file = new FileModel();
      file.set('name', picture.name);
      file.set('data', picture);
      file.save().done(function(){
        console.log(file);
        // alert(file.get('url'));
      });
    });

  },
  render: function(){
    var house = this.props.house
    // console.log(house);
    var foreclosedValue = house.get('SoldAmount')?parseFloat(house.get('SoldAmount').replace('$', '').replace(',', '')):null
    var zestimate = house.get('amount')?parseFloat(house.get('amount').replace(',', '')):null
    var difference = zestimate - foreclosedValue;
    // console.log(difference);

    return (
      <div className="container">
        <div className="col-md-6">
          <h1>{house.get('Address')}</h1>
          <img src="https://maps.googleapis.com/maps/api/streetview?channel=ldp-publicrecord&location=512+Sellwood+Cir%2C+Simpsonville%2C+SC+29680&size=665x441&client=gme-redfin&signature=raAoVuSezjKPjkGNFm3W_MTYDsk=" ></img>
          <form>
            <input onChange={this.handlePicture} type="file" />
          </form>
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
      // RenoCollection: new RenoCollection()
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
