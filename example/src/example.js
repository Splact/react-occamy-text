var React = require('react');
var ReactDOM = require('react-dom');
var OccamyText = require('react-occamy-text');

var App = React.createClass({
  render () {
    return (
      <div className="occamy-text-example">
        <div className="box">
          <OccamyText>
            Abra cadabra flipendo, alabif shazam!
          </OccamyText>
        </div>
        <div className="box">
          <OccamyText>
            Macaroni tortellini calamari pasta. Salami broccoli ballerina zucchini fresco, pizza tombola mozzarella fritti tortellini paparazzi.
          </OccamyText>
        </div>
        <div className="box">
          <OccamyText>
            Lightsaber nintendo geth pace Stark darth algorithm jedi.
          </OccamyText>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
