import { createSlice } from "@reduxjs/toolkit";

const storedCategories = JSON.parse(localStorage.getItem("categories"));
const initialState = storedCategories || [
  {
    id: "category-1",
    name: "study",
    keywords: ["react", "math239", "portfolio"],
    color: "#000",
  },
  {
    id: "category-2",
    name: "break",
    keywords: ["break", "breakfast", "dinner"],
    color: "#eb4034",
    // color: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
  },
  {
    id: "category-3",
    name: "coaching",
    keywords: ["coaching"],
    color: "#7134eb",
  },
];

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    updateCategory: (state, action) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].id === action.payload.id) {
          state[i] = action.payload;
        }
      }
      localStorage.setItem("categories", JSON.stringify(state));
    },
  },
});

export const { updateCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
