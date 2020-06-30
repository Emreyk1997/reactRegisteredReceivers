import 'reflect-metadata';
import React from 'react'
import { Route, Switch } from 'react-router-dom';

import { container } from '../providers/ioc';
import { Provider } from '../providers/ioc.react';


import apolloClient from '../store';
import { ApolloProvider } from '@apollo/client';

import routes from './routes'
import Navbar from './Navbar'
import NoMatch from './NoMatch'
import ErrorBoundary from './errorBoundary'
import ClassCounter from '../components/classCounter'

const App = props => (
  <>
  <Provider container={container}>
    <ApolloProvider client={apolloClient}>
    <ErrorBoundary>
          {/* <ClassCounter/> */}
      
        <Navbar />

        <Switch>
          {routes.map(({ path, exact, component: Component, ...rest }) => (
            <Route key={path} path={path} exact={exact} render={props => <Component {...props} {...rest} />} />
          ))}
          <Route render={props => <NoMatch {...props} />} />
        </Switch>
    </ErrorBoundary>

      </ApolloProvider>
    </Provider>
  </>
)

export default App