import styled from "styled-components";
import Image from "next/image";

export const ProfilePic = styled(Image)`
  border-radius: 12px;
  border: 1px solid red;
`;

export const ProfileContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  font: 700 1.2rem var(--ff-noto);
  color: #333;
`;
