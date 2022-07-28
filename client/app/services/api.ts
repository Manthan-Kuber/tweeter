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
    credentials: "include",
  }),
  // tagTypes:["GetComments"],
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
    getTweets:builder.query<GetTweetsResponse,void>({
      query:() => "/profile/tweets"
    })
    // getComments: builder.query(
    //   //Needs tweetid and skip
    //   {
    //     query: () => "/comment",
    //     invalidatesTags:["GetComments"]
    //   }
    // ),
  }),
});

//Check lazyprofile query
export const { useLoginMutation, useSignupMutation,useGetTweetsQuery } = api;
