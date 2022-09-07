import "./App.css";
import { nanoid } from "nanoid";
import React, { useState, useEffect } from "react";
import Interval from "./components/Interval";
import ActionButtons from "./components/ActionButtons";
import CalendarButtons from "./components/CalendarButtons";
import Graphs from "./components/Graphs";
import { BsFillGearFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import Settings from "./components/Settings";

import { useSelector } from "react-redux";

function App() {
  const [isStats, setIsStats] = useState(false);
  const [curDate, setCurDate] = useState(new Date()); // Change to reflex the current selected date or else it will reset to current date on reload
  const [intervals, setIntervals] = useState(() => {
    const localIntervals = getDataOnLocalStorage()?.intervals; // encapsulate in function
    return localIntervals || [];
  });
  const [isStop, setIsStop] = useState(() => {
    const localIsStop = getDataOnLocalStorage()?.isStop;
    return localIsStop === undefined ? true : localIsStop;
  });
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [backupTrigger, setBackupTrigger] = useState(0);
  // Array of time enlapsed on each interval in milliseconds
  const [categoryPercentages, setCategoryPercentages] = useState({});
  const [isConfigHidden, setIsConfigHidden] = useState(true);
  const [isConfigOverlay, setIsConfigOverlay] = useState(false);

  const categories = useSelector((store) => store.categories);

  // ======================= Interval Management ======================
  function startInterval() {
    const editedIntervals = intervals.map((interval, i, { length }) => {
      if (length - 1 === i) {
        return { ...interval, completed: true };
      }
      return interval;
    });

    const newInterval = {
      id: "interval-" + nanoid(),
      completed: false,
      hasInitialTimer: isStop,
      initialTime: Date.now(),
      currentTime: "",
      description: "",
    };

    setIntervals([...editedIntervals, newInterval]);
    setIsStop(false);
  }

  function stopInterval() {
    const editedIntervals = intervals.map((interval, i, { length }) => {
      if (length - 1 === i) {
        return { ...interval, completed: true };
      }
      return interval;
    });
    setIntervals(editedIntervals);
    setIsStop(true);
  }

  function updateIntervalData(id, currentTime, description) {
    const editedIntervals = intervals.map((interval) => {
      if (interval.id === id) {
        return {
          ...interval,
          currentTime: currentTime,
          description: description,
        };
      }
      return interval;
    });
    setIntervals(editedIntervals);
  }

  function clearIntervals() {
    setIntervals([]);
    setIsStop(true);
  }

  function deleteInterval(id) {
    let remainingIntervals = intervals.filter((interval, i, arr) => {
      if (interval.id === id) {
        if (arr[i + 1]) {
          arr[i + 1].hasInitialTimer = true;
        }
        return false;
      } else return true;
    });

    if (remainingIntervals.length === 0) setIsStop(true);
    setIntervals(remainingIntervals);
  }

  // ======================= Fetching Data ======================
  function getDataOnLocalStorage() {
    return JSON.parse(
      localStorage.getItem(curDate.toLocaleDateString("en-US"))
    );
  }

  function setDataOnLocalStorage() {
    const localData = {
      intervals: intervals,
      isStop: isStop,
    };
    localStorage.setItem(
      curDate.toLocaleDateString("en-US"),
      JSON.stringify(localData)
    );
  }

  // ======================= Data Management ======================
  // date is epoch in ms and returns epoch in ms
  function getYesterdayDate(date) {
    return new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000);
  }

  function getTomorrowDate(date) {
    return new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
  }

  function loadPreviousDay() {
    // Save current state
    setDataOnLocalStorage();

    setCurDate(getYesterdayDate(curDate));
  }

  function loadNextDay() {
    // Save current state
    setDataOnLocalStorage();

    setCurDate(getTomorrowDate(curDate));
  }

  function keyDownHandler({ key }) {
    if (key === "ArrowLeft") {
      loadPreviousDay();
    } else if (key === "ArrowRight") {
      loadNextDay();
    }
  }

  // ======================= Switch views ======================
  function handleStatView() {
    // [] -> Clean up this fucntion
    setIsStats(!isStats);
    if (isStats) return; // as setIsAnalysics

    // Calculate what percentage each category has
    let categoryPercentages = {};
    const categoryNames = categories.map((category) => category.name);
    for (const categoryName of categoryNames) {
      categoryPercentages[categoryName] = 0;
    }
    categoryPercentages["not defined"] = 0;

    const DAYINMS = 864000;

    intervals.forEach((interval) => {
      let isClassified = false;
      const timeEnlapsed = interval.currentTime - interval.initialTime;

      // for (const [category, keyWords] of Object.entries(CATEGORIES)) {

      for (const { name: category, keywords } of categories) {
        if (
          // [] -> refactor into its own function
          keywords.some((keyword) => {
            const wordSearch = new RegExp(`\\b${keyword}\\b`, "i");
            return wordSearch.test(interval.description);
          })
        ) {
          categoryPercentages[category] += timeEnlapsed / DAYINMS;
          isClassified = true;
          break;
        }
      }
      if (!isClassified)
        categoryPercentages["not defined"] += timeEnlapsed / DAYINMS;
    });

    // Calculate remaining percentage
    let totalPercentage = 0;
    Object.values(categoryPercentages).forEach((x) => (totalPercentage += x));
    categoryPercentages["remaining"] = 100 - totalPercentage;

    setCategoryPercentages(categoryPercentages);
  }

  function handleConfigView(isConfig) {
    setIsConfigOverlay(isConfig);
  }

  // ========================= UseEffects =============================
  useEffect(() => {
    // [ ] - I don't understand why this is here, how could I reload the app so that
    // this already gets executed on start?
    const localData = getDataOnLocalStorage();
    setIntervals(localData?.intervals || []);
    setIsStop(localData?.isStop === undefined ? true : localData?.isStop);
  }, [curDate]);

  useEffect(() => {
    setDataOnLocalStorage();
  }, [intervals, isStop]); // Could split

  // useEffect function to make a backup at midnight
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const timer = setTimeout(() => {
      localStorage.setItem("BACKUP", JSON.stringify(localStorage));
      setBackupTrigger(backupTrigger + 1); // Reinstantiate timeout for backup
    }, tomorrow - today);
    return () => {
      clearTimeout(timer);
    };
  }, [backupTrigger]);

  // Left & Right arrow functionality useEffect
  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  // useEffect to set unique tab key
  function removeIsUniqueKey() {
    localStorage.removeItem("isUnique");
  }

  useEffect(() => {
    localStorage.setItem("isUnique", "true");
    window.addEventListener("beforeunload", removeIsUniqueKey);
    return () => {
      window.removeEventListener("beforeunload", removeIsUniqueKey);
    };
  });
  // ==================== Templates & rendering ============================
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
      deleteInterval={deleteInterval}
    />
  ));

  const trackerTemplate = (
    <>
      <div
        className="flex justify-between relative"
        onMouseEnter={() => {
          setIsConfigHidden(false);
        }}
        onMouseLeave={() => {
          setIsConfigHidden(true);
        }}
      >
        {/* Date, date controls, stats & settings buttons */}
        <h1 className="text-2xl font-bold">
          {curDate.toLocaleDateString("en-US", options)}
        </h1>
        <button
          className="bg-black text-white rounded-md px-3 py-1 h-8"
          onClick={handleStatView}
        >
          Stats
        </button>

        {/* Settings button */}
        <IconContext.Provider
          value={{ color: "#D3D3D3", className: "global-class-name" }}
        >
          <BsFillGearFill
            className={
              "absolute w-auto h-8 right-[-2.5rem]" +
              (isConfigHidden ? " opacity-0" : " opacity-100")
            }
            onClick={() => handleConfigView(true)}
          />
        </IconContext.Provider>
      </div>
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
    </>
  );

  const statsTemplate = (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <button
          className="bg-black text-white rounded-md px-3 py-1 h-8"
          onClick={handleStatView}
        >
          Tacker
        </button>
      </div>
      <Graphs categoryPercentages={categoryPercentages} />
    </>
  );

  return (
    <>
      {isConfigOverlay && <Settings handleConfigView={handleConfigView} />}
      <div className="App p-5 mt-10 max-w-md mx-auto">
        {isStats ? statsTemplate : trackerTemplate}
      </div>
    </>
  );
}

export default App;
