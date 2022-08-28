import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <>
      <section className="welcomePageDiv">
        <div className="wrapper">
          <div className="subHeaderBox">
            <h2>Average Results for Average People</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <p>
              Pellentesque convallis mauris urna, dictum efficitur eros finibus
              dignissim.
            </p>
          </div>
          <div className="getStartedButtonDiv">
            <Link to={"/location"} className="getStartedButton blueButton">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default WelcomePage;
