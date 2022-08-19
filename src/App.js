import "./App.css";
import Location from "./Location";
import WelcomePage from "./WelcomePage";
import Header from "./Header";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";
import homeImage from "./assets/home-image.png";

const apiKey = "SbABP9Vr89Ox8a38s29QPLUQm51xa784";

function App() {
  /*
  // Place Search API Template

  // Testing Parameters
  const longitude = -79.3832;
  const latitude = 43.6532;
  const sort = 'relevance'
  const radius = 10000;
  const userQuery = 'clothing';

  const placeSearchResults = axios({
    url: `https://www.mapquestapi.com/search/v4/place`,
    params: {
      location: `${longitude},${latitude}`,
      sort: sort,
      feedback: false,
      key: apiKey,
      circle: `${longitude},${latitude},${radius}`,
      pageSize: 50,
      q: userQuery
    }
  }).then((response) => {
    console.log(response.data.results)
  })
  */

  return (
    <>
      <div className="App">
        <Header />
        <main id="mainContent">
          <section className="welcomePageDiv">
            <Routes>
              <Route path={"/"} element={<WelcomePage />} />
              <Route path={"/location"} element={<Location />}></Route>
            </Routes>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;

// apikey:SbABP9Vr89Ox8a38s29QPLUQm51xa784
