import React, { useState, useEffect } from 'react';

export default function Interval(props) {
  const [initialTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date())
  const [enlapsedTimeString, setEnlapsedTimeString] = useState('0h0m');
  const [height, setHeight] = useState(0);

  function handleChange(e) {
    setDescription(e.target.value);
  }

  useEffect(() => {
    if (!props.completed) {
      const myInterval = setInterval(() => {
        const newTime = new Date();
        setCurrentTime(newTime);
        setHeight(height + 1);

        const currentTime = newTime - initialTime;
        const minutes = Math.floor(currentTime / 60000);
        const hours = Math.floor(currentTime / 3600000);
        setEnlapsedTimeString(`${hours}h${minutes}m`);
      }, 1000);
      return () => clearInterval(myInterval);
    }
  });

  return (
    <div>
      {initialTime.toLocaleTimeString('en-GB')}
      <div
        className='bg-black text-white rounded-md flex justify-between p-4'
        style={{height: `${Math.floor(height/4) + 60}px`}}
      >
        <div
          className='bg-black text-white w-full mr-5 overflow-auto no-scrollbar outline-none'
          contentEditable="true"
          onChange={handleChange}
          value={description}
          placeholder="Activity"
        >
        </div>
        {enlapsedTimeString}
      </div>
      {currentTime.toLocaleTimeString('en-GB')}
    </div>
  );
}