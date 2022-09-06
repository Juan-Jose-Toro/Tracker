import React from "react";
import { ImCross, ImPlus } from "react-icons/im";
import { IconContext } from "react-icons";

import Category from "./Category";

import { useSelector } from "react-redux";

export default function Settings(props) {
  const categories = useSelector((store) => store.categories);
  const categoryList = categories.map((category) => (
    <Category
      id={category.id}
      key={category.id}
      name={category.name}
      keywords={category.keywords}
      color={category.color}
    />
  ));

  return (
    <div className="fixed bg-gray-300 top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto z-10 backdrop-blur-[2px] bg-opacity-25">
      <div className="relative mt-10 max-w-md mx-auto pointer-events-none">
        <div className="border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
          <div className="p-4 rounded-t-md">
            {/* [Settings  x] Header */}
            <div className="flex justify-between">
              <h1 className="text-xl font-bold">Settings</h1>
              <button onClick={() => props.handleConfigView(false)}>
                <IconContext.Provider
                  value={{ color: "black", className: "global-class-name" }}
                >
                  <ImCross className="h-full my-auto" />
                </IconContext.Provider>
              </button>
            </div>
            {/* Setting Options */}
            {/* > Category Options */}
            <h2 className="text-lg pb-2">Categories</h2>
            {categoryList}
            <button className="h-10 w-full bg-gray-200 rounded-md flex justify-center items-center">
              <IconContext.Provider
                value={{
                  color: "white",
                  className: "global-class-name",
                }}
              >
                <ImPlus className="h-full w-5" />
              </IconContext.Provider>
            </button>
            {/* ^^^ WORKING ON ONCLICK() TO ADD CATEGORIES */}
            <div></div>
          </div>
        </div>
      </div>
      {/* This is a long div */}
    </div>
  );
}
