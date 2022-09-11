import React, { useEffect } from "react";

export default function MultipleTabsOpened(props) {
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

  return (
    <div>
      <div className="h-screen max-w-md mx-auto flex flex-col items-center justify-center text-lg text-center">
        🤗 You have {props.tabsOpened} Tacker tabs open, close all other tabs
        but one and reload
        <button
          className="bg-red-400 hover:bg-red-500 py-2 px-4 mt-4 rounded-md text-white text-sm"
          onClick={() => {
            // localStorage.removeItem("tabsOpened");
            window.location.reload();
          }}
        >
          Click in case the above doesn't work
        </button>
      </div>
    </div>
  );
}
