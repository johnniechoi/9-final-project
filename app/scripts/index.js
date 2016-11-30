var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Backbone = require('backbone');
var router = require('./router');
var $ = window.jQuery = window.$ = require('jquery');
require('bootstrap-sass/assets/javascripts/bootstrap.min.js');



$(function(){
  Backbone.history.start();
});

// $.ajax('https://greenville-foreclosure.herokuapp.com/api').then(function(data){
//   console.log('this is working!', data);
// })

// $.ajax('http://localhost:3000').then(function(data){
//   console.log('this is working!', data);
// });
