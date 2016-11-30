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

  // componentWillMount: function(){
  //   console.log(this.props);
  // },

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
    var self = this
    var estimate = this.props.estimate
    return (
      <div>
        <div className="form-group">
          <input onChange={this.handleInputChange} value={this.state.project} type="text" name="project" id="project" className="form-control" placeholder="Project Name!" ></input>
        </div>
        <div className="form-group">
          <input onChange={this.handleInputChange} value={this.state.estimateCost} type="text" name="estimateCost" id='estimate' className="form-control" placeholder="Estimate" ></input>
          <button className="delete-estimate" onClick={function(){self.props.deleteEstimate(estimate)}}>X</button>
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
  },

  handlePicture: function(e){
    console.log('handlePicture');
    e.preventDefault();
    var attachedPicture = e.target.files[0];
    console.log(attachedPicture);
    this.props.uploadPicture(attachedPicture);
  },

  handleFavorite: function(e){
    e.preventDefault();
    var favorite = this.props;
    this.props.setFavorite();
  },
  handleDeleteFavorite: function(e){
    e.preventDefault();
    var favorite = this.props;
    this.props.deleteFavorite();
  },
  something: function(e){
    e.preventDefault
    alert('hello!')
  },
  render: function(){
    var self = this
    var formProps = this.props
    // console.log(formProps);
    var estimateCollection = this.props.reno.get('estimate')
    var total = estimateCollection.reduce(function(total, estimate){
      // console.log(estimate.get('estimateCost'))
      return total + parseFloat(estimate.get('estimateCost'))
    },0)
    var renoCollectionFormset = estimateCollection.map(function(estimate){
      return <FormInput key={estimate.cid} estimate={estimate} deleteEstimate={formProps.deleteEstimate} />
    })
    return(
      <div className="col-md-12">
        <form >
          <div className="col-md-6">
            <h3> Renovation Estimate </h3>
            {renoCollectionFormset}
            <div className="total">
              <button onClick={this.props.addReno} type="button" className="btn btn-primary">Add Renovation</button>
              <text className="totalText">total:</text>
              <h1 className="totalNumber" >${total}</h1>
            </div>
          </div>
        </form>
        <form onSubmit={this.handleSubmit} method="POST" encType="multipart/form-data" action="/dist/">
          <div className="col-md-6">
            <h3>Description</h3>
            <textarea onChange={this.handleTextArea} name="notes" value={this.state.notes} className="form-control textarea" rows="3" type="text" placeholder="This house is great!" ></textarea>
            <input onChange={this.handlePicture} type="file" />
            <button type='submit' className="btn btn-success ">Save Renovation</button>
            <button className='btn btn-xs btn-warning' onClick={this.handleFavorite}>Favorite</button>
            <button className='btn btn-xs btn-info' onClick={this.handleDeleteFavorite}>Not Favorite</button>
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
    estimate.preventDefault();
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
  deleteFavorite: function(saved){
    var house = this.props.house.get('objectId');
    var reno = this.state.reno
    console.log('deletefavorite', reno);
    var currentUser = localStorage.objectId
    reno.set('saved', {"__op": "RemoveRelation", "objects": [ {__type: "Pointer", className: "_User", objectId: currentUser}]});
    reno.save();
  },
  deleteEstimate: function(estimate){
    estimate.destroy();
  },
  render: function(){
    console.log(this.state);
    return (
      <div className="form-inline">
        <Form
          reno={this.state.reno}
          renoCollection={this.state.renoCollection}
          addReno={this.addReno}
          addNote={this.addNote}
          saveReno={this.saveReno}
          uploadPicture={this.uploadPicture}
          setFavorite={this.setFavorite}
          deleteFavorite={this.deleteFavorite}
          deleteEstimate={this.deleteEstimate}
        />
      </div>
    )
  }
})

module.exports = {
  RenovationContainer
}
