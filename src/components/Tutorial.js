import React from "react";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";

const tutorialTemplate = (
  <div>
    <u>About</u>
    <p>Tracker is a time tracking app that allows the user to record their time using <b>intervals</b> and see summaries and statistics about their distribution of time</p>
    <br />

    <u>Usage</u>
    <p>
      To start an <b>interval</b> press the <code>start</code> button at the bottom left of your screen. You can stop the current interval using <code>stop</code> and clear all intervals by clicking <code>clear</code>. To clear just one interval, hover with your mouse over the interval you want to delete and an <code>[x]</code> button will appear at the right of the interval. Click it to delete said interval.
      <br />
      <br />
      Each interval has an <b>activity</b> field where you can write a description of what you did in this time. Based on certain <b>keywords</b> the intervals can change color to indicate they belong to a category.
      <br />
      <br />
      The <code>settings</code> button hidden at the top right of your screen can be clicked to access the <b>settings</b> menu. Here, you can define <b>categories</b>, <b>keywords</b> and <b>colors</b>. The <b>keywords</b> are used in order to classify your time intervals of the day into categories. They will also help the program identify which <b>color</b> to apply to your intervals. If there are multiple <b>keywords</b> belonging to different categories in the same interval activity description, the program will pick the last keyword written and will classify the interval accordingly.
      <br />
      <br />
      To see a graphical summary of your usage of time during the day, you can access the <code>stat</code> button at the top right of your screen.
      <br />
      <br />
      To see the intervals of previous days you can use the <code>arrow buttons</code> to navigate to different dates. Alternatively you can use the <code>Yesterday</code> and <code>Tomorrow</code> buttons on the top left corner of your screen.
    </p>


  </div>
)

export default function Tutorial(props) {
  return (
    <div className="fixed bg-gray-300 top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto z-10 backdrop-blur-[2px] bg-opacity-25">
      <div className="relative my-10 max-w-lg mx-auto pointer-events-none">
        <div className="border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
          <div className="p-4 rounded-t-md">
          
            <div className="flex justify-between mb-2">
              <h1 className="text-xl font-bold">Tutorial</h1>
              <button onClick={() => props.handleTutorialView(false)}>
                  <IconContext.Provider
                    value={{ color: "black", className: "global-class-name" }}
                  >
                    <ImCross className="h-full my-auto" />
                  </IconContext.Provider>
              </button>
            </div>

            {tutorialTemplate}

          </div>
        </div>
      </div>
    </div>
  );
}