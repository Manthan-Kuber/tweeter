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
  tagTypes: ["Tweets", "Comments"],
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
    getProfileTweets: builder.query<GetTweetsResponse, {userId:string,skip:number}>({
      query: (argObj) => `profile/tweets/${argObj.userId}/${argObj.skip}`, //skip to be included
      providesTags: ["Tweets"],
    }),
    createTweet: builder.mutation({
      query: (body) => ({
        url: "tweets",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Tweets"],
    }),
    deleteTweet: builder.mutation({
      query: (tweetId: string) => ({
        url: "tweets",
        method: "DELETE",
        body: tweetId,
      }),
      invalidatesTags: ["Tweets"],
    }),
    //Needs tweetid and skip
    getComments: builder.query<GetCommentsResponse,string>({ //change to object later for skip
      query: (tweetId:string) => `comment/${tweetId}/0`,
      providesTags: ["Comments"],
    }),
    createComment: builder.mutation({
      query: (body) => ({
        url: "comment",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Comments"],
    }),
    getBookmarks:builder.query<GetTweetsResponse,number>({
      query: (skip) => `home/bookmarks/${skip}`
    }),
    getHomeTweets:builder.query<GetTweetsResponse,number>({
      query:(skip) => `home/tweets/${skip}`
    }),
    likeTweet:builder.mutation<string,string>({
      query:(tweetId) => ({
        url:"/tweets/like",
        method:"PUT",
        body:tweetId, //invalidate tags for liked tweets fetch
      })
    }),
    getFollowers:builder.query<GetFollowingAndFollowersResponse,string>({
        query: (userId) => `users/followers/${userId}/0`,
    }),
    getFollowing:builder.query<GetFollowingAndFollowersResponse,string>({
        query: (userId) => `users/following/${userId}/0`,
    })
    // getProfileTweetsAndReplies:builder.query<GetTweetsResponse,number>({
    //   query:(skip) => `profile/tweets/${skip}`
    // })
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileTweetsQuery,
  useCreateTweetMutation,
  useDeleteTweetMutation,
  useCreateCommentMutation,
  useLazyGetCommentsQuery,
  useGetCommentsQuery,
  useLazyGetProfileTweetsQuery,
  useGetBookmarksQuery,
  useGetHomeTweetsQuery,
  useLikeTweetMutation,
  useLazyGetFollowersQuery,
  useLazyGetFollowingQuery
  // useGetProfileTweetsAndRepliesQuery,
} = api;
