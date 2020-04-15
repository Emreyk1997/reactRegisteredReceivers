import React from 'react'
import styled from 'styled-components'
import Counter from './components/counter'

const Wrapper = styled.section`
  padding: 4em;
  background: black;
  color: white;
`;

const App = ({state}) => {
  return (
    <div>
      <Wrapper>It, work styled component5</Wrapper>
      {/* <Counter /> */}
    </div>
  )
}

export default App;
