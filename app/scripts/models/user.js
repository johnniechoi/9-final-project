var Backbone = require('backbone');

var User = Backbone.Model.extend({
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
