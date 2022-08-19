import "./App.css";
import Location from "./Location";
import WelcomePage from "./WelcomePage";
import { Link, Routes, Route } from "react-router-dom";

function App() {
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
