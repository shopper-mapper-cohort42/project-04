import homeImage0 from "../assets/store-1.png";
import homeImage1 from "../assets/store-2.png";
import homeImage2 from "../assets/store-3.png";
import homeImage3 from "../assets/store-4.png";
import { useContext } from "react";
import { DarkModeContext } from "./DarkModeContext";

function Header() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const images = [homeImage0, homeImage1, homeImage2, homeImage3];

  return (
    <header>
      <div className="wrapper">
        <h1>Shopper Mapper</h1>
        <div className="heroImageDiv">
          <div className="imageSlide">
            {images.map((image, index) => {
              return (
                <img
                  src={image}
                  key={index}
                  alt="Isometric illustration of a store"
                  className="image"
                />
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
