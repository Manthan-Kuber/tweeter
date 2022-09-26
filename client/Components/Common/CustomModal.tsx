import Modal from "react-modal";
import styled from "styled-components";
import { GrClose } from "react-icons/gr";
import { useEffect } from "react";
import { useRouter } from "next/router";

Modal.setAppElement("#__next");

const CustomModal = ({
  setModalIsOpen,
  modalIsOpen,
  children,
  ...props
}: ModalProps) => {
  const { style: bodyStyle } = document.body;
  useEffect(() => {
    bodyStyle.overflowY = modalIsOpen ? "hidden" : "auto";
  }, [modalIsOpen]);

  const router = useRouter();

  const goBackPath = router.asPath.split("?")[0];

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={(e) => {
        e.stopPropagation();
        if (setModalIsOpen) setModalIsOpen(false);
        else {
          router.beforePopState((state) => {
            state.options.scroll = false;
            return true;
          });
          router.push(goBackPath, undefined, { shallow: true });
        }
      }}
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
          top: props.modalTop || "10%",
          left: props.modalLeft || "50%",
          transform: "translateX(-50%)",
          width: props.modalWidth || "min(95% , 60rem)",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "8px",
          outline: "none",
          maxHeight: props.maxModalHeight || "80vh",
          height: props.modalHeight || "650px",
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
                : (e) => {
                    e.stopPropagation();
                    if (setModalIsOpen) setModalIsOpen(false);
                    else {
                      router.beforePopState((state) => {
                        state.options.scroll = false;
                        return true;
                      });
                      router.push(goBackPath, undefined, { shallow: true });
                    }
                  }
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
