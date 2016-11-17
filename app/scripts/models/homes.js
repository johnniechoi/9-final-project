var React = require('react')
var Reactdom = require('react-dom')
var Backbone = require('backbone')

var House = Backbone.Model.extend({
  idAttribute: 'objectId',
  urlRoot: 'https://masterj.herokuapp.com/classes/foreclosedData'
})

var HouseCollection = Backbone.Collection.extend({
  model: House,
  url: 'https://masterj.herokuapp.com/classes/foreclosedData',
  parse: function(data){
    return data.results
  }
})

module.exports = {
  House,
  HouseCollection
}
