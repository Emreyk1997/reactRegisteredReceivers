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
import { ApolloClient } from 'apollo-client';
import { CounterMutations } from './mutations'

const cache = new InMemoryCache();
const client = new ApolloClient({
   cache,
   resolvers: {
     Mutation: {
      ...CounterMutations
     }
   }
});
const initialState = { counter: 0 };
cache.writeData({ data: initialState });
export default client;