import React, { Component } from 'react';

import OccamyText from 'react-occamy-text';

export default class App extends Component {
  render () {
    return (
      <div className="container">
        <h1>Occamy Text</h1>
        <h2><a href="https://github.com/splact/react-occamy-text">View project on GitHub</a></h2>

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

        <div className="hint">
          Text automatically sized to fit its parent.
        </div>
        <div className="footer">
          Copyright &copy; 2018 Dario Carella.
        </div>
      </div>
    );
  }
}
