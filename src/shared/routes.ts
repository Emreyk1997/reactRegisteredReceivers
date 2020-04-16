import Home from './Home'
import Grid from './Grid'

import { fetchPopularRepos } from './api'
import Counter from '../components/counter'

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

  }
]

export default routes