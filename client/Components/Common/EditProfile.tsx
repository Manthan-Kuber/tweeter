import Image from "next/image";
import { useRef, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import styled from "styled-components";

const InitialState = {
    fname:"",
    lname:"",
    username:"",
    password:"",
    cpassword:"",
    bio:"",
}

const EditProfile = (props: EditProfileProps) => {
  const bannerRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);
  const [coverPictureDisplay, setcoverPictureDisplay] = useState(
    props.coverPic
  );
  const [profilePictureDisplay, setProfilePictureDisplay] = useState(
    props.profilePic
  );
  const [coverPictureFile, setCoverPictureFile] = useState<File>();
  const [profilePictureFile, setProfilePictureFile] = useState<File>();
  const [formValues, setFormValues] = useState(InitialState)

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
      <form>
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
        {/* <InputGroup
            formValues={formValues}
            setformValues={setFormValues}
            value={formValues.fname}
            name="fname"
            placeholder="First Name"
            type="text"
          />
          <InputGroup
            formValues={formValues}
            setformValues={setFormValues}
            value={formValues.lname}
            name="lname"
            placeholder="Last Name"
            type="text"
          /> */}
      </form>
    </EditProfileContentContainer>
  );
};

const ProfileImageContainer = styled.div`
  position: relative;
  margin-top: -5rem;
  width: fit-content;
  margin-left: 1rem;
  height: fit-content;
  padding: 4px 4px 0 4px;
  border-radius: 100%;
  background-color: white;
`;

const ProfileImage = styled(Image)`
  border-radius: 100%;
`;

const EditProfileContentContainer = styled.div``;

const ProfilePicContainer = styled.div`
  position: relative;
`;

const BannerContainer = styled.div`
  position: relative;
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
