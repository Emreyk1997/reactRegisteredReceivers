// import { HttpLink } from 'apollo-link-http';
// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';

// const httpLink = new HttpLink({
//   uri: 'http://localhost:81',
// });

// export default new ApolloClient({
//   cache: new InMemoryCache(),
//   link: httpLink,
// });

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from '@apollo/client';
import { CounterMutations } from './mutations'

const isServer = typeof window === 'undefined';

console.log('IS SERVER', isServer)
if (!isServer) {
  console.log('WINDOW', window)
}


const cache = isServer ? new InMemoryCache() : new InMemoryCache().restore(window.__REACTREGISTEREDRECEIVERS_INITIAL_STATE__);
const client = new ApolloClient({
   cache,
   resolvers: {
     Mutation: {
      ...CounterMutations
     }
   }
});
const initialState = { counter: 0, configs: '' };
isServer ? cache.writeData({ data: initialState }) : null;
export default client;