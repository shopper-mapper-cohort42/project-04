import homeImage from "./assets/home-image.png";
// import { Link } from "react-router-dom";
import WelcomePage from "./WelcomePage";
function Header() {
  return (
    <header>
      <div className="wrapper">
        <div className="heroImageDiv">
          <img src={homeImage} alt="" />
        </div>
        <h1>Shopper Mapper App'er</h1>
        <div className="subHeaderBox">
          <h2>Average Results for Average People</h2>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        <p>
          Pellentesque convallis mauris urna, dictum efficitur eros finibus
          dignissim.
        </p>
      </div>
    </header>
  );
}

export default Header;
