import Home from './Home'
import Grid from './Grid'

import { fetchPopularRepos } from './api'
import Counter from '../components/counter'
import {CounterView} from '../counterView';
import {CounterViewModel} from '../counterViewModel';

const model = new CounterViewModel();

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/popular/:id',
    component: Grid,
    fetchInitialData: (path = '') => fetchPopularRepos(path.split('/').pop())
  }, {
    path: '/counter',
    component: Counter,
    exact: true

  },
  {
    path: '/counterMVVM',
    component: CounterView,
    model:model,
    exact: true

  }
]

export default routes