import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <>
      <div className="subHeaderBox">
        <h2>Average Results for Average People</h2>
      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      <p>
        Pellentesque convallis mauris urna, dictum efficitur eros finibus
        dignissim.
      </p>
      <button className="getStartedButton">
        <Link to={"/location"}>Get Started</Link>
      </button>
    </>
  );
}

export default WelcomePage;
