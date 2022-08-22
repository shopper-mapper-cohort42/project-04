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
      </div>
    </header>
  );
}

export default Header;
