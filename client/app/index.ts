import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { api } from "./services/auth";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
});

export default rootReducer;
