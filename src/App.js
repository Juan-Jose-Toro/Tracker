import './App.css';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import Interval from './components/Interval';
import ActionButtons from './components/ActionButtons'

function App(props) {
  const [intervals, setIntervals] = useState(props.data);
  const [isStop, setStop] = useState(true);

  function startInterval() {

    const editedIntervals = intervals.map((interval, i, {length}) => {
      if (length - 1 === i) {
        return {...interval, completed: true};
      }
      return interval;
    });

    const newInterval = { completed: false, hasInitialTimer: isStop };
    setIntervals([...editedIntervals, newInterval]);
    setStop(false);
  }

  function stopInterval() {
    const editedIntervals = intervals.map((interval, i, {length}) => {
      if (length - 1 === i) {
        return {...interval, completed: true};
      }
      return interval;
    });
    setIntervals(editedIntervals);
    setStop(true);
  }

  const intervalList = intervals.map((interval) => (
    <Interval 
      id={interval.id}
      key={interval.key}
      completed={interval.completed}
      hasIntialTimer={interval.hasInitialTimer}
    />
  ));

  return (
    <div className="App px-5">
      <h1>Current Date</h1>
      {intervalList}
      <ActionButtons
        startInterval={startInterval}
        stopInterval={stopInterval}
      />
    </div>
  );
}

export default App;
