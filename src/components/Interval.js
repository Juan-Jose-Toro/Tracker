import React, { useState, useEffect } from "react";

import { ImCross } from "react-icons/im";

import { IconContext } from "react-icons";

import { useSelector } from "react-redux";

export default function Interval(props) {
  // There should be an easier way to start all this info
  const [initialTime] = useState(new Date(props.initialTime));
  const [description, setDescription] = useState(props.description);
  const [currentTime, setCurrentTime] = useState(
    props.currentTime ? new Date(props.currentTime) : new Date()
  );
  const [enlapsedTimeString, setEnlapsedTimeString] = useState(() => {
    // Intial state of enlapsedTimeString is calculated using epoch
    // [] Change implementation so that we only worry about display xHxM on the div
    const newTime = props.currentTime
      ? new Date(props.currentTime)
      : new Date(); // Fix
    const currentTime = newTime - initialTime;
    const minutes = Math.floor((currentTime / 60000) % 60);
    const hours = Math.floor(currentTime / 3600000);
    return `${hours}h${minutes}m`;
  });
  const [height, setHeight] = useState(calculateHeight());
  const [isHovering, setIsHovering] = useState(false);

  const categories = useSelector((state) => state.categories);

  function handleChange(e) {
    setDescription(e.target.value);
  }

  function calculateHeight() {
    const newTime = props.currentTime
      ? new Date(props.currentTime)
      : new Date();
    const currentTime = newTime - initialTime;
    const height = Math.floor(currentTime / 1000);
    return height;
  }

  function handleDeleteInterval() {
    props.deleteInterval(props.id);
  }

  useEffect(() => {
    if (!props.completed) {
      const myInterval = setInterval(() => {
        const newTime = new Date();
        setCurrentTime(newTime);
        setHeight(height + 1);

        const currentTime = newTime - initialTime;
        const minutes = Math.floor((currentTime / 60000) % 60);
        const hours = Math.floor(currentTime / 3600000);
        setEnlapsedTimeString(`${hours}h${minutes}m`);
      }, 1000);
      return () => clearInterval(myInterval);
    }
  });

  useEffect(() => {
    props.updateIntervalData(props.id, currentTime.getTime(), description);
  }, [props.completed, description, currentTime]); // Fix

  let bgColor = "#000";
  for (const { keywords, color } of categories) {
    for (const keyword of keywords) {
      const wordSearch = new RegExp(`\\b${keyword}\\b`, "i");
      if (wordSearch.test(description)) bgColor = color;
    }
  }

  const redCancelButtonTemplate = (
    <IconContext.Provider
      value={{ color: "white", className: "global-class-name" }}
    >
      <ImCross className="h-full" />
    </IconContext.Provider>
  );

  return (
    <div
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <div>
        {props.hasIntialTimer ? initialTime.toLocaleTimeString("en-GB") : ""}
        <div className="relative">
          <div
            className={"text-white rounded-md flex justify-between py-3 px-4"}
            style={{
              height: `${Math.floor(height / 60) + 50}px`,
              background: bgColor,
            }}
          >
            <textarea
              className="bg-transparent text-white w-full mr-5 overflow-auto no-scrollbar outline-none resize-none"
              onChange={handleChange}
              placeholder="Activity"
              value={description}
            />
            {enlapsedTimeString}
          </div>
          {isHovering && (
            <div className="h-full absolute top-0 left-[25.5rem]">
              <button
                className="h-full bg-red-400 rounded-md w-10 ml-1 flex justify-center"
                onClick={handleDeleteInterval}
              >
                {redCancelButtonTemplate}
              </button>
            </div>
          )}
        </div>
        {currentTime.toLocaleTimeString("en-GB")}
      </div>
    </div>
  );
}
