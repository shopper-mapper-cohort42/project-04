import "./App.css";
import Location from "./Location";
import WelcomePage from "./WelcomePage";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";

const apiKey = 'SbABP9Vr89Ox8a38s29QPLUQm51xa784';

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
        <h1>Shopper Mapper App'er</h1>
        <h2>Average Results for Average People</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est nisi
          voluptates perspiciatis laudantium repellat totam doloribus at
          repellendus repudiandae delectus aspernatur ex neque reprehenderit
          quod, consectetur, id distinctio autem velit.
        </p>
      </div>

      <Routes>
        <Route path={"/"} element={<WelcomePage />} />

        <Route path={"/location"} element={<Location />}></Route>
      </Routes>
    </>
  );
}

export default App;

// apikey:SbABP9Vr89Ox8a38s29QPLUQm51xa784
