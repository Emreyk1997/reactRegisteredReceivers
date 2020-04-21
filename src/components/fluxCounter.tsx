import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks';
// import styles from './styles.css'
import { GET_COUNTER } from '../queries';
import { UPDATE_COUNTER } from '../mutations';

export default function CounterFlux() {
  const { data } = useQuery(GET_COUNTER);
  const [increment] = useMutation(UPDATE_COUNTER, { variables: { offset: 1 } })
  const [decrement] = useMutation(UPDATE_COUNTER, { variables: { offset: -1 } })

  return (
    <div>
      <h1>Counter: {data.counter}</h1>
      <div className="controllers">
        <button type='button' onClick={() => increment()}>Add</button>
        <button type='button' onClick={() => decrement()}>Remove</button>
      </div>
    </div>
  )
}