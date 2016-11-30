var React = require('react');
var Navbar = require('react-bootstrap').Navbar
var NavItem = require('react-bootstrap').NavItem
var NavDropdown = require('react-bootstrap').NavDropdown
var MenuItem = require('react-bootstrap').MenuItem
var Nav = require('react-bootstrap').Nav

var NavBar = React.createClass({
  render: function(){
    return(
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a className="navbar-brand" href="#"><strong>Flip</strong><span id="closed">Closed</span></a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#search/">Seach Home</NavItem>
            <NavItem eventKey={2} href="#saved/">Saved Houses</NavItem>
            <NavItem eventKey={2} href="#">Login</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
})

module.exports = {
  NavBar
}
