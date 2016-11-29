var React = require('react');


var NavBar = React.createClass({
  render: function(){
    return(
      <nav className="navbar navbar-default bg-faded">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">FlipClosed</a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className=""><a href="#search/">Find</a></li>
              {/*Add for Form for the recipes!*/}
              <li><a href="#saved/">Saved Houses</a></li>
              {/*see a list of all the great receipes on the API!*/}
              <li><a href="#">Login</a></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
})

module.exports = {
  NavBar
}
