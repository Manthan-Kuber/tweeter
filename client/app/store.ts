import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./sync_storage";
import { api } from "./services/api";
import authReducer from "../features/auth/authSlice";
import { encryptTransform } from "redux-persist-transform-encrypt"; //Uninstall if no encrypt

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // transforms: [
  //   encryptTransform({
  //     secretKey: "9546cc17dc3e30ed451e8534b7121d7e63f35dee4656175ed1392e6d3d0222f6a1f2b0138dc8418b19c784ff377bbc87b3f1eb4c57e01b35f3404d83cf346782",
  //     onError: (error) => console.log(error),
  //   }),
  // ],
  blacklist: [api.reducerPath],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
