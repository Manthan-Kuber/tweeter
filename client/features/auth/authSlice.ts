import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../app/services/api";

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
      api.util.resetApiState();
    },
    setProfilePic: (state, { payload }: PayloadAction<string>) => {
      if (state.user) state.user.profilePic = payload;
    },
  },
});

export const { setCredentials, logOut, setProfilePic } = authSlice.actions;

export default authSlice.reducer;
