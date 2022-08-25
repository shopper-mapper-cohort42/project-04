import { Routes, Route } from "react-router-dom";
import Location from "./Location";
import WelcomePage from "./WelcomePage";
import Results from "./Results";
import SearchItems from "./SearchItems";
const apiKey = "SbABP9Vr89Ox8a38s29QPLUQm51xa784";

function Main() {
  return (
    <>
      <main id="mainContent">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/location" element={<Location apiKey={apiKey} />} />

          <Route
            path="/location/:coords"
            element={<SearchItems apiKey={apiKey} />}
          />
          <Route
            path="/location/:coords/:searchItem"
            element={<Results apiKey={apiKey} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default Main;
