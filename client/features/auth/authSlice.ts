import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null } as authState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
    }
  },
});

export const { setCredentials,logOut } = authSlice.actions;

export default authSlice.reducer;

