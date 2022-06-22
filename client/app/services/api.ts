import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";



export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:6969/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, Omit<UserRequest, "name">>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation<UserResponse, UserRequest>({
      query: (credentials) => ({
        url: "signup",
        method: "POST",
        body: credentials,
      }),
    }),
    test: builder.query<{ message: string }, void>({
      query: () => "test",
    }),
    users: builder.query<ProfileResponse, string>({
      //Add Req resp types
      query: (userId) => `users/${userId}`,
    }),
  }),
});

//Check lazyprofile query
export const {
  useLoginMutation,
  useTestQuery,
  useSignupMutation,
  useUsersQuery,
} = api;
