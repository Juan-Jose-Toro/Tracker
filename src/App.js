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
import Tutorial from "./components/Tutorial";


import { useSelector } from "react-redux";

function App() {
  // isStats defines if the page is showing the stats view
  const [isStats, setIsStats] = useState(false);
  // curDate stored date of the intervals the user sees, when the page reloads this
  // resets to the current date
  const [curDate, setCurDate] = useState(new Date());
  const [intervals, setIntervals] = useState(() => {
    const localIntervals = getDataOnLocalStorage()?.intervals; // encapsulate in function
    return localIntervals || [];
  });
  // isStop determines if the next interval should display an initial timer above
  // itself. This is would be needed if the previous interval is paused
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
  const [isTutorialOverlay, setIsTutorialOverlay] = useState(false);
  const [isConfigOverlay, setIsConfigOverlay] = useState(false); // [] -> Simplify these two
  const [isInitialMenuHide, setIsInitialMenuHide] = useState(false);

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

  // clearIntervals() removes all existing intervals. It corresponds to the stop button
  // on the interface
  function clearIntervals() {
    setIntervals([]);
    setIsStop(true);
  }

  // deleteInverval(id) deletes the interval with id from intervals variable.
  // If the interval deleted in not the last interval in intervals, it sets the 
  // next interval to display its initial timer. If the interval deleted is the last
  // one, then we let the next interval created to have an initial timers
  function deleteInterval(id) {
    let remainingIntervals = intervals.filter((interval, i, arr) => {
      if (interval.id === id) {
        if (arr[i + 1]) {
          arr[i + 1].hasInitialTimer = true;
        } else if (i === arr.length - 1) {
          setIsStop(true);
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

  // setDataOnLocalStorage() stored the current intervals data in localStorage
  // with a key equivalent to the date the user is looking at curDate
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

  // ======================= Switch views ======================

  // handleStatView() activates the statistics view and calculates the percentage
  // of time (out of 24h) that has been spent on each category defined by the user.
  // This information is passed to the Graphs component
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
    categoryPercentages["not classified"] = 0;

    const DAYINMS = 864000;

    intervals.forEach((interval) => {
      let isClassified = false;
      const timeEnlapsed = interval.currentTime - interval.initialTime;

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
      if (!isClassified) {
        categoryPercentages["not classified"] += timeEnlapsed / DAYINMS;
      }
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

  function handleTutorialView(isTemplate) {
    setIsTutorialOverlay(isTemplate);
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

  // useEffect function to make a backup of all the current information stored in
  // localStorage expect for the previous BACKUP itself
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const timer = setTimeout(() => {
      let filteredStorage = Object.fromEntries(
        Object.entries(localStorage).filter(([key, val]) => key !== 'BACKUP')
      );
      localStorage.setItem("BACKUP", JSON.stringify(filteredStorage));
      setBackupTrigger(backupTrigger + 1); // Reinstantiate timeout for backup
    }, tomorrow - today);
    return () => {
      clearTimeout(timer);
    };
  }, [backupTrigger]);

  // Left & Right arrow functionality useEffect
  function keyDownHandler({ key }) {
    if (document.activeElement.tagName !== "BODY" || isStats || isConfigOverlay)
      return;
    if (key === "ArrowLeft") {
      loadPreviousDay();
    } else if (key === "ArrowRight") {
      loadNextDay();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  // useEffect to avoid the user opening multiple tabs of the app at the same time
  function decreaseTabCount() {
    let tabsOpened = JSON.parse(localStorage.getItem("tabsOpened"));
    tabsOpened--;
    localStorage.setItem("tabsOpened", JSON.stringify(tabsOpened));
  }

  useEffect(() => {
    window.addEventListener("beforeunload", decreaseTabCount);
    return () => {
      window.removeEventListener("beforeunload", decreaseTabCount);
    };
  });

  // useEffect to hide tutorial and configuration seconds after the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialMenuHide(true);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  })

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
      stopInterval={stopInterval}
    />
  ));

  const trackerTemplate = (
    <>

      <div
        className="flex justify-between relative"
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
      {isTutorialOverlay && <Tutorial handleTutorialView={setIsTutorialOverlay} />}
      <div className="App p-5 mt-4 max-w-md mx-auto transition ease-in-out">
        <div
          className="flex justify-between items-baseline relative pb-3">
          {/* Tutorial Button */}
          <button className={"py-1 h-8 underline hover:opacity-100 transition ease-in-out" + (isInitialMenuHide ? " opacity-0" : "opacity-100") } onClick={() => handleTutorialView(true)}>Tutorial</button>
          {/* Settings button */}
          <IconContext.Provider
            value={{ color: "#000", className: "global-class-name" }}
          >
            <BsFillGearFill
              className={
                "w-auto h-6 hover:opacity-100 transition ease-in-out"
                + (isInitialMenuHide ? " opacity-0" : "opacity-100")
              }
              onClick={() => handleConfigView(true)}
            />
          </IconContext.Provider>
        </div>
        {isStats ? statsTemplate : trackerTemplate}
      </div>
    </>
  );
}

export default App;
