var $ = require('jquery');

$.ajaxSetup({
  beforeSend: function(xhr){
    xhr.setRequestHeader("X-Parse-Application-Id", "masterj");
    xhr.setRequestHeader("X-Parse-REST-API-Key", "tennis");
  }
});


var url = 'https://masterj.herokuapp.com/';
var resultPromise = $.ajax(url).then(function(data){
  console.log(data);
});
