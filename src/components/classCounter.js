import React from 'react';
// import { loggers } from 'winston';
// const path = require('path');
// var clientBundler = require(path.resolve( __dirname, './config/rollup.config.browser'));

class ClassCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
  }

  newIncrement() {
    fetch('http://localhost:81/logger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: 'Hello' }),
    });
    // logger.logger('HELLO');
    // console.log(path.resolve(__dirname, './config/rollup.config.browser'));
    // this.setState(() => {
    //   throw new Error('HELLO');
    // });
  }

  render() {
    // if (this.state.counter == 2) {
    // }
    // You can render any custom fallback UI
    return (
      <div>
        <p>Counter:</p>
        <p>{this.state.counter}</p>
        <button type="button" onClick={() => this.newIncrement()}>
          Add
        </button>
      </div>
    );
  }
}

export default ClassCounter;
