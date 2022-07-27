import './App.css';
import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import Interval from './components/Interval';

function App(props) {
  const [intervals, setIntervals] = useState(props.data);
  const [isStop, setStop] = useState(true);

  const intervalList = intervals.map((interval) => (
    <Interval 
      // id={interval.id}
      // key={interval.key}
      completed={interval.completed}
    />
  ));

  return (
    <div className="App px-5">
      <h1>Current Date</h1>
      {intervalList}
    </div>
  );
}

export default App;
