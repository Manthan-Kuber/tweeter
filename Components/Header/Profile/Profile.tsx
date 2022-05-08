import { ProfileContainer, ProfilePic } from "./Profile.styles";
import { AiFillCaretDown } from "react-icons/ai";

interface Props {}
const Profile = (props: Props) => {
  return (
    <ProfileContainer>
      <ProfilePic
        src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
        width={42}
        height={37}
      />
      <h4>Marco Turser</h4>
      <AiFillCaretDown />
    </ProfileContainer>
  );
};
export default Profile;
