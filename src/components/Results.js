import { useEffect, useState, useCallback } from "react";
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


export default function Results({
  apiKey,
  mapState,
  searchResultsLayer,
  setSearchResultsLayer,
  searchResultsLayerDefined,
  setSearchResultsLayerDefined,
  setDestination,
}) {

  //imported from params
  const { coords, searchItem } = useParams();
  const navigate = useNavigate();

  //updating the currentLocation
  const currentLocation = {
    longitude: coords.split(",")[0],
    latitude: coords.split(",")[1]
  };

  let userQuery = searchItem;

  // loading state for api call
  const [loadingState, setLoadingState] = useState(false);

  // State variables that don't need to become prop/route params
  const [searchRadius, setSearchRadius] = useState(10); // For getting the search radius
  const [resultsArray, setResultsArray] = useState([]); // For displaying search results
  const [indicesToHighlight, setIndicesToHighlight] = useState([]); // For highlighting specific search results
  const [storePhotos, setStorePhotos] = useState([]);

  // checks state to open radius menu mobile
  const [openRadius, setOpenRadius] = useState(false);

  // checks if there is search reslts
  const [shopResults, setShopResults] = useState(true);

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
    setOpenRadius(false);
  };

  // Helper Function for calculating straight path distance using long/lat, from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  const lonLatDistance = function (lon1, lat1, lon2, lat2) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
  };

  // Unsplash API call for search result photos
  useEffect(() => {
    const unsplashApiKey = "EdiposNhsc-ZFDGSbSFb-BXp2VjbYeohfAUoUGdo2MA";
    axios({
      url: `https://api.unsplash.com/search/photos`,
      method: "GET",
      dataResponse: "json",
      params: {
        client_id: unsplashApiKey,
        query: userQuery,
        per_page: 10,
        content_filter: "high",
      },
    }).then((response) => {
      const photos = response.data.results;
      setStorePhotos(photos);
    });
  }, [searchRadius]);

  // this will adjust the slider colour as the user slides the different value for the search radius
  useEffect(() => {
    const sliderProgress = document.querySelector("input[type='range']");
    sliderProgress.style.background = `linear-gradient(90deg, var(--blue) ${
      searchRadiusInput * 5
    }%, rgb(192, 192, 192) ${searchRadiusInput * 5}%)`;
  }, [searchRadiusInput, openRadius]);

  // Brings you to directions component on Result Click or Map Result Click
  const handleSubmitDestination = useCallback((destinationParam) => {
    setDestination(destinationParam);
    navigate(
      `/location/${coords}/${searchItem}/${destinationParam.displayString}`
    );
  }, [coords, searchItem])

  // Update results list when component is mounted, or when radius changes
  useEffect(
    () => {
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
        try {
          if (!searchResultsLayerDefined) {
            setSearchResultsLayerDefined(true);
            setSearchResultsLayer(
              window.L.mapquest
                .searchLayer({
                  searchResponse: response,
                })
                .addTo(mapState)
                .on("search_marker_clicked", (e) => {
                  setDestination(e);
                  handleSubmitDestination(e);
                })
            );
          } else {
            searchResultsLayer.setSearchResponse(response);
          }
        } catch (error) {
          navigate("/location");
        }

        const responseArray = response.results;

        if (!responseArray.length) {
          setLoadingState(false);
          setShopResults(false);
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
      
    },
    [
      searchRadius,
      apiKey,
      mapState,
      navigate,
      searchResultsLayer,
      searchResultsLayerDefined,
      setSearchResultsLayer,
      setSearchResultsLayerDefined,
      handleSubmitDestination
    ]
  );

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
                <span className="sr-only">Return to Previous Page</span>
              </Link>
            </div>

            <div className={hideResults ? "resultsDiv active" : "resultsDiv"}>
              <button
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
              </button>
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
                <button
                  className="closeMenu"
                  onClick={() =>
                    toggleHamburger
                      ? setToggleHamburger(false)
                      : setToggleHamburger(true)
                  }
                >
                  <FontAwesomeIcon icon={faAngleUp} />
                  <span className="sr-only">Close Search Radius Menu</span>
                </button>
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
                      min="1"
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
                {shopResults ? (
                  resultsArray.map((result, resultIndex) => {
                    const resultLocation = {
                      longitude: result.place.geometry.coordinates[0],
                      latitude: result.place.geometry.coordinates[1],
                    };

                    return (

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
                              src={storePhotos[resultIndex % storePhotos.length].urls.small}
                              alt={storePhotos[resultIndex % storePhotos.length].alt_description}
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
                            ~
                            {lonLatDistance(
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
                  })
                ) : (
                  <li>
                    <p>No Results 😢 Try again?</p>
                  </li>
                )}
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
