import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <>
      <div className="wrapper">
        <div className="subHeaderBox">
          <h2>Average Results for Average People</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          <p>
            Pellentesque convallis mauris urna, dictum efficitur eros finibus
            dignissim.
          </p>
        </div>

        <button className="getStartedButton">
          <Link to={"/location"}>Get Started</Link>
        </button>
      </div>
    </>
  );
}

export default WelcomePage;
