import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MapComponent({ mapState }) {
    const navigate = useNavigate();
    const reactRouterLocation = useLocation();

    useEffect(() => {
        // Try/Catch block to avoid refresh crash
        try {
            const mapElement = document.getElementById('map');

            if (reactRouterLocation.pathname.includes('/location')) {
                mapElement.style.display = 'block';
                mapState.invalidateSize();
            } else {
                mapElement.style.display = 'none';
            }
        } catch (err) {
            navigate('/location');
            // console.log("Error in MapComponent.js", err);
        }
    }, [reactRouterLocation.pathname,mapState,navigate]);

    return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
}
