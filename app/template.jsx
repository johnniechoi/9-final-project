var React = require('react');


var NavBar = React.createClass({
  render: function(){
    return(
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Foreclosed Homies</a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className="active"><a href="#search/">Search <span className="sr-only">(current)</span></a></li>
              {/*Add for Form for the recipes!*/}
              <li><a href="#recipe/">Saved Houses</a></li>
              {/*see a list of all the great receipes on the API!*/}
              <li><a href="#">Login</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Link</a></li>
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
