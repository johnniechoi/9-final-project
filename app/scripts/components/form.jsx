var $ = require('jquery');
var _ = require('underscore')
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;
var Estimate = require('../models/homes.js').Estimate;
var EstimateCollection = require('../models/homes.js').EstimateCollection;
var Renovation = require('../models/homes.js').Renovation;
var RenovationCollection = require('../models/homes.js').RenovationCollection;
var FileModel = require('../models/filesupload.js').File


var FormInput = React.createClass({
  getInitialState: function(){
    return this.props.estimate.toJSON();
  },

  componentWillReceiveProps: function(newProps){
    // console.log('componentWill', newProps.formProps.reno.toJSON());
    this.setState(newProps.estimate.toJSON())
  },

  handleInputChange: function(e){
    var renoField = e.target;
    var newState = {};
    var estimateModel = this.props.estimate;

    newState[renoField.name] = renoField.value;

    estimateModel.set(renoField.name, renoField.value);
    this.setState(newState);
  },
  render: function(){
    return (
      <div>
        <div className="form-group">
          <input onChange={this.handleInputChange} value={this.state.project} type="text" name="project" id="project" className="form-control" placeholder="Project Name!" ></input>
        </div>
        <div className="form-group">
          <input onChange={this.handleInputChange} value={this.state.estimateCost} type="text" name="estimateCost" id='estimate' className="form-control" placeholder="Estimate" ></input>
        </div>
      </div>
    )
  }
})

var Form = React.createClass({
  getInitialState: function(){
    return this.props.reno.toJSON();
  },
  componentWillReceiveProps: function(){
    this.setState({notes: this.props.reno.get('notes')})
  },
  handleSubmit: function(e){
    e.preventDefault();

    var renovation = this.props.reno;
    renovation.set('notes', this.state.notes);
    this.props.saveReno(renovation.toJSON());
  },

  handleTextArea: function(e){
    var notes = e.target.value;
    this.setState({notes: notes});
    console.log('notes', this.state);
  },

  handlePicture: function(e){
    console.log('handlePicture');
    e.preventDefault();
    console.log('handlePictureProps', this.props);
    var attachedPicture = e.target.files[0];
    this.props.uploadPicture(attachedPicture);
  },

  handleClick: function(e){
    e.preventDefault();
    var favorite = this.props;
    //get the objectId from the house and send it through!
    this.props.setFavorite();
    console.log('favorite', favorite);
  },
  render: function(){
    var formProps = this.props
    var estimateCollection = this.props.reno.get('estimate')
    // console.log('estimateCollection:', estimateCollection);
    var renoCollectionFormset = estimateCollection.map(function(estimate){
      return(
        <FormInput key={estimate.cid} estimate={estimate}/>
      )
    })
    return(
      <div className="container">
        <form onSubmit={this.handleSubmit} method="POST" encType="multipart/form-data" action="/dist/">
          <div className="col-md-5">
            <h3> Renovation Estimate </h3>
            {renoCollectionFormset}
            <button onClick={this.props.addReno} type="button" className="btn btn-success"> Add Renovation</button>
          </div>
          <div className="col-md-7">
            <h3>Notes</h3>
            <textarea onChange={this.handleTextArea} name="notes" value={this.state.notes} className="form-control textarea" rows="3" type="text" placeholder="This house is great!" ></textarea>
            <img src={this.props.reno.get('photo')}/>
            <input onChange={this.handlePicture} type="file" />
            <button type='submit' className="btn btn-alert">Save Renovation</button> <button className='btn btn-success' onClick={this.handleClick}>favorite</button>
          </div>
        </form>
      </div>
    )
  }
})

var RenovationContainer = React.createClass({
  getInitialState: function(){
    return {
      reno: new Renovation(),
      // need to use the model because thats all I'm going through
      house: new House()
    }
  },
  componentWillMount: function(){
    this.getHouse();
  },
  componentWillReceiveProps: function(){
    this.getHouse();
  },
  getHouse: function(){
    var self = this;
    var houseId = this.props.house.get('objectId');

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
  addReno: function(estimate){
    var estimate = this.state.reno.get('estimate')

    estimate.add([{}]);
    this.setState({reno: this.state.reno});
  },

  saveReno: function(renovationData){
    var self = this
    var renovation = this.state.reno;

    // set all the form data to the model
    renovation.set(renovationData)

    // Set pointers
    renovation.set({
      house: {
        '__type': 'Pointer',
        className: 'foreclosedData',
        objectId: this.props.house.get('objectId')
      },
      user: {
        '__type': 'Pointer',
        className: '_User',
        objectId: localStorage.objectId
      },
    });

    console.log('inside save', this.state);

    // Save renovation record
    renovation.save().then(function(){
      renovation.fetch().then(() =>{
        self.setState({reno: renovation});
      });
    });
    // alert('This page has been saved!')
  },
  uploadPicture: function(picture){
    var self = this;
    var file = new FileModel();
    // console.log(file);
    file.set('name', picture.name);
    file.set('data', picture);
    file.save().done(function(response){
      var renovation = self.state.reno;
      renovation.set('photo', file.get('url'));
      renovation.save();
      self.setState({reno: renovation});
    });
  },
  setFavorite: function(saved){
    var house = this.props.house.get('objectId');
    var reno = this.state.reno
    console.log('setfavorite', reno);

    var currentUser = localStorage.objectId
    reno.set('saved', {"__op": "AddRelation", "objects": [ {__type: "Pointer", className: "_User", objectId: currentUser}]});
    reno.save();
  },
  render: function(){
    // console.log('container render', this.state.reno);
    return (
      <div className="form-inline container well">
        <Form
          reno={this.state.reno}
          renoCollection={this.state.renoCollection}
          addReno={this.addReno}
          addNote={this.addNote}
          saveReno={this.saveReno}
          uploadPicture={this.uploadPicture}
          setFavorite={this.setFavorite}
        />
      </div>
    )
  }
})

module.exports = {
  RenovationContainer
}
