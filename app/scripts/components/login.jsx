var React = require('react');
var $ = require('jquery')

var User = require('../models/user.js').User;
var NavBar = require('../../template.jsx').NavBar;

require('../models/login.js')

var response = function setHeader(response){
  $.ajaxSetup({
    beforeSend: function(xhr){
      xhr.setRequestHeader("X-Parse-Application-Id", "masterj");
      xhr.setRequestHeader("X-Parse-REST-API-Key", "tennis");
      xhr.setRequestHeader("X-Parse-Session-Token", response.sessionToken)
    }
  });
}

  // console.log(localStorage.user);

var SignInContainer = React.createClass({
  getInitialState: function(){
    return {
      user: '',
      password: ''
    }
  },
  handleSignIn: function(e){
    this.setState({user: e.target.value});
  },
  handlePassword: function(e){
    this.setState({password: e.target.value});
  },
  handleLogin: function(e){
    e.preventDefault();
    var user =  this.state.user;
    var password = this.state.password;
    this.props.newUser(user, password);
    this.setState({user: '', password: ''})
    // console.log(user, password);
  },
  render: function(){
    return(
      <div>
        <div className="">
          <div className="col-md-6">
            <h2>Register</h2>
            <form onSubmit={this.handleLogin} id="signup">
              <div className="form-group">
                <label htmlFor="text">User Name</label>
                <input onChange={this.handleSignIn} value={this.state.user} className="form-control" name="name" id="email" type="text" placeholder="peterdoe" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input onChange={this.handlePassword} value={this.state.password} className="form-control" name="password" id="password" type="password" placeholder="Password " />
              </div>
              <input className="btn btn-primary" type="submit" value="Sign Up" />
            </form>
          </div>
        </div>
      </div>
    )
  }
})

var LoginContainer = React.createClass({
  handleSignIn: function(e){
    this.setState({user: e.target.value});
  },
  handlePassword: function(e){
    this.setState({password: e.target.value});
  },
  handleLogin: function(e){
    e.preventDefault();
    var accountInfo = {
      user: this.state.user,
      password: this.state.password
    };
    this.props.loginRequests(accountInfo)
    this.setState({user: '', password: ''});
  },
  render: function(){
    return(
      <div className="">
        <div className="col-md-6">
          <h2>Login</h2>
          <form onSubmit={this.handleLogin} id="login">
            <div className="form-group">
              <label htmlFor="text">Email address</label>
              <input onChange={this.handleSignIn} className="form-control" name="email" id="email-login" type="text" placeholder="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password-login">Password</label>
              <input onChange={this.handlePassword} className="form-control" name="password" id="password-login" type="password" placeholder="Password Please" />
            </div>
            <input className="btn btn-primary" type="submit" value="Beam Me Up!" />
          </form>
        </div>
      </div>
    )
  }
})

var AccountContainer = React.createClass({
  getInitialState: function(){
    return {
      user: new User()
    }
  },
  newUser: function(user, password){
    this.state.user.set({username: user, password: password});
    // user and signUp() is from the user.js model for connecting with the server.
    this.state.user.signUp();
  },
  loginRequests: function(accountInfo){
    this.setState({ accountInfo })
    var username = accountInfo.user;
    var password = accountInfo.password;
    $.get('https://masterj.herokuapp.com/login?username=' + username + '&password=' + password).then(function(response){
        console.log(response.username);
        console.log(response.sessionToken);
        console.log(response);
        localStorage.setItem('username', response.username);
        localStorage.setItem('token', response.sessionToken);

//how do I get to the recipe page when logged in? Received the sessionToken?
        // if (response.sessionToken) {
        //   self.props.router.navigate('', {trigger: true});
        // };
      });
    },
  render: function(){
    return(
      <div className="">
        <div className="row">
          <div className="col-md-12 ">
            <NavBar/>
            <LoginContainer loginRequests={this.loginRequests}/>
            <SignInContainer newUser={this.newUser}/>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = {
  AccountContainer: AccountContainer
  // LoginForm
}
