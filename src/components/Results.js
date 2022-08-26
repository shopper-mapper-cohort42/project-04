import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

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

  // State variables that don't need to become prop/route params
  const [searchRadius, setSearchRadius] = useState(10000); // For getting the search radius
  const [resultsArray, setResultsArray] = useState([]); // For displaying search results
  const [indicesToHighlight, setIndicesToHighlight] = useState([]); // For highlighting specific search results
  const [storePhotos, setStorePhotos] = useState([]);

  // Controlled input for radius changing and form submit handler
  const [searchRadiusInput, setSearchRadiusInput] = useState(10000);
  const handleSearchRadiusInputChange = function (e) {
    const { value } = e.target;
    setSearchRadiusInput(value);
  };
  const handleSubmitSearchRadiusChange = function (e) {
    e.preventDefault();
    setSearchRadius(searchRadiusInput * 1000);
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

  function openResults() {
    const mainContainerOpen = document.querySelector("#mainContent");
    const olList = document.querySelector(".resultsOrderList");

    mainContainerOpen.classList.toggle("active");
    olList.classList.toggle("active");
  }

  useEffect(() => {
    const unsplashApiKey = "dsddDM5If1dZktxt2jefA-bUa5Sc-rWDXcKcRjGPYrM";
    axios({
      url: `https://api.unsplash.com/search/photos`,
      method: "GET",
      dataResponse: "json",
      params: {
        client_id: unsplashApiKey,
        query: userQuery,
        per_page: 50,
      },
    }).then((response) => {
      const photos = response.data.results;
      const squarePhotos = [];
      photos.map((image) => {
        const ratio = image.width / image.height;

        if (ratio > 0.75 && ratio < 1.2) {
          squarePhotos.push(image);
        }
      });
      setStorePhotos(squarePhotos);
    });
  }, [searchRadius]);

  // Make axios call when this component is mounted, or when radius changes
  useEffect(() => {
    const options = {
      sort: "relevance",
      feedback: false,
      key: apiKey,
      circle: `${currentLocation.longitude},${currentLocation.latitude},${searchRadius}`,
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

        console.log("Results, adding new layer", response);
      } else {
        searchResultsLayer.setSearchResponse(response);
        console.log("Results, reusing layer", response);
      }

      const responseArray = response.results;
      const averageArray = [];
      const indices = [];

      if (!responseArray.length) {
        // if there are no results, highlight nothing
        // setIndicesToHighlight([]);
      } else if (responseArray.length % 2) {
        // if odd number of results, highlight the middle result
        indices.push(Math.floor(responseArray.length / 2));
        averageArray.push(responseArray[indices[0]]);
        responseArray.splice([indices[0]], 1);
        averageArray.push(...responseArray);
        // setIndicesToHighlight([Math.floor(responseArray.length / 2)]);
      } else {
        // if even number of results, highlight the middle two results
        indices.push(responseArray.length / 2);
        indices.push(responseArray.length / 2 - 1);

        averageArray.push(responseArray[indices[0]]);
        averageArray.push(responseArray[indices[1]]);
        console.log(averageArray);

        responseArray.splice([indices[0]], 2);
        averageArray.push(...responseArray);
        console.log("average", averageArray);
        setIndicesToHighlight([
          responseArray.length / 2,
          responseArray.length / 2 - 1,
        ]);
      }

      setResultsArray(averageArray);
    });
  }, [searchRadius]); // SUGGESTION: We can also make the list update live as the user changes the search radius, but it could be more laggy.

  // Brings you to directions component on Result Click or Map Result Click
  const handleSubmitDestination = (destinationParam) => {
    console.log(destinationParam);
    setDestination(destinationParam);
    navigate(
      `/location/${coords}/${searchItem}/${destinationParam.displayString}`
    );
  };

  return (
    <section className="resultsSection">
      <div className="wrapper">
        <span className="expandResults" onClick={openResults}></span>
        <div className="resultsDiv">
          <Link
            to={`/location/${currentLocation.longitude},${currentLocation.latitude}`}
            className="backButton returnLinks"
          >
            BACK
          </Link>
          <form onSubmit={handleSubmitSearchRadiusChange}>
            <p>Change Search Radius</p>
            <input
              type="range"
              id="searchRadiusInput"
              min="0"
              max="20"
              value={searchRadiusInput}
              onChange={handleSearchRadiusInputChange}
            />
            <label htmlFor="searchRadiusInput">{`${searchRadiusInput}km`}</label>
            <button>Update Search Radius</button>
          </form>
          <h2>Results</h2>
          {/* Ordered list to display the results by relevance */}
          <ol>
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
                  onClick={() => {
                    handleSubmitDestination(result);
                  }}
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
                          Top Most Average Shop
                        </h3>
                      ) : null // null is the NON-HIGHLIGHTED RESULT
                    }
                    <h3>{result.name}</h3>
                    <p>{result.displayString}</p>
                    <p className="resultsDistance">
                      {lonLatDistance(
                        currentLocation.longitude,
                        currentLocation.latitude,
                        resultLocation.longitude,
                        resultLocation.latitude
                      ).toFixed(2)}{" "}
                      km away
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  ); // End of return
} // End of Results()
