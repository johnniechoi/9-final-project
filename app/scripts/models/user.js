var Backbone = require('backbone');

var ParseModel = require('./homes.js').ParseModel;

var User = ParseModel.extend({
  urlRoot: 'https://masterj.herokuapp.com/users',
  signUp: function(callback){
      var self = this;
      this.save().then(function(data){
      localStorage.setItem('user', JSON.stringify(self.toJSON()));
      callback()
    })
  }
})

module.exports = {
  User: User
};
