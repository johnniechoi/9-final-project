var $ = require('jquery');
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;
var Reno = require('../models/homes.js').Reno;
var RenoCollection = require('../models/homes.js').RenoCollection;

var FormInput = React.createClass({
  getInitialState: function(){
    console.log('form:', this.props.renoCollection);
    return this.props
  },
  componentWillReceiveProps: function(newProps){
    console.log('newprops', newProps);
    this.setState(newProps)
  },
  handleInputChange: function(e){
    var renoField = e.target;
    var newState = {};
    newState[renoField.name] = renoField.value;
    this.setState(newState);
    console.log('handleinputchange:', this.state);
    console.log(renoField.name, ':', renoField.value);

    this.state.set(renoField.name, renoField.value)
    // console.log(this.props.state.reno.attributes)
  },
  render: function(){
    var renoCollection = this.props.renoCollection
    // console.log('renoColelction:', renoCollection);
    return (
      <div>
        <form>
          <div className="form-group">
            <input onChange={this.handleInputChange} value={this.state.project} type="text" name="project" className="form-control" placeholder="Project Name!" ></input>
          </div>
          <div className="form-group">
            <input onChange={this.handleInputChange} value={this.state.estimate} type="text" name="estimate" className="form-control" placeholder="Estimate" ></input>
          </div>
        </form>
      </div>
    )
  }
})

var Form = React.createClass({
  render: function(){
    var renoCollection = this.props.renoCollection.models
    // console.log(renoCollection);
    var renoCollectionFormset = renoCollection.map(function(reno){
      return(
        <FormInput key={reno.cid} renoCollection={renoCollection} />
      )
    })
    return(
      <div>
        <h2> Renovation Estimate </h2>
        {renoCollectionFormset}
          <button onClick={this.props.addReno} type="button" className="bt btn-success"> Add Renovation</button>
      </div>
    )
  }
})

var RenovationContainer = React.createClass({
  getInitialState: function(){
    // console.log('form:', this.props.state.house.get('objectId'));
    return {
      reno: new Reno(),
      renoCollection: new RenoCollection()
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
    var renoCollection = this.state.renoCollection
    var objectId = this.props.state.house.get('objectId')
    // console.log(objectId);
    renoCollection.set({ objectId })
    renoCollection.fetch().then(function(){
      self.setState({ renoCollection })
    })
  },
  addReno: function(){
    // console.log("addReno:", this.state.renoCollection);
    this.state.renoCollection.add([{}])
    this.setState({ renoCollection: this.state.renoCollection })
  },
  render: function(){
    // console.log(this.state);
    return (
      <div className="form-inline">
        <Form reno={this.state.reno} renoCollection={this.state.renoCollection} addReno={this.addReno} />
      </div>
    )
  }
})

module.exports = {
  RenovationContainer
}
