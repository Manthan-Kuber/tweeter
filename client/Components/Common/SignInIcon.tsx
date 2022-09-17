import styled from "styled-components";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  imgUrl: string;
}

const scaleOnHover = {
    whileHover:{ scale: 1.2,transition:{type:"spring",bounce:0,duration:0.15} }
}

function SignInIcon({ imgUrl }: Props) {
  return (
    <IconWrapper as={motion.div} variants={scaleOnHover} whileHover="whileHover">
      <Image src={imgUrl} alt="Icon" width={24} height={24} />
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
