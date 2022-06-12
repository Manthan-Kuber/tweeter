export const errHandler = (err: any) => {
  console.log(err.message, err.code);

  let errors = {
    name:"",
    email: "",
    password: "",
  };

  if (err.message === "Incorrect Email") {
    errors.email = "Incorrect Email Entered";
  }

  if (err.message === "Incorrect Password") {
    errors.password = "Incorrect Password Entered";
  }

  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }: any) => {
      errors[properties.path as keyof typeof errors] = properties.message;
    });
  }

  return errors;
};
