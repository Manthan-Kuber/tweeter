import Image from "next/image";
import styled from "styled-components";

const ProfileInfo = ({
  name,
  profilePic,
  followerCount,
  ...props
}: ProfileInfoProps) => {
  return (
    <ProfileInfoWrapper>
      <ProfilePic src={profilePic} width={42} height={37} />
      <UserInfoWrapper>
        <div>
          <span>{name}</span>
          <span>@ {props.username} </span>
        </div>
        {props.tweetCreationDate && <span>・{props.tweetCreationDate}</span>}
      </UserInfoWrapper>
    </ProfileInfoWrapper>
  );
};
export default ProfileInfo;

const ProfilePic = styled(Image)`
  border-radius: 6px;
`;

export const ProfileInfoWrapper = styled.div`
  display: flex;
  gap: 2rem;
  span {
    display: block;
  }
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: baseline;
  & > div:first-child > span:first-child {
    font: 500 1.6rem var(--ff-poppins);
    color: black;
  }
  span {
    font: 500 1.4rem var(--ff-poppins);
    color: hsla(0, 0%, 51%, 1);
    font-size: 1.2rem;
  }
`;
