import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../features/configuration/categoriesSlice";

export default configureStore({
  reducer: {
    categories: categoriesReducer,
  },
});
