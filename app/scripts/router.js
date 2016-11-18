var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery')

var AccountContainer = require('./components/login.jsx').AccountContainer;
var SearchPage = require('./components/search.jsx').SearchPage;
var DetailsPage = require('./components/details.jsx').DetailsPage;

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'login/': 'login',
    'search/': 'search',
    'details/:id/': 'details'
  },

  index: function(){
    ReactDOM.render(
      React.createElement(AccountContainer),
      document.getElementById('app')
    )
  },
  search: function(){
    ReactDOM.render(
      React.createElement(SearchPage),
      document.getElementById('app')
    )
  },
  details: function(objectId){
    ReactDOM.render(
      React.createElement(DetailsPage, {objectId: objectId}),
      document.getElementById('app')
    )
  }
})

var router = new AppRouter();

module.exports = {
  router
}
