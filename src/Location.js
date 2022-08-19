import { Link } from "react-router-dom";

function Location() {
  return (
    <>
      <button className="enterLocation">Enter Location</button>
      <button className="findLocation">Find Location</button>
      <button className="backButton">
        <Link to={"/"}>Back Button</Link>
      </button>
    </>
  );
}

export default Location;
