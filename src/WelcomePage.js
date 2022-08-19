import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <button>
      <Link to={"/location"}>Get Started</Link>
    </button>
  );
}

export default WelcomePage;
