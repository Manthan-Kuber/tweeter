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
  filterList: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
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
  editProfileModalIsOpen: boolean;
  setEditProfileModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

//Remove Optional Later
interface ProfileInfoProps {
  name: string;
  followerCount: number;
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
}

type TweetProps = Pick<
  CreateTweetProps,
  "fileList" | "message" | "setMessage" | "setFileList" | "onSubmit"
>;

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
}
