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
  tagTypes: [
    "Tweets",
    "TweetsAndReplies",
    "TweetsMedia",
    "TweetsLikes",
    "Comments",
    "Bookmarks",
    "Followers",
    "Following",
    "SuggestedFollowers",
    "CommentsReplies",
    "Tweet",
  ],
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
    getProfileTweets: builder.query<
      GetTweetsResponse,
      { userId: string; skip: number }
    >({
      query: ({ userId, skip }) => `profile/tweets/${userId}/${skip}`,
      providesTags: ["Tweets"],
    }),
    getProfileTweetsAndReplies: builder.query<
      GetTweetsResponse,
      { userId: string; skip: number }
    >({
      query: ({ userId, skip }) => `profile/tweetsandreplies/${userId}/${skip}`,
      providesTags: ["TweetsAndReplies"],
    }),
    getProfileTweetsMedia: builder.query<
      GetTweetsResponse,
      { userId: string; skip: number }
    >({
      query: ({ userId, skip }) => `profile/media/${userId}/${skip}`,
      providesTags: ["TweetsMedia"],
    }),
    getProfileTweetsLikes: builder.query<
      GetTweetsResponse,
      { userId: string; skip: number }
    >({
      query: ({ userId, skip }) => `profile/likes/${userId}/${skip}`,
      providesTags: ["TweetsLikes"],
    }),
    createTweet: builder.mutation({
      query: (body) => ({
        url: "tweets",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Tweets","Tweet"],
    }),
    deleteTweet: builder.mutation({
      query: (tweetId: string) => ({
        url: "tweets",
        method: "DELETE",
        body: { tweetId },
      }),
      invalidatesTags: [
        "Tweets",
        "Bookmarks",
        "TweetsAndReplies",
        "TweetsLikes",
        "TweetsMedia",
      ],
    }),
    //Needs tweetid and skip
    getComments: builder.query<GetCommentsResponse, string>({
      //change to object later for skip if req
      query: (tweetId: string) => `comment/${tweetId}/0`,
      providesTags: ["Comments"],
    }),
    createComment: builder.mutation({
      query: (body) => ({
        url: "comment",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Comments", "Tweets"],
    }),
    getBookmarks: builder.query<GetTweetsResponse, number>({
      query: (skip) => `home/bookmarks/${skip}`,
      providesTags: ["Bookmarks"],
    }),
    getHomeTweets: builder.query<GetTweetsResponse, number>({
      query: (skip) => `home/tweets/${skip}`,
    }),
    getFollowers: builder.query<GetFollowingAndFollowersResponse, string>({
      query: (userId) => `users/followers/${userId}/0`,
      providesTags: ["Followers"],
    }),
    getFollowing: builder.query<GetFollowingAndFollowersResponse, string>({
      query: (userId) => `users/following/${userId}/0`,
      providesTags: ["Following"],
    }),
    likeTweet: builder.mutation<string, string>({
      query: (tweetId) => ({
        url: "/tweets/like",
        method: "PUT",
        body: { tweetId }, //invalidate tags for liked tweets fetch
      }),
      invalidatesTags: [
        "Tweets",
        "Bookmarks",
        "TweetsAndReplies",
        "TweetsLikes",
        "TweetsMedia",
        "Tweet",
      ],
    }),
    saveTweet: builder.mutation<string, string>({
      query: (tweetId) => ({
        url: "/tweets/save",
        method: "PUT",
        body: { tweetId },
      }),
      invalidatesTags: [
        "Tweets",
        "Bookmarks",
        "TweetsAndReplies",
        "TweetsLikes",
        "TweetsMedia",
        "Tweet",
      ],
    }),
    retweetTweet: builder.mutation<string, string>({
      query: (tweetId) => ({
        url: "/tweets/retweet",
        method: "PUT",
        body: { tweetId },
      }),
      invalidatesTags: [
        "Tweets",
        "Bookmarks",
        "TweetsAndReplies",
        "TweetsLikes",
        "TweetsMedia",
        "Tweet",
      ],
    }),
    followUser: builder.mutation<void, string>({
      query: (targetid) => ({
        url: "/users/follow",
        method: "PUT",
        body: { targetid },
      }),
      invalidatesTags: ["Following", "Followers", "SuggestedFollowers"],
    }),
    unfollowUser: builder.mutation<void, string>({
      query: (targetid) => ({
        url: "/users/unfollow",
        method: "PUT",
        body: { targetid },
      }),
      invalidatesTags: ["Followers", "Following"],
    }),
    getSuggestedFollowers: builder.query<SuggestedFollowerResponse[], number>({
      query: (skip) => ({
        url: `home/people/${skip}/4`,
      }),
      providesTags: ["SuggestedFollowers"],
    }),
    likeComment: builder.mutation<void, string>({
      //same api for likeReply
      query: (commentId) => ({
        url: `comment/like`,
        method: "PUT",
        body: { commentId },
      }),
      invalidatesTags: ["CommentsReplies", "Comments"],
    }),
    getCommentReplies: builder.query<GetCommentRepliesResponse, string>({
      query: (commentId) => ({
        url: `comment/replies/${commentId}/0`,
      }),
      providesTags: ["CommentsReplies"],
    }),
    createReply: builder.mutation({
      query: (body) => ({ url: "comment/reply", method: "POST", body }),
      invalidatesTags: ["CommentsReplies"],
    }),
    getTweet: builder.query<GetTweetsResponse, string>({
      query: (tweetId) => `tweets/${tweetId}`,
    }),
    getTweetReplies: builder.query<
      GetTweetsResponse,
      { tweetId: string; skip: number }
    >({
      query: ({ tweetId, skip }) => `tweets/replies/${tweetId}/${skip}`,
      providesTags: ["Tweet"],
    }),
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
  useGetBookmarksQuery,
  useGetHomeTweetsQuery,
  useLazyGetHomeTweetsQuery,
  useLikeTweetMutation,
  useSaveTweetMutation,
  useRetweetTweetMutation,
  useLazyGetFollowersQuery,
  useLazyGetFollowingQuery,
  useLazyGetBookmarksQuery,
  useLazyGetProfileTweetsQuery,
  useLazyGetProfileTweetsAndRepliesQuery,
  useLazyGetProfileTweetsMediaQuery,
  useLazyGetProfileTweetsLikesQuery,
  useGetProfileTweetsLikesQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useLazyGetSuggestedFollowersQuery,
  useGetSuggestedFollowersQuery,
  useLikeCommentMutation,
  useLazyGetCommentRepliesQuery,
  useCreateReplyMutation,
  useGetTweetQuery,
  useGetTweetRepliesQuery,
  useLazyGetTweetRepliesQuery,
} = api;
