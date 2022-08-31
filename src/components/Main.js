import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Location from "./Location";
import WelcomePage from "./WelcomePage";
import Results from "./Results";
import SearchItems from "./SearchItems";
import Directions from "./Directions";
import MapComponent from "./MapComponent";
const apiKey = "jrZujlqyshVE4BGwlkCkGGCNfjkLmiHk";

function Main() {
  // Geocoding Layer States and Clear Function
  const [geocodingLayer, setGeocodingLayer] = useState({});
  const [geocodingLayerDefined, setGeocodingLayerDefined] = useState(false);

  const clearGeocodingLayer = (mapStateParam, geocodingLayerParam) => {
    mapStateParam.removeLayer(geocodingLayerParam);
    setGeocodingLayerDefined(false);
  };

  // Results Layer States and Clear Function
  const [searchResultsLayer, setSearchResultsLayer] = useState({});
  const [searchResultsLayerDefined, setSearchResultsLayerDefined] =
    useState(false);

  // Destination State
  const [destination, setDestination] = useState("");

  const clearSearchResultsLayer = (mapStateParam, searchResultsLayerParam) => {
    mapStateParam.removeLayer(searchResultsLayerParam);
    setSearchResultsLayerDefined(false);
  };

  // Directions State Layers
  const [directionsLayer, setDirectionsLayer] = useState({});
  const [directionsLayerDefined, setDirectionsLayerDefined] = useState(false);
  const clearDirectionsLayer = (mapStateParam, directionsLayerParam) => {
    mapStateParam.removeLayer(directionsLayerParam);
    setDirectionsLayerDefined(false);
  };

  const clearAllLayers = (
    mapStateParam,
    geocodingLayerParam,
    searchResultsLayerParam,
    directionsLayerParam
  ) => {
    try {
      clearGeocodingLayer(mapStateParam, geocodingLayerParam);
      clearSearchResultsLayer(mapStateParam, searchResultsLayerParam);
      clearDirectionsLayer(mapStateParam, directionsLayerParam);
    } catch (error) {
      // navigate(
      //   `/location/${coords}/${searchItem}/${destinationParam.displayString}`
      // );
    }
  };

  // Create and mount the map state
  const [mapState, setMapState] = useState({});
  useEffect(() => {
    // Mapquest/API Key
    window.L.mapquest.key = "Ly2CHsAhxGvzncY98vcRBQDokGoO0EMZ";
    let map = window.L.mapquest.map("map", {
      center: [56.1304, -106.3468],
      layers: window.L.mapquest.tileLayer("map"),
      zoom: 4,
      zoomControl: false,
    });
    //map.addControl(window.L.mapquest.control({position: 'topleft'}));

    window.L.control
      .zoom({
        position: "topleft",
      })
      .addTo(map);

    setMapState(map);
  }, []);

  return (
    <>
      <main id="mainContent">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route
            path="/location"
            element={
              <Location
                apiKey={apiKey}
                mapState={mapState}
                geocodingLayer={geocodingLayer}
                setGeocodingLayer={setGeocodingLayer}
                geocodingLayerDefined={geocodingLayerDefined}
                setGeocodingLayerDefined={setGeocodingLayerDefined}
                clearAllLayers={() => {
                  clearAllLayers(
                    mapState,
                    geocodingLayer,
                    searchResultsLayer,
                    directionsLayer
                  );
                }}
              />
            }
          />

          <Route
            path="/location/:coords"
            element={<SearchItems apiKey={apiKey} />}
          />

          <Route
            path="/location/:coords/:searchItem"
            element={
              <Results
                apiKey={apiKey}
                mapState={mapState}
                searchResultsLayer={searchResultsLayer}
                setSearchResultsLayer={setSearchResultsLayer}
                searchResultsLayerDefined={searchResultsLayerDefined}
                setSearchResultsLayerDefined={setSearchResultsLayerDefined}
                destination={destination}
                setDestination={setDestination}
              />
            }
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
        <MapComponent mapState={mapState} />
      </main>
    </>
  );
}

export default Main;
