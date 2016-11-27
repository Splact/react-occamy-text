var React = require('react');
var ReactDOM = require('react-dom');
var OccamyText = require('react-occamy-text');

var App = React.createClass({
  render () {
    return (
      <div>
        <OccamyText>
          Macaroni tortellini calamari pasta. Salami broccoli ballerina ballerina zucchini tortellini fresco, pizza tombola pizza mozzarella fritti tortellini paparazzi.
        </OccamyText>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
