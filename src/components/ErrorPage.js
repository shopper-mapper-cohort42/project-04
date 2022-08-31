import { Link } from "react-router-dom";
import errorImage from "../assets/error earth.gif";

export default function ErrorPage() {
  return (
    <div className="errorPageDiv">
      <img src={errorImage} alt="Animated Earth smiling" draggable="false" />

      <h2>There was an error loading the page.</h2>
      <p>Please try again!</p>
      <Link to={"/location"} className="getStartedButton blueButton">
        Go Back
      </Link>
    </div>
  );
}
