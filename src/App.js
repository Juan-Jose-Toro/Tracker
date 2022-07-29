import './App.css';
import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import Interval from './components/Interval';
import ActionButtons from './components/ActionButtons'

function App() {
  const [intervals, setIntervals] = useState(() => {
    const localData = localStorage.getItem('data');
    return localData ? JSON.parse(localData) : [];
  });
  const [isStop, setStop] = useState(true);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const curDate = new Date().toLocaleDateString('en-US', options);


  function startInterval() {
    const editedIntervals = intervals.map((interval, i, {length}) => {
      if (length - 1 === i) {
        return {...interval, completed: true};
      }
      return interval;
    });

    const newInterval = { 
        id: "interval-" + nanoid(), 
        completed: false, 
        hasInitialTimer: isStop, 
        initialTime: Date.now(),
        currentTime: '',
        description: ''
    };

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

  function updateIntervalData(id, currentTime, description) {
    const editedIntervals = intervals.map(interval => {
      if (interval.id === id) {
        return {...interval, currentTime: currentTime, description: description };
      }
      return interval;
    });
    setIntervals(editedIntervals);
  }

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(intervals));
  }, [intervals]);

  const intervalList = intervals.map((interval) => (
    <Interval 
      id={interval.id}
      key={interval.id}
      completed={interval.completed}
      hasIntialTimer={interval.hasInitialTimer}
      initialTime={interval.initialTime}
      currentTime={interval.currentTime}
      description={interval.description}
      updateIntervalData={updateIntervalData}
    />
  ));

  return (
    <div className="App p-5 max-w-md mx-auto">
      <h1 className='text-xl'>{curDate}</h1>
      {intervalList}
      <ActionButtons
        startInterval={startInterval}
        stopInterval={stopInterval}
      />
    </div>
  );
}

export default App;
