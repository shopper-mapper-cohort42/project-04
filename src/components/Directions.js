import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from "react-router-dom";

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
            coordinates: [
                -79.391768,
                43.672036
            ],
            type: "Point"
        },
        properties: {
            city: "Toronto",
            stateCode: "ON",
            postalCode: "M5R 1G2",
            countryCode: "CA",
            street: "90 Scollard St",
            type: "address"
        }
    }
}
// Placeholder for apiKey, should be a prop
const apiKey = "SbABP9Vr89Ox8a38s29QPLUQm51xa784";
// Placeholder values for current location and destination, should comes from route params
const currentLocation = {
    longitude: -78.9441,
    latitude: 44.1050
}
const destinationLocation = {
    longitude: selectedResult.place.geometry.coordinates[0],
    latitude: selectedResult.place.geometry.coordinates[1]
}



export default function Directions({ apiKey, mapState, destination, directionsLayer, setDirectionsLayer, directionsLayerDefined, setDirectionsLayerDefined }) {
    
    
    const navigate = useNavigate();
    const { coords, searchItem, destinationCoords } = useParams();
    currentLocation.longitude = coords.split(",")[0];
    currentLocation.latitude = coords.split(",")[1];

    // State variable for displaying directions
    const [routeObject, setRouteObject] = useState({}) // Holds all route info
    const [directionObjectsArray, setDirectionObjectsArray] = useState([]) // Holds specifically turn info

    // State variable for user to select travel type
    const [routeTypeInput, setRouteTypeInput] = useState('fastest');
    const handleRouteTypeInputChange = (routeTypeInputParam) => {

        routeOptions.options.routeType = routeTypeInputParam;
        setRouteTypeInput(routeTypeInputParam)
    }

    // Helper functions to format time from API objects
    // Format API-provided time from HH:MM:SS into something like 5h 3min 20s
    const formatHHMMSS = function (timeInput) {
        const digitsOnly = timeInput.replace(/\D/g, '').toString()

        const hoursNum = digitsOnly[0] + digitsOnly[1]
        const minutesNum = digitsOnly[2] + digitsOnly[3]
        const secondsNum = digitsOnly[4] + digitsOnly[5]

        const hoursText = parseInt(hoursNum) ? ' ' + parseInt(hoursNum, 10) + 'hr' : ''
        const minutesText = parseInt(minutesNum) ? ' ' + parseInt(minutesNum, 10) + 'min' : ''
        const secondsText = parseInt(secondsNum) ? ' ' + parseInt(secondsNum, 10) + 's' : ''
        
        return (hoursText + minutesText + secondsText)
    }
    
    // Format API-provided realTime from seconds into hours, minutes, and seconds
    const formatSeconds = function (secondsInput) {
        const hoursNum = Math.floor(secondsInput / 3600);
        const minutesNum = Math.floor((secondsInput - (hoursNum * 3600)) / 60);
        const secondsNum = secondsInput - (hoursNum * 3600) - (minutesNum * 60);
        
        const hoursText = parseInt(hoursNum) ? ' ' + parseInt(hoursNum, 10) + 'hr' : ''
        const minutesText = parseInt(minutesNum) ? ' ' + parseInt(minutesNum, 10) + 'min' : ''
        const secondsText = parseInt(secondsNum) ? ' ' + parseInt(secondsNum, 10) + 's' : ''
        
        return (hoursText + minutesText + secondsText)
    }

    const routeOptions = {
        start: `${currentLocation.latitude},${currentLocation.longitude}`,
        end: destinationCoords,
        options: {
            key: apiKey,
            unit: 'k',
            routeType: routeTypeInput
        }
    }
    

    useEffect(() => {
        window.L.mapquest.key = apiKey;
        window.L.mapquest.directions().route(routeOptions, (error, response) => {
            if (!directionsLayerDefined) {
                setDirectionsLayerDefined(true);
                setDirectionsLayer(window.L.mapquest.directionsLayer({
                    directionsResponse: response
                }).addTo(mapState))
                console.log('Directions, adding new layer', response)
            } else {
                directionsLayer.setDirectionsResponse(response);
                console.log("Directions, reusing layer", response);
            }
            console.log(response)
            console.log(response.route)
            setRouteObject(response.route);
            setDirectionObjectsArray(response.route.legs[0].maneuvers)
        })


    }, [routeTypeInput]) //Update the directions when mounted and whenever the destination changes

    useEffect(() => {
        if (directionsLayerDefined) {
            directionsLayer.on('directions_changed', function (response) {
                console.log(response);
                setRouteObject(response.route);
                setDirectionObjectsArray(response.route.legs[0].maneuvers)
            });
        }
    }, [directionsLayerDefined])


    return (
        <div>

            {/* Form to handle changing travel method */}
            <form>
                <h3>How are you travelling?</h3>
                <div>
                    <input type="radio" name="routeTypeInput" id='routeTypeInputFastest' value={'fastest'} checked={routeTypeInput === 'fastest'} onChange={() => { handleRouteTypeInputChange('fastest') }} />
                    <label htmlFor="routeTypeInputFastest">By Car (Fastest)</label>
                </div>
                
                <div>
                    <input type="radio" name="routeTypeInput" id='routeTypeInputShortest' value={'shortest'} onChange={() => { handleRouteTypeInputChange('shortest') }} />
                    <label htmlFor="routeTypeInputShortest">By Car (Shortest)</label>
                </div>

                <div>
                    <input type="radio" name="routeTypeInput" id='routeTypeInputPedestrian' value={'pedestrian'} onChange={() => { handleRouteTypeInputChange('pedestrian') }} />
                    <label htmlFor="routeTypeInputPedestrian">Walking</label>
                </div>

                <div>
                    <input type="radio" name="routeTypeInput" id='routeTypeInputBicycle' value={'bicycle'} onChange={() => { handleRouteTypeInputChange('bicycle') }} />
                    <label htmlFor="routeTypeInputBicycle">Bike</label>
                </div>
            </form>


            <div>
                <h3>Your Directions to {destination.name}</h3>
                <h4>{destination.displayString}</h4>
                <p>Estimated Travel Time: {formatSeconds(routeObject.realTime)}</p>
                <p>Total Distance: {routeObject.distance ? routeObject.distance.toFixed(2) : ''} km</p>
            </div>

            <ol>
                {
                    directionObjectsArray.map((directionObject, directionIndex) => {
                        return (
                            <li key={`directionKey-${directionIndex}`}>
                                <p>{directionObject.narrative}</p>

                                {/* Conditional rendering for direction and time when it's not at the last direction */}
                                {directionIndex < directionObjectsArray.length - 1 ?
                                    <div>
                                        <p>(Facing {directionObject.directionName})</p> {/* SUGGESTION: replace with a directional compass symbol */}
                                        <p>Time: {formatHHMMSS(directionObject.formattedTime)}</p>
                                    </div>
                                    : null}
                                <img src={directionObject.iconUrl} alt="" />
                            </li>
                        )
                    })
                }
            </ol>
        </div>
    )

}