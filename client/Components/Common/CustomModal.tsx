import Modal from "react-modal";
import styled from "styled-components";
import { useAppSelector } from "../../Hooks/store";
import { GrClose } from "react-icons/gr";

Modal.setAppElement("#__next");

const CustomModal = ({ setModalIsOpen, modalIsOpen }: ModalProps) => {
  const name = useAppSelector((state) => state.auth.user?.name);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Followers & Following Modal"
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
        content: {
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(95% , 80rem)",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          maxHeight: "64rem",
          padding: "2rem",
        },
      }}
    >
      <MainWrapper>
        <CloseIconDivWrapper>
          <span>{`${name} is following`}</span>
          <CloseIcon onClick={() => setModalIsOpen(false)}/>
        </CloseIconDivWrapper>
        <hr />
      </MainWrapper>
    </Modal>
  );
};
export default CustomModal;

const MainWrapper = styled.div`
  font: 600 1.4rem var(--ff-poppins);

  hr {
    border-color: hsla(0, 0%, 88%, 1);
  }
`;

const CloseIcon = styled(GrClose)`
  cursor: pointer;
  font-size: 1.4rem;
`;

const CloseIconDivWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
