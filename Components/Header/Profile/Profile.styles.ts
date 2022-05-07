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
`
