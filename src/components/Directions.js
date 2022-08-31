import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faCar,
  faClock,
  faRoad,
  faWalking,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

// Placeholder values for current location and destination, should comes from route params
const currentLocation = {
  longitude: -78.9441,
  latitude: 44.105,
};

export default function Directions({
  apiKey,
  mapState,
  destination,
  directionsLayer,
  setDirectionsLayer,
  directionsLayerDefined,
  setDirectionsLayerDefined,
}) {
  const { coords, searchItem, destinationCoords } = useParams();
  currentLocation.longitude = coords.split(",")[0];
  currentLocation.latitude = coords.split(",")[1];

  // State variable for displaying directions
  const [routeObject, setRouteObject] = useState({}); // Holds all route info
  const [directionObjectsArray, setDirectionObjectsArray] = useState([]); // Holds specifically turn info

  // State variable for user to select travel type
  const [routeTypeInput, setRouteTypeInput] = useState("fastest");
  const handleRouteTypeInputChange = (routeTypeInputParam) => {
    routeOptions.options.routeType = routeTypeInputParam;
    setRouteTypeInput(routeTypeInputParam);
  };

  // Helper functions to format time from API objects
  // Format API-provided time from HH:MM:SS into something like 5h 3min 20s
  const formatHHMMSS = function (timeInput) {
    const digitsOnly = timeInput.replace(/\D/g, "").toString();

    const hoursNum = digitsOnly[0] + digitsOnly[1];
    const minutesNum = digitsOnly[2] + digitsOnly[3];
    const secondsNum = digitsOnly[4] + digitsOnly[5];

    const hoursText = parseInt(hoursNum)
      ? " " + parseInt(hoursNum, 10) + "hr"
      : "";
    const minutesText = parseInt(minutesNum)
      ? " " + parseInt(minutesNum, 10) + "min"
      : "";
    const secondsText = parseInt(secondsNum)
      ? " " + parseInt(secondsNum, 10) + "s"
      : "";

    return hoursText + minutesText + secondsText;
  };

  // Format API-provided realTime from seconds into hours, minutes, and seconds
  const formatSeconds = function (secondsInput) {
    const hoursNum = Math.floor(secondsInput / 3600);
    const minutesNum = Math.floor((secondsInput - hoursNum * 3600) / 60);
    const secondsNum = secondsInput - hoursNum * 3600 - minutesNum * 60;

    const hoursText = parseInt(hoursNum)
      ? " " + parseInt(hoursNum, 10) + "hr"
      : "";
    const minutesText = parseInt(minutesNum)
      ? " " + parseInt(minutesNum, 10) + "min"
      : "";
    const secondsText = parseInt(secondsNum)
      ? " " + parseInt(secondsNum, 10) + "s"
      : "";

    return hoursText + minutesText + secondsText;
  };

  const routeOptions = {
    start: `${currentLocation.latitude},${currentLocation.longitude}`,
    end: destinationCoords,
    options: {
      key: apiKey,
      unit: "k",
      routeType: routeTypeInput,
    },
  };

  useEffect(() => {
    const routeOptions2 = {
      start: `${currentLocation.latitude},${currentLocation.longitude}`,
      end: destinationCoords,
      options: {
        key: apiKey,
        unit: "k",
        routeType: routeTypeInput,
      },
    };
    window.L.mapquest.key = apiKey;
    window.L.mapquest.directions().route(routeOptions2, (error, response) => {
      try {
        if (!directionsLayerDefined) {
          setDirectionsLayerDefined(true);
          setDirectionsLayer(
            window.L.mapquest
              .directionsLayer({
                directionsResponse: response,
              })
              .addTo(mapState)
          );
        } else {
          directionsLayer.setDirectionsResponse(response);
        }
      } catch (error) {}

      setRouteObject(response.route);
      setDirectionObjectsArray(response.route.legs[0].maneuvers);
    });
  }, [
    routeTypeInput,
    apiKey,
    directionsLayer,
    directionsLayerDefined,
    destinationCoords,
    mapState,
    setDirectionsLayer,
    setDirectionsLayerDefined,
  ]); //Update the directions when mounted and whenever the destination changes

  useEffect(() => {
    if (directionsLayerDefined) {
      directionsLayer.on("directions_changed", function (response) {
        setRouteObject(response.route);
        setDirectionObjectsArray(response.route.legs[0].maneuvers);
      });
    }
  }, [directionsLayerDefined, directionsLayer]);

  const [hideDirections, setHideDirections] = useState(false);

  return (
    <section className="directionsSection">
      <div className="wrapper">
        <div className="directionBackButton">
          <Link
            to={`/location/${currentLocation.longitude},${currentLocation.latitude}/${searchItem}`}
            className="backButton returnLinks returnToMain resultBack"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            BACK
          </Link>
        </div>
        <div
          className={hideDirections ? "directionsDiv active" : "directionsDiv"}
        >
          <span
            className="expandDirections"
            onClick={() => {
              setHideDirections(!hideDirections);
            }}
          ></span>
          <button
            className="slideOutDirectionsDiv"
            onClick={() => {
              hideDirections
                ? setHideDirections(false)
                : setHideDirections(true);
            }}
          >
            <FontAwesomeIcon
              icon={hideDirections ? faAngleLeft : faAngleRight}
            />
          </button>
          <div
            className={
              hideDirections
                ? "directionsTopContainer active"
                : "directionsTopContainer"
            }
          >
            <div className="destinationInfoHeadingContainer">
              <h3>Directions to {destination.name}</h3>

              <h4>
                {destination.displayString
                  ? destination.displayString.split(`${destination.name},`)
                  : ""}
              </h4>
            </div>

            {/* Form to handle changing travel method */}
            <form className="directionsRouteTypeForm">
              <ul>
                <li>
                  <input
                    type="radio"
                    name="routeTypeInput"
                    id="routeTypeInputFastest"
                    value={"fastest"}
                    checked={routeTypeInput === "fastest"}
                    onChange={() => {
                      handleRouteTypeInputChange("fastest");
                    }}
                  />
                  <label htmlFor="routeTypeInputFastest">
                    <FontAwesomeIcon className="directionIcon" icon={faCar} />
                    <> Car (Fastest)</>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    name="routeTypeInput"
                    id="routeTypeInputShortest"
                    value={"shortest"}
                    onChange={() => {
                      handleRouteTypeInputChange("shortest");
                    }}
                  />
                  <label htmlFor="routeTypeInputShortest">
                    <FontAwesomeIcon className="directionIcon" icon={faCar} />
                    <> Car (Shortest)</>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    name="routeTypeInput"
                    id="routeTypeInputPedestrian"
                    value={"pedestrian"}
                    onChange={() => {
                      handleRouteTypeInputChange("pedestrian");
                    }}
                  />
                  <label htmlFor="routeTypeInputPedestrian">
                    <FontAwesomeIcon
                      className="directionIcon"
                      icon={faWalking}
                    />
                    <> Walking</>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    name="routeTypeInput"
                    id="routeTypeInputBicycle"
                    value={"bicycle"}
                    onChange={() => {
                      handleRouteTypeInputChange("bicycle");
                    }}
                  />
                  <label htmlFor="routeTypeInputBicycle">
                    <FontAwesomeIcon
                      className="directionIcon"
                      icon={faBicycle}
                    />
                    <> Bicycle</>
                  </label>
                </li>
              </ul>
            </form>

            <div className="destinationInfoDetailContainer">
              <p>
                <FontAwesomeIcon className="directionIcon" icon={faClock} />
                Travel Time: {formatSeconds(routeObject.realTime)}
              </p>
              <p>
                <FontAwesomeIcon className="directionIcon" icon={faRoad} />
                <> Distance: </>
                {routeObject.distance ? routeObject.distance.toFixed(2) : ""} km
              </p>
            </div>
          </div>
          <ol
            className={
              hideDirections
                ? "directionsOrderList active"
                : "directionsOrderList"
            }
          >
            {directionObjectsArray.map((directionObject, directionIndex) => {
              return (
                <li
                  key={`directionKey-${directionIndex}`}
                  className="directionContainer"
                >
                  <div className="directionTextContainer">
                    <div className="directionNarrativeContainer">
                      <img
                        className="directionImage"
                        src={directionObject.iconUrl}
                        alt=""
                      />
                      <p>{directionObject.narrative}</p>
                    </div>

                    {/* Conditional rendering for direction and time when it's not at the last direction */}
                    {directionIndex < directionObjectsArray.length - 1 ? (
                      <div className="directionDetailsContainer">
                        <p className="directionDistance">
                          {directionObject.distance.toFixed(2)} km
                        </p>
                        <p className="directionTime">
                          Time: {formatHHMMSS(directionObject.formattedTime)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
