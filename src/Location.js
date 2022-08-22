import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import mapImage from './assets/home-location-map.png';
import Loading from './Loading';
import Results from './Results';
import SearchItems from './SearchItems';

function Location({ apiKey }) {
    // location is the string that user input in the field
    const [location, setLocation] = useState('');

    //locations is the array of location objects that we got from api call
    const [locations, setLocations] = useState([]);

    //coordinates of location, that user chose. by default its (0, 0)
    // Assuming that X resembles Longitude, &  Y resembles Latitude
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [displayMessage, setDisplayMessage] = useState('');

    const navigate = useNavigate();
    //call this function only when the value of location state changes
    const getGeoLocation = useCallback((location) => {
        try {
            axios({
                url: `https://www.mapquestapi.com/geocoding/v1/address`,
                params: {
                    key: apiKey,
                    location: location,
                },
            }).then((response) => {
                // list of locations are returned based on user's location input
                const locations = response.data.results[0].locations;

                /* Have some way for the user to select the correct result, or a way for the user to adjust their query and remake the axios call
                 If there are no results OR the user doesn't like the results, break out of this .then() and prompt for a re-input
                 If the user picks one of the locations, take the index of that choice and store it
                 may be we can display a dropdown from locations
                 */
                setLocations(locations);

                // let user selected first location from the array
                const selectedLocation = locations[0];

                // extract the coordinates from selected location
                const longitude = selectedLocation.latLng.lng;
                const latitude = selectedLocation.latLng.lat;

                //setting the coordinates of location
                setCoordinates({ x: longitude, y: latitude });
            });
        } catch (error) {
            alert('something went wrong in Location.js component');
        }
    });

    useEffect(() => {
        // if location is not empty and has no trailing spaces  and the location changes only then call the api
        if (location.trim() !== '') {
            getGeoLocation(location.trim());
        }
    }, [location]);

    //get the current location of user,  if user agreed to share his current location
    const getCurrentLocation = () => {
        console.log('getting  current Location');
        navigator.geolocation.getCurrentPosition(
            //(pos) will execute, when user give access to his location
            (pos) => {
                //getting user current location's x & y cordinates
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;

                //setting the coordinates of location
                // Assuming that X resembles Longitude, &  Y resembles Latitude
                setCoordinates({ x: longitude, y: latitude });
                navigate(`/location/${longitude},${latitude}`);
            },
            //() will execute, when user does not give access to his location
            (error) => {
                console.log('ERROR:: ', error.message);
                setDisplayMessage('We need your location to give you a better experience.');
                togglePopup();
            }
        );
    };

    const togglePopup = () => {
        console.log('toggle');
        const locationPopup = document.querySelector('.locationPopup');
        locationPopup.classList.toggle('active');
    };

    const searchLocation = (e) => {
        const value = e.target.value;
        setLocation(value);
        setDisplayMessage('');
    };

    const handleSubmit = (e, location) => {
        e.preventDefault();
        navigate(`/location/${coordinates.x},${coordinates.y}`);
    };

    return (
        <>
            <div className="locationPopup">
                <div className="locationPopupContent">
                    <h3>Enable Location</h3>
                    <img src={mapImage} alt="" />
                    <p>{displayMessage}</p>
                    <div className="popupButtons">
                        <button className="findLocation" onClick={getCurrentLocation}>
                            Enable
                        </button>
                        <button className="closeLocation" onClick={togglePopup}>
                            Not Now
                        </button>
                    </div>
                </div>
            </div>

            <form action="" onSubmit={(e) => handleSubmit(e, location)}>
                <label htmlFor="name" className="sr-only">
                    Enter your location
                </label>
                <div className="userLocationDiv">
                    <span>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </span>
                    <input type="text" id="name" onChange={searchLocation} value={location} placeholder="Enter Your Location" />
                </div>
            </form>

            <p>OR</p>
            <button className="findLocation" onClick={getCurrentLocation}>
                Find My Location
            </button>
            <button className="backButton">
                <Link to={'/'}>Return to Main Page</Link>
            </button>
        </>
    );
}

export default Location;
