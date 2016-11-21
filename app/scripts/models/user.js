var Backbone = require('backbone');

var ParseModel = require('./homes.js').ParseModel;

var User = ParseModel.extend({
  urlRoot: 'https://masterj.herokuapp.com/users',
  signUp: function(){
      var self = this;
      this.save().then(function(data){
      localStorage.setItem('user', JSON.stringify(self.toJSON()))
    })
  }
})

module.exports = {
  User: User
};
