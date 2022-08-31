import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import mapImage from "../assets/home-location-map.png";
import axios from "axios";
import Loading from "./Loading";

function Location({
  apiKey,
  mapState,
  geocodingLayer,
  setGeocodingLayer,
  geocodingLayerDefined,
  setGeocodingLayerDefined,
  clearAllLayers,
}) {
  const [location, setLocation] = useState("");
  const [predictiveResults, setPredictiveResults] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [closeDropDown, setCloseDropDown] = useState(true);
  const [togglePopup, setTogglePopup] = useState(false);
  const navigate = useNavigate();

  // Get user input and display predicted locations
  const searchLocation = (e) => {
    const { value } = e.target;
    setLocation(value);
    setDisplayMessage("");

    if (value.length > 1) {
      predictiveText(value);
      setCloseDropDown(false);
    } else {
      setPredictiveResults([]);
    }
  };

  // API call for predictive text
  const predictiveText = (location) => {
    axios({
      url: `https://www.mapquestapi.com/search/v3/prediction`,
      params: {
        key: apiKey,
        q: location,
        collection: "adminArea,poi,address,category,franchise,airport",
      },
      dataType: "JSON",
      method: "GET",
    })
      .then((response) => {
        setPredictiveResults("");

        if (response.data.results) {
          // store results in state, and take predictive results and map it
          const locationResults = response.data.results;
          setPredictiveResults(locationResults);
        } else {
          setDisplayMessage("No valid results...");
          setTogglePopup(true);
        }
      })
      .catch((err) => {
        setDisplayMessage(`There is something wrong. ${err.message}`);
        setTogglePopup(true);
      });
  };

  // if user selects an address from the drop down, auto fills the input field for them
  const autoFill = (e) => {
    setLocation(e.target.textContent);
    setCloseDropDown(true);
    setPredictiveResults([]);
  };

  // a function which enables users to find their current location on the map
  function setLocationMarker(latitude, longtitude) {
    window.L.mapquest
      .geocoding()
      .geocode(`${latitude},${longtitude}`, (error, response) => {
        if (!geocodingLayerDefined) {
          setGeocodingLayerDefined(true);
          setGeocodingLayer(
            window.L.mapquest
              .geocodingLayer({
                geocodingResponse: response,
              })
              .addTo(mapState)
          );
        } else {
          geocodingLayer.setGeocodingResponse(response);
        }
      });
  }

  // Convert search location into longitude/latitude coordinates
  const getGeoLocation = (location) => {
    // Enable loading animation and close predictive dropdown
    setLoadingState(true);
    setCloseDropDown(true);

    if (location !== "") {
      axios({
        url: `https://www.mapquestapi.com/geocoding/v1/address`,
        params: {
          key: apiKey,
          location: location,
        },
      })
        .then((response) => {
          if (response.data.results) {
            // loading screen for 0.5s
            setTimeout(() => {
              setLoadingState(false);
            }, 500);

            // An array of the possible locations best matching the query
            const locationsArray = response.data.results[0].locations;

            // Update map with the location, and navigate to next screen
            const currentLongitude = locationsArray[0].latLng.lng;
            const currentLatitutde = locationsArray[0].latLng.lat;

            setLocationMarker(currentLatitutde, currentLongitude);
            navigate(`/location/${currentLongitude}, ${currentLatitutde}`);
          } else {
            setDisplayMessage("No results found.");
            setTogglePopup(true);
          }
        })
        .catch((err) => {
          setLoadingState(false);
          setDisplayMessage(`${err.message}, please try again later...`);
          setTogglePopup(true);
        });
    } else {
      setLoadingState(false);
      setDisplayMessage("Please enter your address.");
      setTogglePopup(true);
    }
  };

  // Handle submission of location input
  const handleSubmit = (e, location) => {
    e.preventDefault();
    getGeoLocation(location);
  };

  // Get user's current longitude/latitude location automatically
  const getLocation = () => {
    sessionStorage.removeItem("reloading");
    setLoadingState(true);

    // Ask user for their current location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Add a 0.5s delay
        setTimeout(() => {
          setLoadingState(false);
        }, 500);
        navigate(`/location/${pos.coords.longitude}, ${pos.coords.latitude}`);
        setLocationMarker(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setDisplayMessage(
          "We need your location to give you a better experience. Please refresh your browser to enable location settings."
        );
        setTogglePopup(true);

        setLoadingState(false);
      }
    );
  };

  // Reset the map when mounting Location.js
  useEffect(() => {
    clearAllLayers();
  }, [clearAllLayers]);

  return (
    <>
      {loadingState === false ? (
        <>
          <section className="locationSection">
            <div className="wrapper">
              <div
                className={
                  togglePopup ? "locationPopup active" : "locationPopup"
                }
              >
                <div className="locationPopupContent">
                  <h3>Error</h3>
                  <img src={mapImage} alt="" />
                  <p>{displayMessage}</p>
                  <div className="popupButtons">
                    <button
                      className="blueButton"
                      onClick={() => {
                        togglePopup
                          ? setTogglePopup(false)
                          : setTogglePopup(true);
                      }}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
              <div className="locationForm">
                <div className="locationFormHeader">
                  <Link to={"/"} className="returnToMain returnLinks">
                    <FontAwesomeIcon icon={faAngleLeft} />
                    &nbsp;Return to Main Page
                  </Link>
                  <button className="findLocation" onClick={getLocation}>
                    Find My Location
                  </button>
                </div>
                <form onSubmit={(e) => handleSubmit(e, location)}>
                  <div
                    className={
                      closeDropDown
                        ? "userLocationDiv"
                        : "userLocationDiv active"
                    }
                  >
                    <label htmlFor="name" className="sr-only">
                      Enter your location
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      id="name"
                      className="userLocationInput"
                      onChange={searchLocation}
                      value={location}
                      onFocus={() =>
                        closeDropDown
                          ? setCloseDropDown(false)
                          : setCloseDropDown(true)
                      }
                      placeholder="Enter Your Location"
                      required
                    />
                    <div
                      onClick={(e) => handleSubmit(e, location)}
                      tabIndex="0"
                    >
                      <FontAwesomeIcon className="searchIcon" icon={faSearch} />
                      <span className="sr-only">Submit your location</span>
                    </div>
                  </div>
                </form>
                <div className="locationPredictiveResults">
                  <ul tabIndex="0" className={closeDropDown ? null : "active"}>
                    {predictiveResults.map((result, index) => {
                      return (
                        <li
                          key={index}
                          onClick={(e) => autoFill(e)}
                          tabIndex="0"
                        >
                          {result.displayString}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="wrapper">
          <Loading />
        </div>
      )}
    </>
  );
}

export default Location;
