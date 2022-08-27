interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
}

interface authState {
  user: User | null;
  token: string | null;
}

interface UserResponse {
  user: User;
  token: string;
}

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

interface InputGroupProps {
  placeholder?: string;
  icon?: string;
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  type?: string;
  name: string;
  value: string;
  setformValues: React.Dispatch<
    React.SetStateAction<{
      fname: string;
      lname: string;
      email: string;
      password: string;
    }>
  >;
  formValues: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  };
  myRef?: React.RefObject<HTMLInputElement>;
}

interface RegisterFormProps {
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setformValues: React.Dispatch<
    React.SetStateAction<{
      fname: string;
      lname: string;
      email: string;
      password: string;
    }>
  >;
  formValues: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  };
  emailPlaceholder: string;
  passwordPlaceholder: string;
  btnText: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  errMessage: {
    name: string;
    email: string;
    password: string;
  };
  isSignupForm?: boolean;
}

interface NavProps {
  NavList: {
    id: number;
    name: string;
    url: string;
    icon: JSX.Element;
  }[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  width?: number;
  Tab?: string;
}

interface FilterBoxProps {
  setTab: Dispatch<SetStateAction<number>>;
  tab: number;
  filterList: {
    id: number;
    label: string;
  }[];
}

interface ProfileDropDownProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModalProps {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalIsOpen: boolean;
  name?: string;
  username?: string;
  bio?: string;
  profilePic?: string;
  following?: number;
  followers?: number;
  children?: React.ReactNode;
  modalTitle?: string;
  shouldCloseOnOverlayClick?: boolean;
  closeIconOnClick?: MouseEventHandler<SVGElement>;
}

interface ProfileBoxProps
  extends Omit<ModalProps, "setModalIsOpen" | "modalIsOpen"> {
  followerModalIsOpen: boolean;
  setFollowerModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  followingModalIsOpen: boolean;
  setFollowingModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editProfileModalIsOpen: boolean;
  setEditProfileModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  GetFollowersTrigger: LazyQueryTrigger<
    QueryDefinition<
      string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      "Tweets" | "Comments",
      GetFollowingAndFollowersResponse,
      "api"
    >
  >;
  GetFollowingTrigger: LazyQueryTrigger<
    QueryDefinition<
      string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      "Tweets" | "Comments",
      GetFollowingAndFollowersResponse,
      "api"
    >
  >;
  isFollowing: boolean;
  getProfile: () => Promise<void>;
}

interface ProfileInfoProps {
  name: string;
  username: string;
  tweetCreationDate?: string;
  followerCount?: number;
  profilePic: string;
}

interface ProfileResponse {
  data: [
    {
      name: string;
      username: string;
      profilePic: string;
      coverPic: string;
      bio: string;
      following: number;
      followers: number;
    }
  ];
}
interface TrendProps {
  trendList: {
    id: string;
    tagName: string;
    tweetCount: string;
  }[];
  getHashtags: () => Promise<void>;
  hasMore: boolean;
  setHasMoreTrends: Dispatch<SetStateAction<boolean>>;
}

interface CreateTweetProps {
  isReplyImageVisible: boolean;
  placeholder: string;
  btnText: string;
  variant?: string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  fileList: {
    id: string;
    file: File;
  }[];
  setFileList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        file: File;
      }[]
    >
  >;
  onSubmit: (e: React.FormEvent) => void;
  replyImageUrl?: string;
  isMediaInputVisible?:boolean;
}

interface TweetProps {
  authorId: string;
  authorName: string;
  authorUserName: string;
  authorFollowers: number;
  authorProfilePic: string;
  authorTweet: string;
  mediaList: string[];
  tweetId: string;
  commentCount: number;
  tweetCreationDate: Date;
  isSaved: boolean;
  isLiked: boolean;
  isRetweeted: boolean;
  likes: number;
  retweetedUsers: number;
  savedBy: number;
}

interface EditProfileProps {
  coverPic: string;
  profilePic: string;
  name: string;
  username: string;
  bio: string;
  setEditProfileModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      profilePic: string;
      coverPic: string;
      username: string;
      followers: number;
      following: number;
      followed: boolean;
      bio: string;
    }>
  >;
}

interface ComponentLoaderProps {
  width: number;
  height: number;
  borderRadius: number;
}

interface SuggestedFollowerResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  profilePic: string;
  coverPic: string;
  bio: string;
  followerCount: number;
}

interface SuggestedFollowProps {
  suggestedFollowList: Array<SuggestedFollowerResponse>;
  getSuggestedFollowers: () => Promise<void>;
  hasMore: boolean;
  setHasMoreSuggestions: Dispatch<SetStateAction<boolean>>;
}

interface TweetOptionsProps {
  setIsCommentButtonClicked: Dispatch<SetStateAction<boolean>>;
  tweetId: string;
  commentFetchTrigger: LazyQueryTrigger<
    QueryDefinition<
      string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      "Tweets" | "Comments",
      GetCommentsResponse,
      "api"
    >
  >;
  isSaved: boolean;
  isLiked: boolean;
  isRetweeted: boolean;
  setIsSaved: React.Dispatch<SetStateAction<boolean>>;
  setIsLiked: React.Dispatch<SetStateAction<boolean>>;
  setIsRetweeted: React.Dispatch<SetStateAction<boolean>>;
}

interface GetTweetsResponseElement {
  creator: {
    _id: string;
    username: string;
    profilePic: string;
    name: string;
  }[];
  tweet: string;
  media: string[];
  likes: number;
  _id: string;
  createdAt: Date;
  commentCount: number[]; //commentCount[0] gives count
  retweetedUsers: number;
  retweeted: string[]; //if length of array 0 , then not retweeted/saved/like otherwise has userId in it
  saved: string[];
  liked: string[];
  savedBy: number;
}

interface GetTweetsResponse {
  data: GetTweetsResponseElement[];
}

interface GetCommentsArrayElement {
  _id: string;
  author: { username: string; profilePic: string; name: string }[];
  createdAt: Date;
  comment: string;
  likes: number;
  replyCount: string[];
  media?: string[];
  liked: string[];
}

interface GetCommentsResponse {
  data: {
    comments: GetCommentsArrayElement[];
  };
}

interface TweetRepliesProps
  extends Pick<
    TweetProps,
    "authorName" | "authorUserName" | "authorProfilePic"
  > {
  commentText: string;
  likesCount: number;
  commentCreationDate: Date;
  commentId: string;
  isLiked: boolean;
  replyCount: string[];
  mediaList?: string[];
}

interface GetFollowingAndFollowersElement {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
  followed: string[];
}

interface GetFollowingAndFollowersResponse {
  data: GetFollowingAndFollowersElement[];
}

interface FollowerInfoProps {
  RawData: GetFollowingAndFollowersResponse;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NoTweetsToShowProps {
  message: string;
}

interface TweetsDataListProps {
  TweetsData: GetTweetsResponse;
  getMoreTweets: () => Promise<void>;
  hasMoreTweets: boolean;
  setHasMoreTweets: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GetCommentRepliesElement {
  _id: string;
  author: { _id: string; name: string; username: string; profilePic: string }[];
  comment: string;
  createdAt: Date;
  likes: number;
  liked: string[];
}

interface GetCommentRepliesResponse {
  data: GetCommentRepliesElement[];
}

interface CommentReplyProps {
  replyId: string;
  reply: string;
  replyCreationDate: Date;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorProfilePic: string;
  likesCount: number;
  isLiked: boolean;
}
