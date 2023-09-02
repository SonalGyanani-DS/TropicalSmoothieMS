import { useState } from "react";
import {
  useSearchActions,
  Matcher,
  SelectableFilter,
} from "@yext/search-headless-react";
import { AnswerExperienceConfig, googleApikey } from "../sites-global/global";

interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
}

interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}


const useGetPostalCodeLatLng = () => {
  const searchActions = useSearchActions();
  const [postalloading, setPostalLoading] = useState(false);
  const setLoading = (value: boolean) => {
    setPostalLoading(value);
  };
  let params: {
    latitude: number
    longitude:  number
  }
  // Get the element with the specified class

  const postalcode = (
    postal: string,
    coordinates: { latitude: number; longitude: number },
    checkallowed: boolean,
    updateradius: number
  ) => {    
    const metereRadius = 1609.344 * updateradius;
    if (!checkallowed) {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postal}&key=${googleApikey}`
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.status === "ZERO_RESULTS") {            
            searchActions.setUserLocation(coordinates);
            searchActions.setOffset(0);
            searchActions.setVerticalLimit(AnswerExperienceConfig.limit);
            searchActions.executeVerticalQuery();
          } else if (json.results) {
            let status = false;
            json.results.map((components:GeocodeResult) => {
              for (let i = 0; i < components.address_components.length; i++) {                
                params = {
                  latitude: components.geometry.location.lat,
                  longitude: components.geometry.location.lng,
                };
                if (
                  components.address_components[i].types.includes("country")
                ) {
                  if (components.address_components[i].short_name != "US") {
                    status = true;
                  }
                }
              }
            });

            const locationFilter: SelectableFilter = {
              selected: true,
              fieldId: "builtin.location",
              value: {
                lat: params.latitude,
                lng: params.longitude,
                radius: metereRadius,
              },
              matcher: Matcher.Near,
            };
            searchActions.setStaticFilters([locationFilter]);

            if (status) {
              searchActions.setQuery(postal);
              searchActions.setUserLocation(coordinates);
              searchActions.setOffset(0);
              searchActions.setVerticalLimit(AnswerExperienceConfig.limit);
              searchActions.executeVerticalQuery();
            } else {
              searchActions.setUserLocation(params);              
              searchActions.setVerticalLimit(AnswerExperienceConfig.limit);
              searchActions.executeVerticalQuery();
            }
          }
        })
        .catch();
    } else {
      searchActions.setVertical("locations");
      searchActions.setUserLocation(coordinates);
      searchActions.setOffset(0);
      const locationFilter: SelectableFilter = {
        selected: true,
        fieldId: "builtin.location",
        value: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          radius: metereRadius,
        },
        matcher: Matcher.Near,
      };
      searchActions.setStaticFilters([locationFilter]);
      searchActions.executeVerticalQuery();
    }
  };

  return { postalcode, setLoading, postalloading };
};

export default useGetPostalCodeLatLng;
