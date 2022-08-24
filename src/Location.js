import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import mapImage from "./assets/home-location-map.png";
import Loading from "./Loading";

function Location({ apiKey }) {
  const [location, setLocation] = useState("");
  const [predictiveResults, setPredictiveResults] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [displayMessage, setDisplayMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [loadingTimeOut, setLoadingTimeOut] = useState(false);
  const navigate = useNavigate();

  const searchLocation = (e) => {
    setLocation(e.target.value);
    predictiveText(e.target.value);
    // as user is typing, we will read their value and call the predictive text
    // api to predict their text

    setDisplayMessage("");
  };

  const predictiveText = (location) => {
    axios({
      url: `http://www.mapquestapi.com/search/v3/prediction`,
      params: {
        key: apiKey,
        q: location,
        collection: "address",
      },
      dataType: "JSON",
      method: "GET",
    }).then((response) => {
      setPredictiveResults("");

      if (response.data.results) {
        // store results in state, and take predictive results and map it
        const locationResults = response.data.results;

        setPredictiveResults(locationResults);
      } else {
        /* not really working, need to rework logic */
        console.log("asdasd");
      }
    });
  };

  const autoFill = (e) => {
    setLocation(e.target.textContent);
    setPredictiveResults([]);
  };

  const getGeoLocation = (location) => {
    // we need to set the country, lets strict to canada &  us only
    // String to store for the user's current location

    setLoadingState(true); // after clicking enter, loading animation starts
    setTimeout(() => {
      if (loadingState === true) {
        setLoadingState(false);
        setLoadingTimeOut(true); // make a pop up modal, 'API is busy, try again..'
        //when displaying pop up, set loadingTimeOut to false..
      }
    }, 6000);

    if (location !== "") {
      axios({
        url: `https://www.mapquestapi.com/geocoding/v1/address`,
        params: {
          key: apiKey,
          location: location,
        },
      })
        .then((response) => {
          // added catch thing ( setLoadingState= false, error message )
          if (response.data.results) {
            setTimeout(() => {
              setLoadingState(false);
            }, 500); // loading page time = 0.5s+ api response time  (<0.2s)

            // An array of the possible locations best matching the query
            // console.log(response.data.results[0].locations);
            const locationsArray = response.data.results[0].locations;
            console.log("response.data.results: ", response.data.results);
            console.log("response.data.results[0]: ", response.data.results[0]);

            const selectedLocationIndex = 0; // THIS VARIABLE CAN STORE THE USER'S SELECTED LOCATION INDEX

            if (response.data.results[0].length < 1) {
              console.log("invalid search");
            } else {
              const currentLongitude =
                locationsArray[selectedLocationIndex].latLng.lng; //

              const currentLatitutde =
                locationsArray[selectedLocationIndex].latLng.lat;
              setCurrentLocation({
                longitude: currentLongitude,
                latitude: currentLatitutde,
              });
              navigate(`/location/${currentLongitude}, ${currentLatitutde}`);
            }
          } else {
            alert("no result found");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingState(false);
          alert("Something is wrong...");
        });
    } else {
      alert("please do the location");
    }
  };

  const handleSubmit = (e, location) => {
    e.preventDefault();
    getGeoLocation(location);
  };

  const getLocation = () => {
    console.log("get location");
    navigator.geolocation.getCurrentPosition(
      // if location is enabled by user, otherwise
      // run second call back function
      (pos) => {
        console.log("pos inside navigator", pos);
        console.log("hello");

        setCurrentLocation(pos.coords);
        console.log("POOS COORDS: ", pos.coords.latitude);
        navigate(`/location/${pos.coords.longitude}, ${pos.coords.latitude}`);
        console.log(pos);
      },
      () => {
        console.log("error mesage");
        setDisplayMessage(
          "We need your location to give you a better experience."
        );
        togglePopup();
      }
    );
  };

  const togglePopup = () => {
    console.log("toggle");
    const locationPopup = document.querySelector(".locationPopup");
    locationPopup.classList.toggle("active");
  };

  //if API is called (loadingState=true), displaying loading page
  return (
    <>
      {loadingState === false ? (
        <>
          <div className="locationPopup">
            <div className="locationPopupContent">
              <h3>Enable Location</h3>
              <img src={mapImage} alt="" />
              <p>{displayMessage}</p>
              <div className="popupButtons">
                <button className="findLocation" onClick={getLocation}>
                  Enable
                </button>
                <button className="closeLocation" onClick={togglePopup}>
                  Not Now
                </button>
              </div>
            </div>
          </div>
          <div className="locationForm">
            <div className="wrapper">
              <form
                autoComplete="off"
                onSubmit={(e) => handleSubmit(e, location)}
              >
                <label htmlFor="name" className="sr-only">
                  Enter your location
                </label>
                <div className="userLocationDiv">
                  <span>
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                  </span>
                  <input
                    type="text"
                    id="name"
                    onChange={searchLocation}
                    value={location}
                    placeholder="Enter Your Location"
                  />
                </div>
              </form>
              <div className="locationPredictiveResults">
                <ul>
                  {predictiveResults.map((result, index) => {
                    return (
                      <>
                        <li key={index} onClick={autoFill}>
                          {result.displayString}
                        </li>
                        <input type="hidden" value={result.displayString} />
                      </>
                    );
                  })}
                </ul>
              </div>

              <p>OR</p>
              <button className="findLocation" onClick={getLocation}>
                Find My Location
              </button>
              <button className="backButton">
                <Link to={"/"}>Return to Main Page</Link>
              </button>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Location;
