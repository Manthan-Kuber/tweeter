import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import styled from "styled-components";
import axiosApi from "../../app/services/axiosApi";
import { setProfilePic } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/store";
import {
  Icon,
  PlaceholderText,
  StyledInput,
  Text,
  Wrapper,
} from "../../styles/inputGroup.styles";
import { TweetButton } from "./CreateTweet";

const EditProfile = (props: EditProfileProps) => {
  const InitialState = {
    name: props.name,
    username: props.username,
    password: "",
    cpassword: "",
    bio: props.bio,
  };

  const [coverPictureDisplay, setcoverPictureDisplay] = useState(
    props.coverPic
  );
  const [profilePictureDisplay, setProfilePictureDisplay] = useState(
    props.profilePic
  );
  const [coverPictureFile, setCoverPictureFile] = useState<File>();
  const [profilePictureFile, setProfilePictureFile] = useState<File>();
  const [formValues, setFormValues] = useState(InitialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [errMess, setErrMess] = useState("");
  const bannerRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);
  const passwordIconRef = useRef<HTMLInputElement>(null);
  const cpasswordIconRef = useRef<HTMLInputElement>(null);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const requestConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    props.setEditProfileModalIsOpen(false);

    const profileFormData = new FormData();

    profileFormData.append("name", formValues.name);
    profileFormData.append("username", formValues.username);
    profileFormData.append("bio", formValues.bio);

    if (formValues.password !== "" && formValues.cpassword !== "")
      profileFormData.append("password", formValues.password);

    coverPictureFile !== undefined &&
      profileFormData.append("coverPic", coverPictureFile as File);

    profilePictureFile !== undefined &&
      profileFormData.append("profilePic", profilePictureFile as File);

    try {
      const response = await axiosApi.put(
        "/profile/edit",
        profileFormData,
        requestConfig
      );
      const { name, username, bio } = formValues;
      // const pfp = profilePictureFile as Blob;
      // const coverpic = coverPictureFile as Blob;
      dispatch(setProfilePic(response.data.data.profilePic)); //set with response's url
      // dispatch(setCoverp)
      props.setProfileData((prev) => ({ ...prev, name, username, bio }));
      console.log(response.data.data.profilePic);
      console.log(response.data.data.coverPic);
      profilePictureFile !== undefined &&
        props.setProfileData((prev) => ({
          ...prev,
          profilePic: response.data.data.profilePic, //set with response's url
        }));
      coverPictureFile !== undefined &&
        props.setProfileData((prev) => ({
          ...prev,
          coverPic: response.data.data.coverPic, //set with response's url
        }));
      if (profilePictureFile !== undefined || coverPictureFile !== undefined)
        window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const inputFieldList = [
    {
      id: 1,
      name: "name",
      type: "text",
      value: formValues.name,
      placeholder: "Name",
      required: true,
    },
    {
      id: 2,
      name: "username",
      type: "text",
      value: formValues.username,
      placeholder: "Username",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      value: formValues.password,
      placeholder: "New Passsword",
    },
    {
      id: 4,
      name: "cpassword",
      type: "password",
      value: formValues.cpassword,
      placeholder: "Confirm Passsword",
    },
  ];

  useEffect(() => {
    setIsFormInvalid(false);
    setErrMess("");
    if (
      formValues.name === "" ||
      formValues.username === "" ||
      formValues.bio === ""
    )
      setIsFormInvalid(true);
    if (!(formValues.password === formValues.cpassword)) {
      setIsFormInvalid(true);
      setErrMess("Passwords don't match");
    }
  }, [formValues]);

  return (
    <EditProfileContentContainer>
      <BannerContainer>
        <Image
          src={coverPictureDisplay}
          className="banner-image"
          alt="banner"
          layout="responsive"
          width={100}
          height={30}
          style={{ borderRadius: "8px" }}
        />
        <EditPhotoIconWrapper
          ref={bannerRef}
          onClick={(e: React.SyntheticEvent) =>
            bannerRef.current && bannerRef.current.click()
          }
        >
          <MdOutlineAddPhotoAlternate size={22} />
        </EditPhotoIconWrapper>
      </BannerContainer>
      <ProfileImageContainer>
        <ProfileImage
          src={profilePictureDisplay}
          alt="profilePic"
          width={120}
          height={120}
        />
        <EditPhotoIconWrapper
          ref={profileRef}
          onClick={(e: React.SyntheticEvent) =>
            profileRef.current && profileRef.current.click()
          }
        >
          <MdOutlineAddPhotoAlternate size={22} />
        </EditPhotoIconWrapper>
      </ProfileImageContainer>
      <form onSubmit={handleEditProfile}>
        <input
          type="file"
          ref={bannerRef}
          name="bannerState"
          hidden
          accept="image/jpeg,image/jpg,image/png"
          onChange={(e) => {
            if (e.target.files) {
              setcoverPictureDisplay(URL.createObjectURL(e.target.files[0]));
              setCoverPictureFile(e.target.files[0]);
            }
          }}
        />
        <input
          type="file"
          ref={profileRef}
          name="profileState"
          hidden
          accept="image/jpeg,image/jpg,image/png"
          onChange={(e) => {
            if (e.target.files) {
              setProfilePictureDisplay(URL.createObjectURL(e.target.files[0]));
              setProfilePictureFile(e.target.files[0]);
            }
          }}
        />

        {inputFieldList.map((item) => (
          <div key={item.id}>
            <Wrapper>
              <StyledInput
                type={
                  item.name === "password" && isPasswordVisible
                    ? "text"
                    : item.name === "cpassword" && isConfirmPasswordVisible
                    ? "text"
                    : item.type
                }
                name={item.name}
                value={item.value}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    [item.name]: e.target.value,
                  }))
                }
                required={item.required ? true : false}
                ref={
                  item.name === "password"
                    ? passwordIconRef
                    : item.name === "cpassword" //buggy
                    ? cpasswordIconRef
                    : null
                }
              />
              <PlaceholderText className="placeholder-text">
                <Text className="text">{item.placeholder}</Text>
              </PlaceholderText>
              {item.name === "password" ? (
                isPasswordVisible ? (
                  <Icon
                    as={AiFillEye}
                    size={20}
                    $cursorPointer
                    onClick={() => {
                      setIsPasswordVisible(!isPasswordVisible);
                      passwordIconRef.current?.focus();
                    }}
                  />
                ) : (
                  <Icon
                    as={AiFillEyeInvisible}
                    size={20}
                    $cursorPointer
                    onClick={() => {
                      setIsPasswordVisible(!isPasswordVisible);
                      passwordIconRef.current?.focus();
                    }}
                  />
                )
              ) : item.name === "cpassword" ? (
                isConfirmPasswordVisible ? (
                  <Icon
                    as={AiFillEye}
                    size={20}
                    $cursorPointer
                    onClick={() => {
                      setIsConfirmPasswordVisible((prev) => (prev = !prev));
                      cpasswordIconRef.current?.focus;
                    }}
                  />
                ) : (
                  <Icon
                    as={AiFillEyeInvisible}
                    size={20}
                    $cursorPointer
                    onClick={() => {
                      setIsConfirmPasswordVisible((prev) => (prev = !prev));
                      cpasswordIconRef.current?.focus;
                    }}
                  />
                )
              ) : null}
            </Wrapper>
            {item.name === "cpassword" && errMess && (
              <ErrorMessage>{errMess}</ErrorMessage>
            )}
          </div>
        ))}
        <Wrapper>
          <StyledInput
            as="textarea"
            maxLength={160}
            style={{ resize: "none" }}
            value={formValues.bio}
            name="bio"
            required={true}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setFormValues((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
          <PlaceholderText className="placeholder-text">
            <Text className="text">Bio</Text>
          </PlaceholderText>
        </Wrapper>
        <SubmitButton disabled={isFormInvalid}>Save Changes</SubmitButton>
      </form>
    </EditProfileContentContainer>
  );
};

const ErrorMessage = styled.small`
  color: red;
  font: 600 1.2rem var(--ff-noto);
  margin-left: 2rem;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  margin-top: -5rem;
  width: fit-content;
  margin-left: 1rem;
  height: fit-content;
  padding: 4px 4px 0 4px;
  border-radius: 8px;
  background-color: white;
`;

const ProfileImage = styled(Image)`
  border-radius: 8px;
`;

const SubmitButton = styled(TweetButton)`
  margin-top: 2rem;
  border-radius: 8px;
`;

const EditProfileContentContainer = styled.div``;

const ProfilePicContainer = styled.div`
  position: relative;
`;

const BannerContainer = styled.div`
  position: relative;
  border-radius: 8px;
`;

const EditPhotoIconWrapper = styled.div`
  padding: 1.25rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 100%;
  width: fit-content;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;
export default EditProfile;
