import ContentLoader from "./ContentLoader";
import CustomModal from "./CustomModal";
import FollowerInfo from "./FollowerInfo";

const FollowerFollowingModal = (props: FollowerFollowingModalProps) => {
  return (
    <CustomModal
      setModalIsOpen={props.setFollowerModalIsOpen}
      modalIsOpen={props.followerModalIsOpen}
      name={props.name}
      username={props.username}
      followers={props.followers}
      following={props.following}
      modalTitle={props.modalTitle}
      shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
    >
      {props.GetFollowersData !== undefined ? (
        <FollowerInfo
          RawData={props.GetFollowersData}
          setModalIsOpen={props.setFollowerModalIsOpen} //Remove if not needed
        />
      ) : (
        <ContentLoader size={16} />
      )}
    </CustomModal>
  );
};
export default FollowerFollowingModal;
