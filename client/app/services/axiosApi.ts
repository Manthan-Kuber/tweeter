import axios from "axios";

export default axios.create({
  baseURL: "https://tweeter-app-backend.herokuapp.com/"
});
