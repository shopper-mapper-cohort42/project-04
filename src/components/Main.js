import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Location from "./Location";
import WelcomePage from "./WelcomePage";
import Results from "./Results";
import SearchItems from "./SearchItems";
import Directions from "./Directions"
const apiKey = "SbABP9Vr89Ox8a38s29QPLUQm51xa784";

function Main({ mapState }) {
  
  // Geocoding Layer States and Clear Function
  const [geocodingLayer, setGeocodingLayer] = useState({});
  const [geocodingLayerDefined, setGeocodingLayerDefined] = useState(false);

  const clearGeocodingLayer = (mapStateParam, geocodingLayerParam) => {
    console.log(mapStateParam, geocodingLayerParam)
    mapStateParam.removeLayer(geocodingLayerParam)
    setGeocodingLayerDefined(false);
  }

  // Results Layer States and Clear Function
  const [searchResultsLayer, setSearchResultsLayer] = useState({});
  const [searchResultsLayerDefined, setSearchResultsLayerDefined] = useState(false);

  // Destination State
  const [destination, setDestination] = useState('')

  const clearSearchResultsLayer = (mapStateParam, searchResultsLayerParam) => {
    mapStateParam.removeLayer(searchResultsLayerParam);
    setSearchResultsLayerDefined(false);
  }

  // Directions State Layers
  const [directionsLayer, setDirectionsLayer] = useState({})
  const [directionsLayerDefined, setDirectionsLayerDefined] = useState(false);
  const clearDirectionsLayer = ( mapStateParam, directionsLayerParam) => {
    mapStateParam.removeLayer(directionsLayerParam);
    setDirectionsLayerDefined(false);
  }

  const clearAllLayers = (mapStateParam, geocodingLayerParam, searchResultsLayerParam, directionsLayerParam) => {
    clearGeocodingLayer(mapStateParam, geocodingLayerParam)
    clearSearchResultsLayer(mapStateParam, searchResultsLayerParam)
    clearDirectionsLayer(mapStateParam, directionsLayerParam)
  }


  return (
    <>
      <div>
        <p>Clear Map (Debugging Buttons)</p>
        <button onClick={() => { clearGeocodingLayer(mapState, geocodingLayer) }}>Clear Current Location Marker</button>
        <button onClick={() => { clearSearchResultsLayer(mapState, searchResultsLayer) }}>Clear Results Layer</button>
        <button onClick={() => { clearDirectionsLayer(mapState, directionsLayer) }}>Clear Directions Layer</button>
        <button onClick={() => { clearAllLayers(mapState, geocodingLayer, searchResultsLayer, directionsLayer)}}></button>
      </div>

      <main id="mainContent">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/location" element={<Location
            apiKey={apiKey}
            mapState={mapState}
            geocodingLayer={geocodingLayer}
            setGeocodingLayer={setGeocodingLayer}
            geocodingLayerDefined={geocodingLayerDefined}
            setGeocodingLayerDefined={setGeocodingLayerDefined}
          />} />

          <Route
            path="/location/:coords"
            element={<SearchItems apiKey={apiKey} />}
          />

          <Route
            path="/location/:coords/:searchItem"
            element={<Results
              apiKey={apiKey}
              mapState={mapState}
              searchResultsLayer={searchResultsLayer}
              setSearchResultsLayer={setSearchResultsLayer}
              searchResultsLayerDefined={searchResultsLayerDefined}
              setSearchResultsLayerDefined={setSearchResultsLayerDefined}
              destination={destination}
              setDestination={setDestination}
            />}
          />

          <Route
            path="/location/:coords/:searchItem/:destinationCoords"
            element={
              <Directions
                apiKey={apiKey}
                mapState={mapState}
                destination={destination}
                directionsLayer={directionsLayer}
                setDirectionsLayer={setDirectionsLayer}
                directionsLayerDefined={directionsLayerDefined}
                setDirectionsLayerDefined={setDirectionsLayerDefined}
              />
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default Main;
