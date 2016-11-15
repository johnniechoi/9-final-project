var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery')

var AccountContainer = require('./components/login.jsx').AccountContainer;


var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'login/': 'login',
  },

  index: function(){
    ReactDOM.render(
      React.createElement(AccountContainer),
      document.getElementById('app')
    )
  },
})

var router = new AppRouter();

module.exports = {
  router
}
