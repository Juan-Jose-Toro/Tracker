import React, { useState, useEffect } from 'react';

export default function Interval(props) {
  // There should be an easier way to start all this info
  const [initialTime] = useState(new Date(props.initialTime));
  const [description, setDescription] = useState(props.description);
  const [currentTime, setCurrentTime] = useState(props.currentTime ? new Date(props.currentTime) : new Date());
  const [enlapsedTimeString, setEnlapsedTimeString] = useState(() => {
    // Intial state of enlapsedTimeString is calculated using epoch
    // [] Change implementation so that we only worry about display xHxM on the div
    const newTime = (props.currentTime ? new Date(props.currentTime) : new Date());   // Fix
    const currentTime = newTime - initialTime;
    const minutes = Math.floor(currentTime / 60000 % 60);
    const hours = Math.floor(currentTime / 3600000);
    return `${hours}h${minutes}m`;
  });
  const [height, setHeight] = useState(calculateHeight());

  function handleChange(e) {
    setDescription(e.target.value);
  }

  function calculateHeight() {
    const newTime = (props.currentTime ? new Date(props.currentTime) : new Date());
    const currentTime = newTime - initialTime;
    const height = Math.floor(currentTime / 1000);
    return height;
  }

  useEffect(() => {
    if (!props.completed) {
      const myInterval = setInterval(() => {
        const newTime = new Date();
        setCurrentTime(newTime);
        setHeight(height + 1);

        const currentTime = newTime - initialTime;
        const minutes = Math.floor(currentTime / 60000 % 60);
        const hours = Math.floor(currentTime / 3600000);
        setEnlapsedTimeString(`${hours}h${minutes}m`);
      }, 1000);
      return () => clearInterval(myInterval);
    }
  });

  useEffect(() => {
    props.updateIntervalData(props.id, currentTime.getTime(), description);
  }, [props.completed, description, currentTime]) // Fix

  return (
    <div>
      {props.hasIntialTimer ? initialTime.toLocaleTimeString('en-GB') : ''}
      <div
        className='bg-black text-white rounded-md flex justify-between py-3 px-4'
        style={{height: `${Math.floor(height/60) + 50}px`}}
      >
        <textarea
          className='bg-black text-white w-full mr-5 overflow-auto no-scrollbar outline-none resize-none'
          onChange={handleChange}
          placeholder="Activity"
          value={description}
        />
        {enlapsedTimeString}
      </div>
      {currentTime.toLocaleTimeString('en-GB')}
    </div>
  );
}