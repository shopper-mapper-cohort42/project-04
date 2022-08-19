import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Location() {
    const apiKey = 'SbABP9Vr89Ox8a38s29QPLUQm51xa784';
    const [location, setLocation] = useState('');

    const searchLocation = (e) => {
        setLocation(e.target.value);
    };

    const getGeoLocation = (location) => {
        // String to store for the user's current location query

        const geocodingResults = axios({
            url: `https://www.mapquestapi.com/geocoding/v1/address`,
            params: {
                key: apiKey,
                location: location,
            },
        }).then((response) => {
            // An array of the possible locations best matching the query
            console.log(response.data.results[0].locations);
            const locationsArray = response.data.results[0].locations;

            // Have some way for the user to select the correct result, or a way for the user to adjust their query and remake the axios call
            // If there are no results OR the user doesn't like the results, break out of this .then() and prompt for a re-input
            // If the user picks one of the locations, take the index of that choice and store it

            const selectedLocationIndex = 0; // THIS VARIABLE CAN STORE THE USER'S SELECTED LOCATION INDEX

            // For the selected location index, retrieve the longitude and latitude of the selected location using the index
            // These longitude and latitudes will be passed into the PlaceSearch API
            const currentLongitude = locationsArray[selectedLocationIndex].latLng.lng; //rather than .latLng., .displayLatLng also works, not sure of the difference between the two in the returned object since the numbers are the same
            const currentLatitutde = locationsArray[selectedLocationIndex].latLng.lat;
        });
    };

    const handleSubmit = (e, location) => {
        e.preventDefault();
        getGeoLocation(location);
    };

    return (
        <>
            <form action="" onSubmit={(e) => handleSubmit(e, location)}>
                <label htmlFor="name">Enter your location</label>
                <input type="text" id="name" onChange={searchLocation} value={location} />
            </form>

            <button className="findLocation">Find Location</button>
            <button className="backButton">
                <Link to={'/'}>Back Button</Link>
            </button>
        </>
    );
}

export default Location;
