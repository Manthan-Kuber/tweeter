import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Icon, PlaceholderText, StyledInput, Text, Wrapper } from "../../styles/inputGroup.styles";

function InputGroup({
  placeholder,
  icon,
  visible,
  setVisible,
  setformValues,
  formValues,
  type,
  name,
  value,
  myRef,
}: InputGroupProps) {
  return (
    <Wrapper>
      <StyledInput
        type={type && visible ? "text" : type}
        name={name}
        value={value}
        onChange={(e) =>
          setformValues({ ...formValues, [name]: e.currentTarget.value })
        }
        ref={myRef}
      />
      <PlaceholderText
        className="placeholder-text"
        htmlFor={name}
        id={`placeholder-${name}`}
      >
        <Text className="text">{placeholder}</Text>
      </PlaceholderText>
      {icon === "password" ? (
        visible ? (
          <Icon
            as={AiFillEye}
            size={20}
            $cursorPointer
            onClick={
              setVisible
                ? () => {
                    setVisible(!visible);
                    myRef?.current?.focus();
                  }
                : undefined
            }
          />
        ) : (
          <Icon
            as={AiFillEyeInvisible}
            size={20}
            $cursorPointer
            onClick={
              setVisible
                ? () => {
                    setVisible(!visible);
                    myRef?.current?.focus();
                  }
                : undefined
            }
          />
        )
      ) : null}
    </Wrapper>
  );
}
export default InputGroup;


