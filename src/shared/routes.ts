import Home from './Home'
import Grid from './Grid'

import { fetchPopularRepos } from './api'
import Counter from '../components/counter'
import CounterFlux from '../components/fluxCounter'


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

  }, {
    path: '/counterFlux',
    component: CounterFlux,
    exact: true

  }
]

export default routes