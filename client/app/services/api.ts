import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// function providesTagsList<R extends { _id: string }[], T extends string>(
//   resultsWithIds: R | undefined,
//   tagType: T
// ) {
//   return resultsWithIds
//     ? [
//         { type: tagType, id: `${tagType.toUpperCase()}LIST` },
//         ...resultsWithIds.map(({ _id }) => ({ type: tagType, id: _id })),
//       ]
//     : [{ type: tagType, id: `${tagType.toUpperCase()}LIST` }];
// }

// function providesTagsList<R extends { _id: string }[], T extends string>(
//   resultsWithIds: R | undefined,
//   tagType: T
// ) {
//   return resultsWithIds
//     ? resultsWithIds.map(({ _id }) => ({ type: tagType, id: _id }))
//     : [{ type: tagType, id: `${tagType.toLocaleUpperCase()}LIST` }];
// }

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://tweeter-app-backend.herokuapp.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include",
  }),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 1,
  tagTypes: [
    "HomeTweets",
    "Tweets", //  <== Profile Tweets
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
    "ReplyToTweet", // <== Tweet Page Replies
    "FollowingReplyTweet", // <== Reply to Following tweet for Home Feed and Tweets and Replies in Profile
    "Hashtags"
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
      invalidatesTags: [
        "Tweets",
        "Tweet",
        "HomeTweets",
        "ReplyToTweet",
        "FollowingReplyTweet",
        "Hashtags"
      ],
    }),
    getBookmarks: builder.query<GetTweetsResponse, number>({
      query: (skip) => `home/bookmarks/${skip}`,
      providesTags: ["Bookmarks"],
    }),
    getHomeTweets: builder.query<GetTweetsResponse, number>({
      query: (skip) => `home/tweets/${skip}`,
      providesTags: ["HomeTweets"],
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
      // async onQueryStarted(tweetId,{dispatch,queryFulfilled}) {
      //   const patchResult = dispatch(
      //     api.util.updateQueryData('getBookmarks', tweetId, (draft) => {
      //       Object.assign(draft, patch)
      //     })
      //   )
      //   try {
      //     await queryFulfilled
      //   } catch {
      //     patchResult.undo()

      //     /**
      //      * Alternatively, on failure you can invalidate the corresponding cache tags
      //      * to trigger a re-fetch:
      //      * dispatch(api.util.invalidateTags(['Post']))
      //      */
      //   }
      // }
      // invalidatesTags: [
      //   "Tweets",
      //   "HomeTweets",
      //   "Bookmarks",
      //   "TweetsAndReplies",
      //   "TweetsLikes",
      //   "TweetsMedia",
      //   "Tweet",
      //   "ReplyToTweet",
      //   "FollowingReplyTweet",
      // ],
    }),
    saveTweet: builder.mutation<string, string>({
      query: (tweetId) => ({
        url: "/tweets/save",
        method: "PUT",
        body: { tweetId },
      }),
      // invalidatesTags: [
      //   "Tweets",
      //   "Bookmarks",
      //   "TweetsAndReplies",
      //   "TweetsLikes",
      //   "TweetsMedia",
      //   "Tweet",
      //   "ReplyToTweet",
      //   "FollowingReplyTweet",
      // ],
    }),
    retweetTweet: builder.mutation<string, string>({
      query: (tweetId) => ({
        url: "/tweets/retweet",
        method: "PUT",
        body: { tweetId },
      }),
      // invalidatesTags: [
      //   "Tweets",
      //   "Bookmarks",
      //   "TweetsAndReplies",
      //   "TweetsLikes",
      //   "TweetsMedia",
      //   "Tweet",
      //   "ReplyToTweet",
      //   "FollowingReplyTweet",
      // ],
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
        "Tweet",
        "ReplyToTweet",
        "FollowingReplyTweet",
        "HomeTweets",
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
    getSuggestedFollowers: builder.query<
      SuggestedFollowerResponseElement[],
      number
    >({
      query: (skip) => ({
        url: `home/people/${skip}/4`,
      }),
      keepUnusedDataFor: 60,
      providesTags: ["SuggestedFollowers"],
    }),
    getTweet: builder.query<GetTweetsResponse, string>({
      query: (tweetId) => `tweets/${tweetId}`,
      providesTags: ["Tweet"],
    }),
    getTweetReplies: builder.query<
      GetTweetsResponse,
      { tweetId: string; skip: number }
    >({
      query: ({ tweetId, skip }) => `tweets/replies/${tweetId}/${skip}`,
      providesTags: ["ReplyToTweet"],
    }),
    getFollowingReply: builder.query<
      GetTweetsResponse,
      { tweetId: string; userId: string }
    >({
      query: ({ tweetId, userId }) =>
        `tweets/followingReplies/${tweetId}/${userId}`,
      providesTags: ["FollowingReplyTweet"],
    }),
    getHashtags: builder.query<
      HashtagsResponseElement[],
      { hashtagArrayLength: number; hashtagLimit: number }
    >({
      query: ({ hashtagArrayLength, hashtagLimit }) =>
        `home/hashtags/${hashtagArrayLength}/${hashtagLimit}`,
      providesTags:["Hashtags"],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileTweetsQuery,
  useCreateTweetMutation,
  useDeleteTweetMutation,
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
  useGetTweetQuery,
  useGetTweetRepliesQuery,
  useLazyGetTweetRepliesQuery,
  useGetProfileTweetsMediaQuery,
  useGetProfileTweetsAndRepliesQuery,
  useGetFollowingReplyQuery,
  useGetHashtagsQuery,
  useLazyGetHashtagsQuery,
} = api;
