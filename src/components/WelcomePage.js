import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <>
      <section className="welcomePageDiv">
        <div className="wrapper">
          <div className="subHeaderBox">
            <h1>Shopper Mapper</h1>
            <h2>Exceedingly Average Map App</h2>
            <p>
              If you need to find somewhere to grab a bite or get your coffee
              fix, this application can help! Just input your current location
              and it will find nearby places.
            </p>
            <div className="getStartedButtonDiv">
              <Link to={"/location"} className="getStartedButton blueButton">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WelcomePage;
