import React, { useState, useEffect } from 'react';
import MultiSelect from 'react-multi-select-component';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-right: 100px;
`;

const LoggerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const SubTitle = styled.span`
  font-size: 16px;
  margin-right: 20px;
  width: 50px;
  text-align: left;
`;

const Input = styled.input`
  width: 200px;
  height: 30px;
  border: 1 solid #cccccc;
`;

const Button = styled.button`
  width: 150px;
  height: 30px;
  background-color: green;
  border: none;
  border-radius: 5px;
  text-color: white;
`;

const SearchLog: React.SFC = () => {
  const options = [
    { label: 'Info', value: 'info' },
    { label: 'Warn', value: 'warn' },
    { label: 'Error', value: 'error' },
  ];
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState([]);
  const [logsInfo, setLogsInfo] = useState({ message: null, level: null, date: null });
  const [allLogs, changeLogs] = useState('');

  const submit = () => {
    setLogsInfo({
      message: message === '' ? null : message,
      level: selected.length === 0 ? null : selected.map((item)=> item.value),
      date: date === '' ? null : date,
    });
    // console.log(logsInfo);
  };
  const getLogs = () => {
    fetch('http://localhost:81/getLogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logsInfo),
    }).then((data) => data.text().then((textData) => changeLogs(textData)))
    // console.log('Logs1', log.text());
    // return log;
  }

  useEffect(() => {
    getLogs();
    // console.log('Logs', logs);
  },[logsInfo]);


  return (
    <Container>
      <SubContainer>
        <h1>Log Search</h1>
        <LoggerContainer>
          <SubTitle>Message: </SubTitle>
          <Input type="text" onChange={(event) => setMessage(event.target.value)} />
        </LoggerContainer>
        <LoggerContainer>
          <SubTitle>Level: </SubTitle>
          <MultiSelect
            options={options}
            disableSearch={true}
            value={selected}
            onChange={setSelected}
            labelledBy={'Select'}
          />
        </LoggerContainer>
        <LoggerContainer>
          <SubTitle>Date: </SubTitle>
          <Input
            placeholder="DD/MM/YYYY"
            type="date"
            max="2200-12-31"
            onChange={(event) => {
              const year = event.target.value.substring(0, 4);
              const month = event.target.value.substring(5, 7);
              const day = event.target.value.substring(8, 10);
              setDate(month + '/' + day + '/' + year);
            }}
          />
        </LoggerContainer>
        <Button type="button" onClick={() => submit()}>
          Submit
        </Button>
        <p>{allLogs}</p>
      </SubContainer>
      <SubContainer>LOGSS</SubContainer>
    </Container>
  );
};

export default SearchLog;
