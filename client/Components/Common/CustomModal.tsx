import Modal from "react-modal";
import styled from "styled-components";
import { GrClose } from "react-icons/gr";
import { useEffect } from "react";

Modal.setAppElement("#__next");

const CustomModal = ({
  setModalIsOpen,
  modalIsOpen,
  children,
  ...props
}: ModalProps) => {
  useEffect(() => {
    if (modalIsOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [modalIsOpen]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel={`${props.modalTitle} Modal`}
      shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick || false}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 2,
        },
        content: {
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(95% , 60rem)",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "8px",
          outline: "none",
          maxHeight: `${props.maxModalHeight || "80vh"}`,
          height: `${props.modalHeight || "650px"}`,
          padding: "2rem",
        },
      }}
    >
      <MainWrapper>
        <CloseIconDivWrapper>
          <span>{props.modalTitle}</span>
          <CloseIconWrapper
            onClick={
              props.closeIconOnClick
                ? props.closeIconOnClick
                : () => setModalIsOpen(false)
            }
          >
            <GrClose size={16} />
          </CloseIconWrapper>
        </CloseIconDivWrapper>
        <hr />
        {children}
      </MainWrapper>
    </Modal>
  );
};
export default CustomModal;

const MainWrapper = styled.div`
  font: 600 1.4rem var(--ff-poppins);

  hr {
    border-color: hsla(0, 0%, 88%, 1);
    border-width: 1px;
  }
`;

const CloseIconWrapper = styled.div`
  cursor: pointer;
  border-radius: 100%;
  display: grid;
  place-items: center;
  padding: 8px;
  transition: all 0.4s;
  &:hover {
    background-color: rgba(130, 130, 130, 0.2);
  }
  &:active {
    background-color: rgba(130, 130, 130, 0.7);
  }
`;

const CloseIconDivWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
