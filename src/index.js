import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import store from "./app/store";
import { Provider } from "react-redux";

const DATA = [];
const isUnique = localStorage.getItem("isUnique");

const multipleTabsOpenTemplate = (
  <div>
    <div className="h-screen max-w-md mx-auto flex flex-col items-center justify-center text-lg text-center">
      🤗 You have another tacker tab open, close all other tabs but one and
      reload
      <button
        className="bg-red-400 hover:bg-red-500 py-2 px-4 mt-4 rounded-md text-white text-sm"
        onClick={() => {
          localStorage.removeItem("isUnique");
          window.location.reload();
        }}
      >
        Click in case the above doesn't work
      </button>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {isUnique ? multipleTabsOpenTemplate : <App data={DATA} />}
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
