var $ = require('jquery');
var React = require('react');
var Backbone = require('backbone');

var NavBar = require('../../template.jsx').NavBar;
var House = require('../models/homes.js').House;
var Reno = require('../models/homes.js').Reno;
var RenoCollection = require('../models/homes.js').RenoCollection;

var FormInput = React.createClass({
  getInitialState: function(){
    // console.log('form:', this.props.reno.toJSON())
    return this.props.reno.toJSON()
  },
  componentWillReceiveProps: function(newProps){
    // console.log('newprops', newProps.reno.toJSON());
    this.setState(newProps.reno.toJSON())
  },
  handleInputChange: function(e){
    var renoField = e.target;
    var newState = {};
    newState[renoField.name] = renoField.value;
    // console.log('handleinputchange:', this.props.reno);
    // console.log(renoField.name,':', renoField.value);
    this.setState(newState);
    this.props.reno.set(renoField.name, renoField.value)
    // console.log('props:', this.props.renoCollection)
  },
  render: function(){
    // console.log(this.props);
    var renoCollection = this.props.renoCollection
    // console.log('renoColelction:', renoCollection);
    return (
      <div>
        <div className="form-group">
          <input onChange={this.handleInputChange} value={this.state.project} type="text" name="project" id="project" className="form-control" placeholder="Project Name!" ></input>
        </div>
        <div className="form-group">
          <input onChange={this.handleInputChange} value={this.state.estimate} type="text" name="estimate" id='estimate' className="form-control" placeholder="Estimate" ></input>
        </div>
      </div>
    )
  }
})

var Form = React.createClass({
  getInitialState: function(){
    // console.log('form:', this.props.reno.toJSON())
    return this.props.reno.toJSON()
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.props.saveReno(this.props)
    console.log("handleSubmit:", this.props, this.state);
  },
  handleTextArea: function(e){
    var notes = e.target.value;
    this.setState({notes: notes});
    console.log('state', this.state)
  },
  render: function(){
    var renoCollection = this.props.renoCollection.models
    var formProps = this.props
    // console.log('renocollection:', renoCollection);
    var renoCollectionFormset = renoCollection.map(function(reno){
      return(
        <FormInput key={reno.cid} reno={reno} renoCollection={renoCollection} formProps={formProps}/>
      )
    })
    return(
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="col-md-5">
            <h3> Renovation Estimate </h3>
            {renoCollectionFormset}
            <button onClick={this.props.addReno} type="button" className="btn btn-success"> Add Renovation</button>
          </div>
          <div className="col-md-7">
            <h3>Notes</h3>
            <input onChange={this.handleTextArea} name="notes" value={this.state.notes} className="form-control textarea" rows="3" type="text" placeholder="This house is great!" ></input>
            <button type='submit' className="btn btn-alert">Save Renovation</button>
          </div>
        </form>
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
    // console.log('objectId:', objectId);
    // renoCollection.set({ objectId });
    // console.log('localStorage', localStorage);
    renoCollection
      .parseWhere('user', '_User', localStorage.getItem('objectId'))
      .parseWhere('house', 'foreclosedData', objectId)
      .fetch().then(function(){
        // console.log(renoCollection.length);
        if (renoCollection.length == 0){
          return
        }
        self.setState({ renoCollection })
      // renoCollectionfetch().then(function(response){
      //   console.log('inside forclosedData', response);
      //
      // })
      // self.setState({ renoCollection })
    });
    // console.log(this.state);
  },
  addReno: function(){
    // console.log("addReno:", this.state.renoCollection);
    this.state.renoCollection.add({
      house: {
        '__type': 'Pointer',
        className: 'foreclosedData',
        objectId: this.props.state.house.get('objectId')
      },
      user: {
        '__type': 'Pointer',
        className: '_User',
        objectId: localStorage.objectId
      }
    })
    this.setState({ renoCollection: this.state.renoCollection })
    console.log('addReno', this.state);
  },
  saveReno: function(renoData){
    var self = this
    var reno = this.state.renoCollection;
    console.log('renoData:', renoData);
    console.log('state:', reno);

    // this.state.renoCollection.each(function (reno) {
    //   reno.set('estimate', parseInt(reno.get('estimate')))
    //   reno.save()
    // })
    // alert('Data saved!')

    // .then(() => {
    //   Backbone.history.navigate('/details/' + his.props.state.house.get('objectId') + "/", {trigger: true});
    // });
  },
  render: function(){
    // console.log(this.state);
    return (
      <div className="form-inline container well">
        <Form reno={this.state.reno} renoCollection={this.state.renoCollection} addReno={this.addReno} saveReno={this.saveReno} />
      </div>
    )
  }
})

module.exports = {
  RenovationContainer
}
