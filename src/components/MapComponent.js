import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MapComponent({ mapState }) {
  const reactRouterLocation = useLocation();

  useEffect(() => {
    // Try/Catch block to avoid refresh crash
    try {
      const mapElement = document.getElementById("map");

      if (reactRouterLocation.pathname.includes("/location")) {
        mapElement.style.display = "block";
        mapState.invalidateSize();
      } else {
        mapElement.style.display = "none";
      }
    } catch (err) {
      console.log("Error in MapComponent.js", err);
    }
  }, [reactRouterLocation.pathname]);

  return <div id="map" style={{ width: "100%", height: "100%" }}></div>;
}
