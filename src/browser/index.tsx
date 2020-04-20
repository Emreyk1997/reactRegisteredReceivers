import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import {CounterViewModel} from '../counterViewModel';


import App from '../shared/App'

const model = new CounterViewModel();


hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)