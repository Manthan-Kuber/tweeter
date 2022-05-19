import styled from "styled-components";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  imgUrl: string;
}

function SignInIcon({ imgUrl }: Props) {
  return (
    <IconWrapper as={motion.div} whileHover={{ scale: 1.2, y: -5 }}>
      <Image src={imgUrl} width={24} height={24} />
    </IconWrapper>
  );
}
export default SignInIcon;

const IconWrapper = styled.div`
  border-radius: 100px;
  border: 1px solid #bdbdbd;
  width: fit-content;
  padding: 0.5rem;
  cursor: pointer;
  display: grid;
  align-items: center;
`;
