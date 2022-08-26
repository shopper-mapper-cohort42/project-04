import "./App.css";

import { useState, useEffect } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";


function App() {

  // Create and mount the map state
  const [mapState, setMapState] = useState({});
  useEffect(() => {
    // Mapquest/API Key
    window.L.mapquest.key = 'SbABP9Vr89Ox8a38s29QPLUQm51xa784';
    let map = window.L.mapquest.map('map', {
      center: [40, -80],
      layers: window.L.mapquest.tileLayer('map'),
      zoom: 12
    });
    //map.addControl(window.L.mapquest.control({position: 'topleft'}));

    setMapState(map);
 
  }, [])



  return (
    <>
      <div className="App">
        <Header />
        <div id="map" style={{ width: '1000px', height: '530px' }}></div>
        <Main mapState={mapState} />
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default App;
