import React from 'react';

export default function ActionButtons(props) {
  return (
    <div className='flex justify-between'>
      <button onClick={() => props.startInterval()}> Start </button>
      <button onClick={() => props.stopInterval()}> Stop </button>
    </div>
  );
}