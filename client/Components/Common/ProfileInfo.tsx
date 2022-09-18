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
      <ProfilePicWrapper>
        <ProfilePic src={profilePic} layout="fill" />
      </ProfilePicWrapper>
      <InfoWrapper>
        <UsernameContainer>
          <p>{name}</p>
          <p>@{props.username}</p>
        </UsernameContainer>
        {props.tweetCreationDate && (
          <DateText>{props.tweetCreationDate}</DateText>
        )}
      </InfoWrapper>
    </ProfileInfoWrapper>
  );
};
export default ProfileInfo;

const InfoWrapper = styled.div`
  font: 500 clamp(1.2rem, 1.5vw, 1.4rem) var(--ff-poppins);
`;

const DateText = styled.span`
  color: hsla(0, 0%, 51%, 1);
`;

const UsernameContainer = styled.div`
  display: flex;
  font-size: clamp(1.4rem, 1.5vw, 1.6rem);
  white-space: nowrap;
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;

    @media screen and (min-width: 21em) {
      max-width: 100px;
    }

    @media screen and (min-width: 30em) {
      max-width: calc(100% - 2rem);
      width: revert;
    }
  }
`;

const ProfilePicWrapper = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
`;

const ProfilePic = styled(Image)`
  border-radius: 6px;
`;

export const ProfileInfoWrapper = styled.div`
  display: flex;
  gap: 1rem;
  text-overflow: ellipsis;
  @media screen and (min-width: 21em) {
    gap: 2rem;
  }
`;
