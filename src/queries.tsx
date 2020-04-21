// import gql from 'graphql-tag';
// import { useQuery } from '@apollo/react-hooks';

// export const query = gql`
//   query Books {
//     books {
//       title
//       author
//     }
//   }
// `;

// export default () => useQuery(query);

import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';

export const GET_COUNTER = gql`
  query GetCounterValue {
    counter @client
  }
`;

export default () => useQuery(GET_COUNTER);
