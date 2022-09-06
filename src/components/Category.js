import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { updateCategory } from "../features/configuration/categoriesSlice";

export default function Category(props) {
  const [name, setName] = useState(props.name);
  const [keywords, setKeywords] = useState(props.keywords);
  const [color, setColor] = useState(props.color);

  const dispatch = useDispatch();

  const onNameChange = (e) => {
    setName(e.target.value);
    dispatch(
      updateCategory({
        id: props.id,
        name: e.target.value,
        keywords,
        color,
      })
    );
  };

  const onKeywordsChange = (e) => {
    setKeywords(e.target.value.split(","));
    dispatch(
      updateCategory({
        id: props.id,
        name,
        keywords: e.target.value.split(","),
        color,
      })
    );
  };

  const onColorChange = (e) => {
    setColor(e.target.value);
    dispatch(
      updateCategory({
        id: props.id,
        name,
        keywords,
        color: e.target.value,
      })
    );
  };

  return (
    <div className="flex flex-row justify-between mt-1">
      <div className="flex flex-col w-1/3 mr-4">
        <h3 className="text-[0.625rem] leading-[5px] text-[#787878]">
          Category
        </h3>
        <textarea
          className="text-[0.9rem] bg-transparent w-full overflow-auto no-scrollbar outline-none resize-none"
          onChange={onNameChange}
          placeholder="Category"
          value={name}
        />
      </div>

      <div className="flex flex-col w-full">
        <h3 className="text-[0.625rem] leading-[5px] text-[#787878] h-auto">
          Keywords
        </h3>
        <textarea
          className="text-[0.9rem] bg-transparent w-full overflow-auto no-scrollbar outline-none resize-none"
          onChange={onKeywordsChange}
          placeholder="Keywords"
          value={keywords}
        />
      </div>

      <div className="flex">
        <div
          style={{ background: color }}
          className={`h-8 w-8 mx-2 rounded-sm shrink-0`}
        ></div>
        <div className="flex flex-col">
          <h3 className="text-[0.625rem] leading-[5px] text-[#787878]">
            Color
          </h3>
          <textarea
            className="text-[0.9rem] bg-transparent w-full overflow-auto no-scrollbar outline-none resize-none"
            onChange={onColorChange}
            placeholder="Color"
            value={color}
          />
        </div>
      </div>
    </div>
  );
}
