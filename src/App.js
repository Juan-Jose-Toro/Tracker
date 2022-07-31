import './App.css';
import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import Interval from './components/Interval';
import ActionButtons from './components/ActionButtons'
import CalendarButtons from './components/CalendarButtons'

function App() {
  const [curDate, setCurDate] = useState(new Date()); // Change to reflex the current selected date or else it will reset to current date on reload
  const [intervals, setIntervals] = useState(() => {
    const localData = localStorage.getItem(curDate.toLocaleDateString('en-US')); // encapsulate in function
    return JSON.parse(localData || '[]');
  });
  const [isStop, setStop] = useState(() => {
    const localIsStop = localStorage.getItem('isStop');
    return JSON.parse(localIsStop || 'true');
  });
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


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

  function clearIntervals() {
    setIntervals([]);
    setStop(true);
  }

  // date is epoch in ms and returns epoch in ms
  function getYesterdayDate(date) {
    return new Date(new Date(date).getTime() - 24*60*60*1000);
  }

  function getTomorrowDate(date) {
    return new Date(new Date(date).getTime() + 24*60*60*1000);
  }

  function loadPreviousDay() {
    // Save current state
    localStorage.setItem(curDate.toLocaleDateString('en-US'), JSON.stringify(intervals));
    localStorage.setItem('isStop', JSON.stringify(isStop));

    setCurDate(getYesterdayDate(curDate));
  }

  function loadNextDay() {
    // Save current state
    localStorage.setItem(curDate.toLocaleDateString('en-US'), JSON.stringify(intervals));
    localStorage.setItem('isStop', JSON.stringify(isStop));

    setCurDate(getTomorrowDate(curDate));
  }

  useEffect(() => {
      const localData = localStorage.getItem(curDate.toLocaleDateString('en-US'));
      setIntervals(JSON.parse(localData || '[]'));
  }, [curDate]);

  useEffect(() => {
    localStorage.setItem(curDate.toLocaleDateString('en-US'), JSON.stringify(intervals));
    localStorage.setItem('isStop', JSON.stringify(isStop));
  }, [intervals, isStop]); // Could split



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
      <h1 className='text-xl'>{curDate.toLocaleDateString('en-US', options)}</h1>
      <CalendarButtons
        loadPreviousDay={loadPreviousDay}
        loadNextDay={loadNextDay}
      />
      {intervalList}
      <ActionButtons
        startInterval={startInterval}
        stopInterval={stopInterval}
        clearIntervals={clearIntervals}
      />
    </div>
  );
}

export default App;
