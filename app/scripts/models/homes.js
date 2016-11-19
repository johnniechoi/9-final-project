var React = require('react')
var Reactdom = require('react-dom')
var Backbone = require('backbone')

var House = Backbone.Model.extend({
  idAttribute: 'objectId',
  urlRoot: 'https://masterj.herokuapp.com/classes/foreclosedData'
})

var HouseCollection = Backbone.Collection.extend({
  Model: House,
  url: 'https://masterj.herokuapp.com/classes/foreclosedData',
  parse: function(data){
    return data.results
  }
})

var Reno = Backbone.Model.extend({
  defaults:{
    project: '',
    estimate: 0
  },
  idAttrebute: 'objectId',
  urlRoot: 'https://masterj.herokuapp.com/classes/houseRenovation'
})

var RenoCollection = Backbone.Collection.extend({
  model: Reno,
  url: 'https://masterj.herokuapp.com/classes/houseRenovation',
  parse: function(data){
    return data.results
  }
})
module.exports = {
  House,
  HouseCollection,
  Reno,
  RenoCollection
}
