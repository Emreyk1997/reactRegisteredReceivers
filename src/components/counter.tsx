import React, { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  padding: 4em;
  background: blue;
  color: white;
`;

const Counter = () => {
    const [counter, setCounter] = useState(0);
  return (
      <div>
          <Wrapper>
          <p>{counter}</p>
          <button type='button' onClick={() => {setCounter(counter + 1); console.log('COUNT', counter)}}>+</button>
          <button type='button' onClick={() => setCounter(counter - 1)}>-</button>
          </Wrapper>
      </div>
  );
}

export default Counter;
