import React from 'react'

export default function CalendarButtons(props) {
  return (
    <div>
      <button className='mr-3' onClick={() => props.loadPreviousDay()}>Yesterday</button>
      <button onClick={() => props.loadNextDay()}>Tomorrow</button>
    </div>
  );
}