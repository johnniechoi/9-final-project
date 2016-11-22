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
  save: function(key, val, options){
    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;
    return Backbone.Model.prototype.save.apply(this, arguments);
  }
});

var ParseCollection = Backbone.Collection.extend({
  whereClause: {},
  parse: function(data){
    return data.results;
  },
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

    this.whereClause[field] = value;
    return this;
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

var Reno = ParseModel.extend({
  defaults:{
    project: '',
    estimate: 0,
    notes: ''
  },
  urlRoot: 'https://masterj.herokuapp.com/classes/houseRenovation',
  // parse: function(data){
  //   return data.results
  // }
})

var RenoCollection = ParseCollection.extend({
  model: Reno,
  baseUrl: 'https://masterj.herokuapp.com/classes/houseRenovation',
  parse: function(data){
    return data.results
  }
})
module.exports = {
  House,
  HouseCollection,
  Reno,
  RenoCollection,
  ParseModel
}
