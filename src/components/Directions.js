import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faCar, faClock, faPersonWalking, faRoad, faWalking, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// PLACEHOLDER VARIABLES
// Placeholder variable for the selectedResult prop that we will get from Results.js to pass into this component
const selectedResult = {
  id: "mqId:422478344",
  displayString: "Cancon Constructions, 90 Scollard St, Toronto, ON M5R 1G2",
  name: "Cancon Constructions (PLACEHOLDER)",
  slug: "/canada/on/cancon-constructions-422478344",
  language: "en",
  place: {
    type: "Feature",
    geometry: {
      coordinates: [-79.391768, 43.672036],
      type: "Point",
    },
    properties: {
      city: "Toronto",
      stateCode: "ON",
      postalCode: "M5R 1G2",
      countryCode: "CA",
      street: "90 Scollard St",
      type: "address",
    },
  },
};
// Placeholder for apiKey, should be a prop
const apiKey = "Ly2CHsAhxGvzncY98vcRBQDokGoO0EMZ";
// Placeholder values for current location and destination, should comes from route params
const currentLocation = {
  longitude: -78.9441,
  latitude: 44.105,
};
const destinationLocation = {
  longitude: selectedResult.place.geometry.coordinates[0],
  latitude: selectedResult.place.geometry.coordinates[1],
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
  const navigate = useNavigate();
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
    window.L.mapquest.key = apiKey;
    window.L.mapquest.directions().route(routeOptions, (error, response) => {
      if (!directionsLayerDefined) {
        setDirectionsLayerDefined(true);
        setDirectionsLayer(
          window.L.mapquest
            .directionsLayer({
              directionsResponse: response,
            })
            .addTo(mapState)
        );
        console.log("Directions, adding new layer", response);
      } else {
        directionsLayer.setDirectionsResponse(response);
        console.log("Directions, reusing layer", response);
      }
      console.log(response);
      console.log(response.route);
      setRouteObject(response.route);
      setDirectionObjectsArray(response.route.legs[0].maneuvers);
    });
  }, [routeTypeInput]); //Update the directions when mounted and whenever the destination changes

  useEffect(() => {
    if (directionsLayerDefined) {
      directionsLayer.on("directions_changed", function (response) {
        console.log(response);
        setRouteObject(response.route);
        setDirectionObjectsArray(response.route.legs[0].maneuvers);
      });
    }
  }, [directionsLayerDefined]);

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
        <div className={hideDirections ? "directionsDiv active" : "directionsDiv"}>
          <span className="expandDirections" onClick={() => { setHideDirections(!hideDirections) }} ></span>
          <div className="directionsTopContainer">
            <div className="destinationInfoHeadingContainer">
              <h3>Directions to {destination.name}</h3>
              <h4>{destination.displayString}</h4>
            </div>

            {/* Form to handle changing travel method */}
            <form className='directionsRouteTypeForm'>
                <ul>
                    <li>
                        <input type="radio" name="routeTypeInput" id='routeTypeInputFastest' value={'fastest'} checked={routeTypeInput === 'fastest'} onChange={() => { handleRouteTypeInputChange('fastest') }} />
                        <label htmlFor="routeTypeInputFastest">
                            <FontAwesomeIcon
                                className="directionIcon"
                                icon={faCar}
                            />
                            <> Car (Fastest)</>
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="routeTypeInput" id='routeTypeInputShortest' value={'shortest'} onChange={() => { handleRouteTypeInputChange('shortest') }} />
                        <label htmlFor="routeTypeInputShortest">
                            <FontAwesomeIcon
                                className="directionIcon"
                                icon={faCar}
                            />
                            <> Car (Shortest)</>
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="routeTypeInput" id='routeTypeInputPedestrian' value={'pedestrian'} onChange={() => { handleRouteTypeInputChange('pedestrian') }} />
                        <label htmlFor="routeTypeInputPedestrian">
                            <FontAwesomeIcon
                                className="directionIcon"
                                icon={faWalking}
                            />
                            <> Walking</>
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="routeTypeInput" id='routeTypeInputBicycle' value={'bicycle'} onChange={() => { handleRouteTypeInputChange('bicycle') }} />
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
          <ol className={hideDirections ? "directionsOrderList active" : "directionsOrderList"}>
            {directionObjectsArray.map((directionObject, directionIndex) => {
              return (
                <li key={`directionKey-${directionIndex}`} className="directionContainer"> 

                  <div className="directionTextContainer">
                    <div className="directionNarrativeContainer">
                      <img className="directionImage" src={directionObject.iconUrl} alt="" />
                      <p>{directionObject.narrative}</p>
                    </div>

                    {/* Conditional rendering for direction and time when it's not at the last direction */}
                    {directionIndex < directionObjectsArray.length - 1 ? (
                      <div className="directionDetailsContainer">
                        <p className="directionDistance">{directionObject.distance.toFixed(2)} km</p>
                        <p className="directionTime">Time: {formatHHMMSS(directionObject.formattedTime)}</p>
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
