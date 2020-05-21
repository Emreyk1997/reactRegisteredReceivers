import React from 'react'
import { useInjection } from '../providers/ioc.react';
import { IProvider } from '../providers/providers';
import { useQuery, useMutation } from '@apollo/react-hooks';
// import styles from './styles.css'
import { GET_COUNTER } from '../queries';
import { UPDATE_COUNTER } from '../mutations';
import {logger} from '../logger'
// const logger = require('../../index');
// const clientBundler = require('../../config/rollup.config.browser');

// import { logger } from '../../index'
// import {logger} from '../server/index'

export default function CounterFlux() {
  const { data } = useQuery(GET_COUNTER);
  const [, setErrorCatch] = React.useState(null);
  const [increment] = useMutation(UPDATE_COUNTER, { variables: { offset: 1 } })
  const [decrement] = useMutation(UPDATE_COUNTER, { variables: { offset: -1 } })
  const provider = useInjection<IProvider<string>>('nameProvider');
  let newIncrement = () => {
    // console.log('clientBundler', clientBundler);
    // logger.logger('HELLO');
    // logger.log();
    // logger.log();
    logger.info();
    logger.error('error');
    

    increment();
      console.log('data.counter', data.counter)
    //   if(data.counter > 2) {
    //     setErrorCatch(() => {
    //       throw new Error('error');
    //     });
    //  }
    // setErrorCatch(() => {
    //   throw new Error("This is an error");
    // });
  };

  return (
    <div>
      <h1>Counter: {data ? data.counter : 5}</h1>
      <p>Provider:</p>
      <p>{provider.provide()}</p>
      <div className="controllers">
        <button type='button' onClick={() => newIncrement()}>Add</button>
        <button type='button' onClick={() => decrement()}>Remove</button>
      </div>
    </div>
  )
}