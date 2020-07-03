import React from 'react';
import { render, cleanup, fireEvent, waitForElement } from '@testing-library/react';
import Counter from './Counter';
import { MockedProvider } from '@apollo/react-testing';
import { GET_COUNTER, GET_CONFIG } from '../state/queries/counterQueries';
import { UPDATE_COUNTER } from '../state/mutations/counterMutation';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

// import * as Injection from '../providers/ioc.react';
// import * as IProvider from '../providers/providers';

// jest.mock('../providers/ioc.react');
// jest.mock('../providers/providers');
let deleteMutationCalled = false;

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
  {
    request: {
      query: UPDATE_COUNTER,
      variables: { offset: 1 },
    },
    result: () => {
      deleteMutationCalled = true;
      return {
        data: {
          counter: 1,
        },
      };
    },
    // error: new Error('aw shucks'),
  },
  {
    request: {
      query: GET_CONFIG,
    },
    result: {
      data: {
        process: 'hello',
      },
    },
  },
];
// const ConfigMocks = [
//   {
//     request: {
//       query: GET_CONFIGS,
//     },
//     result: {
//       data: {
//         process: 'hello',
//       },
//     },
//   },
// ];

describe('Take a snapshot', () => {
  afterEach(cleanup);

  it('should take a snapshot', async () => {
    const promise = Promise.resolve();
    const { asFragment } = render(
      <MockedProvider mocks={CounterMocks} addTypename={false}>
        <Counter />
      </MockedProvider>
    );

    expect(
      asFragment(
        <MockedProvider mocks={CounterMocks} addTypename={false}>
          <Counter />
        </MockedProvider>
      )
    ).toMatchSnapshot();
    await act(() => promise);
  });

  it('increments counter', async () => {
    const promise = Promise.resolve();
    const { getByTestId } = render(
      <MockedProvider mocks={CounterMocks} addTypename={false}>
        <Counter />
      </MockedProvider>
    );
    const greetingData = await waitForElement(() => getByTestId('button-up'));
    // const button = getByTestId('button-up');
    fireEvent.click(getByTestId('button-up'));
    // await wait(3000);
    // button.props.onClick();
    const greetingDataCounter = await waitForElement(() => getByTestId('counter'));
    expect(deleteMutationCalled).toBe(true);
    // expect(greetingDataCounter).toHaveTextContent('1');
    await act(() => promise);
  });
});
