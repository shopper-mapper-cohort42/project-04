import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import mapImage from "./assets/home-location-map.png";
import Loading from "./Loading";

function Location() {
  const apiKey = "SbABP9Vr89Ox8a38s29QPLUQm51xa784";
  const [location, setLocation] = useState("");
  const [predictiveResults, setPredictiveResults] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [displayMessage, setDisplayMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [loadingTimeOut, setLoadingTimeOut] = useState(false);

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
    closeAllLists();
  };

  const closeAllLists = () => {
    // trying to fix this, unsure
    const addressList = document.querySelector(".locationPredictiveResults ul");
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

            // Have some way for the user to select the correct result, or a way for the user to adjust their query and remake the axios call
            // If there are no results OR the user doesn't like the results, break out of this .then() and prompt for a re-input
            // If the user picks one of the locations, take the index of that choice and store it

            const selectedLocationIndex = 0; // THIS VARIABLE CAN STORE THE USER'S SELECTED LOCATION INDEX

            if (response.data.results[0].length < 1) {
              console.log("invalid search");
            } else {
              // For the selected location index, retrieve the longitude and latitude of the selected location using the index
              // These longitude and latitudes will be passed into the PlaceSearch API
              const currentLongitude =
                locationsArray[selectedLocationIndex].latLng.lng; //rather than .latLng., .displayLatLng also works, not sure of the difference between the two in the returned object since the numbers are the same
              const currentLatitutde =
                locationsArray[selectedLocationIndex].latLng.lat;
              setCurrentLocation({
                longitude: currentLongitude,
                latitude: currentLatitutde,
              });
              // console.log('current loc is ', currentLocation);
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
          <form autoComplete="off" onSubmit={(e) => handleSubmit(e, location)}>
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
              {predictiveResults.map((result) => {
                return (
                  <>
                    <li key={result.id} onClick={autoFill}>
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
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Location;
