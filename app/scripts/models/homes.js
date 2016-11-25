var React = require('react')
var Reactdom = require('react-dom')
var Backbone = require('backbone')


var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',
  toPointer: function(className, objectId){
    var pointerObject = {
      '__type': 'Pointer',
      className: className,
      objectId: objectId
    };
    return pointerObject;
  },
  whereClause: {},
  parseWhere: function(field, value, objectId){
    // If the third argument is pass in then treat this as a pointer where
    if(objectId){
      var className = value;
      value = {
        '__type': 'Pointer',
        className: className,
        objectId: objectId
      };
    }
    // console.log('parsewhre', field);
    this.whereClause[field] = value;
    return this;
  },
  save: function(key, val, options){
    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;
    return Backbone.Model.prototype.save.apply(this, arguments);
  }
});

var ParseCollection = Backbone.Collection.extend({
  parse: function(data){
    return data.results;
  },
  url: function(){
    var url = this.baseUrl;

    if(Object.keys(this.whereClause).length != 0){
      url += '?where=' + JSON.stringify(this.whereClause);
      this.whereClause = {};
    }
    return url;
  }
});

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

var Estimate = ParseModel.extend({
  defaults: {
    project: '',
    estimateCost: ''
  }
})

var EstimateCollection = ParseCollection.extend({
  model: Estimate,
  // baseUrl: 'https://masterj.herokuapp.com/classes/houseRenovation',
  // parse: function(data){
  //   console.log('estimateCollection', data);
  //   return data.results
  // }
})

var Renovation = ParseModel.extend({
  defaults: {
    estimate: new EstimateCollection(),
    notes: '',
    photo: ''
  },
  url: 'https://masterj.herokuapp.com/classes/houseRenovation',
  save: function(key, val, options){
    // Convert estimate collection to array for parse
    // console.log('inside renovation Model', this.get('estimate').toJSON());
    this.set('estimate', this.get('estimate').toJSON());
    return ParseModel.prototype.save.apply(this, arguments);
  },
  parse: function(data){
  // Convert estimate array from parse to collection
  // console.log(data);
  var estimate = this.set('estimate', new EstimateCollection(data.results[0].estimate))
  console.log('renovation model', data.results[0].estimate);
  console.log('renovation model index', data.results);
  // this.set('estimate', new EstimateCollection(data.results.estimate));
  return data.results
  }
})

var RenovationCollection = ParseCollection.extend({
  model: Renovation,
  baseUrl: 'https://masterj.herokuapp.com/classes/houseRenovation',
  // parse: function(data){
  //   return data.results
  // }
})

module.exports = {
  House,
  HouseCollection,
  Estimate,
  EstimateCollection,
  Renovation,
  RenovationCollection,
  ParseModel
}
