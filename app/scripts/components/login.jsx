var React = require('react');
var $ = require('jquery')
var Backbone = require('backbone')
// var Modal = require('react-modal');

var showModal = require('react-bootstrap').showModal;
var Modal = require('react-bootstrap').Modal;


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

const customStyles = {
 content : {
   top                   : '50%',
   left                  : '50%',
   right                 : 'auto',
   bottom                : 'auto',
   marginRight           : '-50%',
   transform             : 'translate(-50%, -50%)',
   width                 : '500px'
 }
};

var SignInContainer = React.createClass({
  getInitialState: function(){
    return {
      user: '',
      password: '',
      showModal: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({showModal: nextProps.modal.showModal});
  },
  close: function() {
    this.setState({showModal: false});
  },
  afterOpenModal: function() {
    // references are now sync'd and can be accessed.
    // this.refs.subtitle.style.color = '#f00';
  },
  open: function(e) {
    this.setState({showModal: true});
    // localStorage.setItem('loggedIn', this.state.username);
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
    this.setState({user: '', password: '', modalIsOpen: false})
    // this.props.modalClose()
    Backbone.history.navigate('#search/', {trigger: true});
  },
  render: function(){
    console.log(this.state);
    return(
      <Modal
        show={this.state.showModal}
        onHide={this.close}>
      <Modal.Body>
        <div className="half-black">
          <div className="modal-body">
            <div className="body-modal">
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
      </Modal.Body>
     </Modal>
    )
  }
})

var LoginContainer = React.createClass({
  getInitialState: function(){
    return {showModal: false}
  },
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
    Backbone.history.navigate('search/', {trigger: true});
  },
  handleClick: function(){
    this.setState({showModal: true});
  },
  modalClose: function(){
    this.setState({showModal: false})
  },
  render: function(){
    console.log(this.state);
    return(
      <div className="container">
        <div className="col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6 half-black login-form">
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
            <div>
              <button className="btn btn-primary" type="submit" value="Beam Me Up!">Beam Me Up!</button>
              <a className="signin-text" onClick={this.handleClick}> Don't have a login? Sign up here. </a>
            </div>
          </form>
        </div>
        <SignInContainer newUser={this.props.newUser} modal={this.state} modalClose={this.modalClose} />
      </div>
    )
  }
})

var AccountContainer = React.createClass({
  getInitialState: function(){
    return {
      user: new User(),
    }
  },
  newUser: function(user, password){
    this.state.user.set({username: user, password: password});
    console.log(this.state.user.attributes.password);
    var username = this.state.user.attributes.username
    var passward = this.state.user.attributes.password
    // user and signUp() is from the user.js model for connecting with the server.
    this.state.user.signUp(function(){
      $.get('https://masterj.herokuapp.com/login?username=' + username + '&password=' + password).then(function(response){
        localStorage.setItem('username', response.username);
        localStorage.setItem('token', response.sessionToken);
        localStorage.setItem('objectId', response.objectId);
      });
    })
  },
  loginRequests: function(accountInfo){
    this.setState({ accountInfo })
    var username = accountInfo.user;
    var password = accountInfo.password;
    $.get('https://masterj.herokuapp.com/login?username=' + username + '&password=' + password).then(function(response){
      localStorage.setItem('username', response.username);
      localStorage.setItem('token', response.sessionToken);
      localStorage.setItem('objectId', response.objectId);


//how do I get to the recipe page when logged in? Received the sessionToken?
        if (response.sessionToken) {
          self.props.router.navigate('#search/', {trigger: true});
        };
      });
    },
  render: function(){
    return(
      <div className="background-image">
        <NavBar/>
        <div className="row">
          <div className="col-md-12 scene_element scene_element--fadein">
            <LoginContainer newUser={this.newUser} loginRequests={this.loginRequests}/>
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
