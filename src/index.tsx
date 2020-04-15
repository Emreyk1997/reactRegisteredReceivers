import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const GLOBAL_STATE = {}

ReactDOM.hydrate(<App state={'GLOBAL_STATE'}/>, document.getElementById('root'));