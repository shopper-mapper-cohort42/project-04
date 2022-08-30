import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDirections,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";

// Mount the Results.js component once we have the user's current location and their search query (e.g. coffee)

// NOTE: We can pass that information into this component either through router or props
// For now, I've left that information as these placeholder variables
let currentLocation = {
  longitude: -79.3832,
  latitude: 43.6532,
};
let userQuery = "construction";

// NOTE: When we add in props, use the line below instead:
// export default function Results ({apiKey, currentLocation, userQuery}) {
export default function Results({
  apiKey,
  mapState,
  searchResultsLayer,
  setSearchResultsLayer,
  searchResultsLayerDefined,
  setSearchResultsLayerDefined,
  destination,
  setDestination,
}) {
  //imported from params
  const { coords, searchItem } = useParams();
  const navigate = useNavigate();

  //updating the currentLocation
  currentLocation.longitude = coords.split(",")[0];
  currentLocation.latitude = coords.split(",")[1];
  userQuery = searchItem;

  // loading state for api call

  const [loadingState, setLoadingState] = useState(false);

  // State variables that don't need to become prop/route params
  const [searchRadius, setSearchRadius] = useState(10); // For getting the search radius
  const [resultsArray, setResultsArray] = useState([]); // For displaying search results
  const [indicesToHighlight, setIndicesToHighlight] = useState([]); // For highlighting specific search results
  const [storePhotos, setStorePhotos] = useState([]);

  // checks state to open radius menu mobile
  const [openRadius, setOpenRadius] = useState(false);

  // checks state to hide results menu on desktop
  const [hideResults, setHideResults] = useState(false);
  const [toggleHamburger, setToggleHamburger] = useState(false);

  // Controlled input for radius changing and form submit handler
  const [searchRadiusInput, setSearchRadiusInput] = useState(10);
  const handleSearchRadiusInputChange = function (e) {
    const { value } = e.target;
    setSearchRadiusInput(value);
  };
  const handleSubmitSearchRadiusChange = function (e) {
    e.preventDefault();
    setSearchRadius(searchRadiusInput);
  };

  // Helper Function for calculating straight path distance, from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  // NOTE: Not sure if we need this, but it gives the direct distance (ignoring roads, i.e. if you were to fly directly from one point to the other) between two long/lat points in kilometers. Alternatively, we can probably show the actual road distance with the distance API later on.
  const lonLatDistance = function (lon1, lat1, lon2, lat2) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
  };

  useEffect(() => {
    const unsplashApiKey = "EdiposNhsc-ZFDGSbSFb-BXp2VjbYeohfAUoUGdo2MA"; //dsddDM5If1dZktxt2jefA-bUa5Sc-rWDXcKcRjGPYrM
    axios({
      url: `https://api.unsplash.com/search/photos`,
      method: "GET",
      dataResponse: "json",
      params: {
        client_id: unsplashApiKey,
        query: userQuery,
        per_page: 30,
      },
    }).then((response) => {
      const photos = response.data.results;
      setStorePhotos(photos);
    });
  }, [searchRadius]);

  useEffect(() => {
    const sliderProgress = document.querySelector("input[type='range']");
    sliderProgress.style.background = `linear-gradient(90deg, var(--blue) ${
      searchRadiusInput * 5
    }%, rgb(192, 192, 192) ${searchRadiusInput * 5}%)`;
  }, [searchRadiusInput]);

  // Make axios call when this component is mounted, or when radius changes
  useEffect(() => {
    setLoadingState(true);
    const options = {
      sort: "relevance",
      feedback: false,
      key: apiKey,
      circle: `${currentLocation.longitude},${currentLocation.latitude},${
        searchRadius * 1000
      }`,
      pageSize: 50,
      q: userQuery,
    };

    window.L.mapquest.key = apiKey;
    window.L.mapquest.search().place(options, (error, response) => {
      if (!searchResultsLayerDefined) {
        setSearchResultsLayerDefined(true);
        setSearchResultsLayer(
          window.L.mapquest
            .searchLayer({
              searchResponse: response,
            })
            .addTo(mapState)
            .on("search_marker_clicked", (e) => {
              handleSubmitDestination(e);
            })
        );
      } else {
        searchResultsLayer.setSearchResponse(response);
      }

      const responseArray = response.results;

      if (!responseArray.length) {
        setLoadingState(false);

        // if there are no results, highlight nothing
        setIndicesToHighlight([]);
      } else if (responseArray.length % 2) {
        // if odd number of results, highlight the middle result

        // set loading state here
        setTimeout(() => {
          setLoadingState(false);
        }, 500);

        setIndicesToHighlight([Math.floor(responseArray.length / 2)]);
      } else {
        // set loading state here
        setTimeout(() => {
          setLoadingState(false);
        }, 500);
        // if even number of results, highlight the middle two results
        setIndicesToHighlight([
          responseArray.length / 2,
          responseArray.length / 2 - 1,
        ]);
      }

      setResultsArray(responseArray);
    });
  }, [searchRadius]); // SUGGESTION: We can also make the list update live as the user changes the search radius, but it could be more laggy.

  // Brings you to directions component on Result Click or Map Result Click
  const handleSubmitDestination = (destinationParam) => {
    setDestination(destinationParam);
    navigate(
      `/location/${coords}/${searchItem}/${destinationParam.displayString}`
    );
  };

  return (
    <>
      {loadingState === false ? (
        <section className="resultsSection">
          <div className="wrapper">
            <div className="searchItemDiv">
              <Link
                to={`/location/${currentLocation.longitude},${currentLocation.latitude}`}
                className="backButton returnLinks returnToMain resultBack"
              >
                <FontAwesomeIcon icon={faAngleLeft} />
                BACK
              </Link>
            </div>

            <div className={hideResults ? "resultsDiv active" : "resultsDiv"}>
              <div
                className={
                  hideResults ? "hamburgerMenu active" : "hamburgerMenu"
                }
                tabIndex="0"
                onClick={() =>
                  toggleHamburger
                    ? setToggleHamburger(false)
                    : setToggleHamburger(true)
                }
              >
                <span className="lineOne hbLine"></span>
                <span className="lineTwo hbLine"></span>
                <span className="lineThree hbLine"></span>
              </div>
              <button
                className="minimizeResults"
                onClick={() =>
                  hideResults ? setHideResults(false) : setHideResults(true)
                }
                tabIndex="0"
              >
                <FontAwesomeIcon
                  className="minimizeResultsIcon"
                  icon={hideResults ? faAngleLeft : faAngleRight}
                />
                <span className="sr-only">
                  {hideResults ? "Open Results Menu" : "Close Results Menu"}
                </span>
              </button>
              <div
                className={
                  toggleHamburger ? "extraButtonsDiv active" : "extraButtonsDiv"
                }
              >
                <div
                  className="closeMenu"
                  onClick={() =>
                    toggleHamburger
                      ? setToggleHamburger(false)
                      : setToggleHamburger(true)
                  }
                >
                  <FontAwesomeIcon icon={faAngleUp} />
                </div>
                <button
                  className="returnToMain changeRadiusBtn"
                  onClick={() => {
                    openRadius ? setOpenRadius(false) : setOpenRadius(true);
                  }}
                >
                  Change Search Radius
                </button>
              </div>
              <span
                className="expandResults"
                onClick={() =>
                  hideResults ? setHideResults(false) : setHideResults(true)
                }
              ></span>
              <div
                className={
                  openRadius
                    ? "changeSearchRadiusDiv active"
                    : "changeSearchRadiusDiv"
                }
              >
                <form onSubmit={handleSubmitSearchRadiusChange}>
                  <div className="rangeSlider">
                    <input
                      type="range"
                      id="searchRadiusInput"
                      className="searchRadiusInput"
                      min="0"
                      max="20"
                      value={searchRadiusInput}
                      onChange={handleSearchRadiusInputChange}
                    />
                    <label
                      className="radiusLabel"
                      htmlFor="searchRadiusInput"
                    >{`${searchRadiusInput} km`}</label>
                  </div>
                  <button className="updateResults">
                    Update Search Results
                  </button>
                </form>
              </div>

              <h2>Results</h2>
              {/* Ordered list to display the results by relevance */}
              <ol
                className={
                  hideResults ? "resultsOrderList active" : "resultsOrderList"
                }
              >
                {resultsArray.map((result, resultIndex) => {
                  const resultLocation = {
                    longitude: result.place.geometry.coordinates[0],
                    latitude: result.place.geometry.coordinates[1],
                  };

                  const randomImage = Math.floor(
                    Math.random() * storePhotos.length
                  );
                  return (
                    // HIGHLIGHTED RENDERING

                    <li
                      key={result.id}
                      className={
                        indicesToHighlight.indexOf(resultIndex) >= 0
                          ? "mostAverage"
                          : null
                      }
                    >
                      <div className="shopImageDiv">
                        <div className="shopImageContainer">
                          <img
                            src={storePhotos[randomImage].urls.small}
                            alt={storePhotos[randomImage].alt_description}
                          />
                        </div>
                      </div>
                      <div className="shopTextDiv">
                        {
                          // NOTE: {indicesToHighlight.indexOf(resultIndex) >= 0} being TRUE is used for the highlighted rendering, if you want to put it elsewhere
                          indicesToHighlight.indexOf(resultIndex) >= 0 ? (
                            <h3 className="mostAverageTitle">
                              ⭐Most Average Shop⭐
                            </h3>
                          ) : null // null is the NON-HIGHLIGHTED RESULT
                        }
                        <h3>{result.name}</h3>
                        <p>{result.displayString.split(`${result.name},`)}</p>
                        <p className="resultsDistance">
                          ~{lonLatDistance(
                            currentLocation.longitude,
                            currentLocation.latitude,
                            resultLocation.longitude,
                            resultLocation.latitude
                          ).toFixed(2)}{" "}
                          km away
                        </p>
                      </div>
                      <div className="shopDirectionDiv">
                        <span className="sr-only">
                          Directions to {result.name}
                        </span>
                        <FontAwesomeIcon
                          className="directionIcon"
                          tabIndex="0"
                          icon={faDirections}
                          onClick={() => {
                            handleSubmitDestination(result);
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      ) : (
        <div className="wrapper">
          <Loading />
        </div>
      )}
    </>
  );
}
