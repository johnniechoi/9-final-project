var $ = require('jquery');
var _ = require('underscore')
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;
var Estimate = require('../models/homes.js').Estimate;
var EstimateCollection = require('../models/homes.js').EstimateCollection;
var Renovation = require('../models/homes.js').Renovation;
var FileModel = require('../models/filesupload.js').File


var FormInput = React.createClass({
  getInitialState: function(){
    console.log('getinitial', this.props.formProps.reno.get('estimate'));
    return this.props.formProps.reno.toJSON()
  },
  componentWillReceiveProps: function(newProps){
    // console.log('componentWill', newProps.formProps.reno.toJSON());
    this.setState(newProps.formProps.reno.toJSON())
  },
  handleInputChange: function(e){
    var renoField = e.target;
    var newState = {};
    newState[renoField.name] = renoField.value;
    // console.log('newState,', newState);
    this.setState(newState);
    // console.log('state', this.st);
    var estimateCost = this.state.estimateCost
    var project = this.state.project
    this.props.formProps.addReno({estimateCost: estimateCost, project: project})
    // console.log('estimate', this.props.formProps.reno.get('estimate')[0]);
    // this.props.formProps.reno.get('estimate').push(newState)
  },
  render: function(){
    var renoCollection = this.state
    // console.log('FormInput', renoCollection);
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
    return this.props.reno.toJSON()
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.props.saveReno(this.props, this.state.notes)
    // console.log("handleSubmit:", this.props, this.state);
  },
  handleTextArea: function(e){
    var notes = e.target.value;
    this.setState({notes: notes});
    console.log('state', this.state)
  },
  handlePicture: function(e){
    console.log('handlePicture');
    e.preventDefault();
    console.log('handlePictureProps', this.props);
    var attachedPicture = e.target.files[0];
    this.props.uploadPicture(attachedPicture);
  },
  render: function(){
    var formProps = this.props
    var estimateCollection = this.props.reno.get('estimate')
    // console.log('estimateCollection:', estimateCollection);
    // var renoCollectionFormset = estimateCollection.map(function(reno){
    //   return(
    //     <FormInput key={reno.cid} formProps={formProps}/>
    //   )
    // })
    return(
      <div className="container">
        <form onSubmit={this.handleSubmit} method="POST" encType="multipart/form-data" action="/dist/">
          <div className="col-md-5">
            <h3> Renovation Estimate </h3>
          {/*    {renoCollectionFormset}  */ }
            <button onClick={this.props.addReno} type="button" className="btn btn-success"> Add Renovation</button>
          </div>
          <div className="col-md-7">
            <h3>Notes</h3>
            <textarea onChange={this.handleTextArea} name="notes" value={this.state.notes} className="form-control textarea" rows="3" type="text" placeholder="This house is great!" ></textarea>
            <button type='submit' className="btn btn-alert">Save Renovation</button>
            <img src={this.props.reno.get('photo')}/>
          <input onChange={this.handlePicture} type="file" />
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
      // renoCollection: new RenoCollection()
    }
  },
  componentWillMount: function(){
    this.getHouse();
  },
  componentWillReceiveProps: function(){
    this.getHouse();
  },
  getHouse: function(){
    var self = this
    var reno = this.state.reno
    var objectId = this.props.state.house.get('objectId')
    // console.log('localStorage', localStorage);
    // console.log("getHouse", reno);
    reno
      .parseWhere('user', '_User', localStorage.getItem('objectId'))
      .parseWhere('house', 'foreclosedData', objectId)
      .fetch().then(function(data){
        if (reno.length == 0){
          return
        }
        // console.log('inside renovation', data);
        self.setState({ reno })
    });
    // console.log('reno', this.state.reno);
  },
  addReno: function(estimate){
    var estimate = this.state.reno.get('estimate')
    console.log('addReno', estimate);
    // console.warn(typeof estimate)
    estimate.add([{}])
    this.setState({ reno: this.state.reno})
  },
  saveReno: function(props, state){
    var self = this
    console.log('saveReno', this.state.reno);
    this.state.reno.set({
      house: {
        '__type': 'Pointer',
        className: 'foreclosedData',
        objectId: this.props.state.house.get('objectId')
      },
      user: {
        '__type': 'Pointer',
        className: '_User',
        objectId: localStorage.objectId
      },
    })
    // this.setState({ reno: this.state.reno })
    console.log('saveReno', this.state.reno);
    this.state.reno.save()
    alert('Data saved!')
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
      console.warn('photo saved');
      self.setState({reno: renovation});
    });
  },
  render: function(){
    console.log('container render', this.state);
    return (
      <div className="form-inline container well">

        <Form
          reno={this.state.reno}
          renoCollection={this.state.renoCollection}
          addReno={this.addReno}
          addNote={this.addNote}
          saveReno={this.saveReno}
          uploadPicture={this.uploadPicture}
        />

      </div>
    )
  }
})

module.exports = {
  RenovationContainer
}
