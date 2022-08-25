import homeImage0 from "../assets/store-1.png";
import homeImage1 from "../assets/store-2.png";
import homeImage2 from "../assets/store-3.png";
import homeImage3 from "../assets/store-4.png";

function Header() {
  const images = [homeImage0, homeImage1, homeImage2, homeImage3];

  console.log(images);
  return (
    <header>
      <div className="wrapper">
        <h1>Easy Click</h1>
        <div className="heroImageDiv">
          <div className="imageSlide">
            {images.map((image, index) => {
              return <img src={image} key={index} className="image" />;
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;