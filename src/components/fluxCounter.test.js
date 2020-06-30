import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CounterFlux from './fluxCounter';
import { MockedProvider } from '@apollo/react-testing';
import { GET_COUNTER, GET_CONFIGS } from '../queries';
import { act } from 'react-dom/test-utils';

const CounterMocks = [
  {
    request: {
      query: GET_COUNTER,
    },
    result: {
      data: {
        counter: 0,
      },
    },
  },
];
const ConfigMocks = [
  {
    request: {
      query: GET_CONFIGS,
    },
    result: {
      data: {
        configs: 'hello',
      },
    },
  },
];

describe('Take a snapshot', () => {
  afterEach(cleanup);

  it('should take a snapshot', async () => {
    const promise = Promise.resolve();
    const { asFragment } = render(
      <MockedProvider mocks={CounterMocks} addTypename={false}>
        <CounterFlux />
      </MockedProvider>
    );

    // expect(
    //   asFragment(
    //     <MockedProvider mocks={CounterMocks} addTypename={false}>
    //       <CounterFlux />
    //     </MockedProvider>
    //   )
    // ).toMatchSnapshot();
    await act(() => promise);
  });
});
