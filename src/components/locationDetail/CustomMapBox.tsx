import * as React from "react";
import { useRef, useEffect } from "react";
import mapboxgl, { Map, MarkerOptions } from "mapbox-gl"; 
import { mapboxAccessToken } from "../../sites-global/global";
import PinLocation from "../locatorPage/mapbox/PinLocation";
import ReactDOM from "react-dom";
import { Address as AddressType } from "../../types";

mapboxgl.accessToken = mapboxAccessToken;

interface Coordinate {
  longitude?: number;
  latitude?: number;
}

type props = {
  coordinate: Coordinate;
  googlePlaceId:string;
  address?: AddressType;
};

function CustomMapBox(coords: props) {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  
  useEffect(() => {
     // initialize map only once
    if(map.current){
      return;
    }else{
      map.current = new mapboxgl.Map({
        container: mapContainer.current ? mapContainer.current : "",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [coords.coordinate.longitude ? coords.coordinate.longitude : 0 , coords.coordinate.latitude ? coords.coordinate.latitude : 0],
        zoom: 14
      });
      const el = document.createElement("div");
      el.setAttribute("id", `marker-div-pin`);    
      const markerOptions: MarkerOptions = {};
      if (PinLocation) {     
        ReactDOM.render(
          <PinLocation googlePlaceId={coords.googlePlaceId} address={coords.address} />,
          el
        );
        markerOptions.element = el;
      }
  
      new mapboxgl.Marker(markerOptions).setLngLat([coords.coordinate.longitude ? coords.coordinate.longitude : 0 , coords.coordinate.latitude ? coords.coordinate.latitude : 0]).addTo(map.current);
    }
    
  },[ReactDOM]);

  return (
    <div>
      <div ref={mapContainer} className="location-map-container" />
    </div>
  );
 
}

export default CustomMapBox;
