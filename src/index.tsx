import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.hydrate(<App state={GLOBAL_STATE}/>, document.getElementById('root'));