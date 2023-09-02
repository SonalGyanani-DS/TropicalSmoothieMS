import { useRef, useEffect, useContext } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { LngLatBounds, LngLat, MapboxOptions } from "mapbox-gl";
import markerPin from "../../../images/markerPin.png";
import markerHoverPin from "../../../images/markerHoverPin.png";
import clickMarkerPin from "../../../images/ClickedMapIcon.svg";
import * as React from "react";
import { LocationResultData } from "../../../types";
import { Coordinate } from "../../../types/search/locations";
import { SearchContext } from "../SearchContextProvider";
import { getPosition } from "../../../sites-global/global";
import { Address } from "@yext/pages/components";



/**
 * A functional component that can be used to render a custom marker on the map.
 *
 * @public
 */
export type PinComponentType = (props: {
  index: number;
  mapbox: Map;
  result: LocationResultData;
}) => JSX.Element;

export type InfowindowProps = {
  location: any;
  _site: string[];
  meta: any;
};
/**
 * A function use to derive a result's coordinate.
 *
 * @public
 */
export type CoordinateGetter = (
  result: LocationResultData
) => Coordinate | undefined;

/**
 * A function which is called when user drag the map.
 *
 * @public
 */
export type OnDragHandler = (center: LngLat, bounds: LngLatBounds) => void;

/**
 * Props for the {@link MapboxMap} component.
 * The type param "T" represents the type of "rawData" field of the results use in the map.
 *
 * @public
 */
export interface MapboxMapProps {
  /** Mapbox access token. */
  mapboxAccessToken: string;
  /** Interface for map customization derived from Mapbox GL's Map options. */
  mapboxOptions?: Omit<MapboxOptions, "container">;
  /**
   * Custom Pin component to render for markers on the map.
   * By default, the built-in marker image from Mapbox GL is used.
   */
  PinComponent?: PinComponentType;
  /**
   * A function to derive a result's coordinate for the corresponding marker's location on the map.
   * By default, "yextDisplayCoordinate" field is used as the result's display coordinate.
   */
  getCoordinate?: CoordinateGetter;
  /** {@inheritDoc OnDragHandler} */
  onDrag?: OnDragHandler;
  locationResults: [];
  locationListRef: HTMLDivElement;
  InfowindowComponent: React.FC<InfowindowProps>;
}

/**
 * A component that renders a map with markers to show result locations using Mapbox GL.
 *
 * @remarks
 * For the map to work properly, be sure to include Mapbox GL stylesheet in the application.
 *
 * @example
 * For instance, user may add the following import statement in their application's index file
 * or in the file where `MapboxMap` is used:
 * `import 'mapbox-gl/dist/mapbox-gl.css';`
 *
 * Or, user may add a stylesheet link in their html page:
 * `<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet" />`
 *
 * @param props - {@link MapboxMapProps}
 * @returns A React element containing a Mapbox Map
 *
 * @public
 */
export function MapboxMap({
  mapboxAccessToken,
  locationResults,
  InfowindowComponent,
  getCoordinate = getDefaultCoordinate,
  locationListRef,
}: MapboxMapProps) {
  
  const map = useRef<Map | null>(null);
  const { hoverLocation, clickLocation, setHoverLocation, setClickLocation } =
    useContext(SearchContext);
  const [infoWindowContent, setInfoWindowContent]=React.useState(null)
  useEffect(() => {
    if (locationResults?.length > 0 && map.current) {
      const mapbox = map.current;
      const bounds = new LngLatBounds();
      locationResults.forEach((result: LocationResultData) => {
        const markerLocation = getCoordinate(result);
        if (markerLocation) {
          const { latitude, longitude } = markerLocation;
          if (latitude && longitude) {
            bounds.extend([longitude, latitude]);
          }
        }
      });
      if (!bounds.isEmpty()) {
        mapbox.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 14,
        });
      }
    }
  }, [locationResults]);

  const handleClick = (index: number, id: string) => {
    setHoverLocation("");
    setClickLocation(id);
    scrollToRow(index, locationListRef);
  };

  const handleMouseOver = (id: string) => {
    if (clickLocation !== id) {
      setHoverLocation(id);
    }
  };

  const handleMouseOut = () => {
    setHoverLocation("");
  };

  const fitBoundMap = () => {
    if (locationResults?.length > 0 && map.current) {
      const mapbox = map.current;
      const bounds = new LngLatBounds();
      locationResults.forEach((result: any) => {
        const markerLocation = getPosition(result);
        if (markerLocation) {
          const { lat, lng } = markerLocation;
          if (lat && lng) {
            bounds.extend([lng, lat]);
          }
        }
      });
      if (!bounds.isEmpty()) {
        mapbox.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 14,
        });
      }
    }
  };

console.log(clickLocation,"clickLocation");
console.log(infoWindowContent,"infoWindowContent");
  return (
    <Map
      ref={map}
      initialViewState={{
        longitude: -101.299591,
        latitude: 47.116386,
        zoom: 3,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={mapboxAccessToken}
    >
      {infoWindowContent && (
        <Popup
          latitude={getPosition(infoWindowContent).lat}
          longitude={getPosition(infoWindowContent).lng}
          closeOnMove={false}
          anchor={"bottom"}
          closeOnClick={false}
          onClose={() => {
            setInfoWindowContent(null);
            // if (zoomLavel === 4) {
            //   fitBoundMap();
            // } else {
            //   map.current?.setZoom(4);
            // }
            // if (mapCenter) {
            //   map.current?.setCenter(mapCenter);
            // } else {
            //   fitBoundMap();
            // }
          }}
        >
          {InfowindowComponent ? (
            <InfowindowComponent meta={meta} location={infoWindowContent} _site={_site} />
          ) : (
            <div className="infowindow-content">
              <a className="location-name" href={`/${infoWindowContent.rawData.slug}`}>
                {infoWindowContent.rawData.name}
              </a>
              <Address className="location-address" address={infoWindowContent.rawData.address} />
              <a className="button link" href={`/${infoWindowContent.rawData.slug}`}>
                View Details
              </a>
            </div>
          )}
        </Popup>
      )}
      {locationResults.map((location: LocationResultData, index: number) => {
        const markerLocation = getCoordinate(location);
        const { latitude, longitude } = markerLocation;
        const markerStyle =
          clickLocation === location.rawData.id ? { zIndex: 99999 } : {};
        return (
          <Marker
            key={`${location.rawData.id}-${index}`}
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
            style={markerStyle}
          >
            <button
              className={`${
                hoverLocation === location.rawData.id
                  ? "hover-red"
                  : clickLocation === location.rawData.id
                  ? "is-selected"
                  : ""
              }`}
              id={"marker-" + index}
              onClick={() => {handleClick(index, location.rawData.id);
                setInfoWindowContent(location);}}
              onMouseOver={() => handleMouseOver(location.rawData.id)}
              onMouseOut={handleMouseOut}
              
            >
              {/* {clickLocation && (
  <InfoWindow location={clickLocation} />
)} */}
              <span className="pin-number">{index + 1}</span>
              <img
                alt=""
                id={"marker-img-" + index}
                className=""
                src={
                  hoverLocation === location.rawData.id
                    ? markerHoverPin
                    : clickLocation === location.rawData.id
                    ? clickMarkerPin
                    : markerPin
                }
              />
            </button>
            
          </Marker>
          
        );
      })}
    </Map>
  );
}

function scrollToRow(index: number, locationListRef: HTMLElement) {
  const offset: HTMLElement =
    locationListRef?.current.children[0].children[0].children[index];
  document.documentElement.scrollTop = document.body.scrollTop =
    offset.offsetTop - 100;
}

function isCoordinate(data: Coordinate): data is Coordinate {
  return (
    typeof data == "object" &&
    typeof data.latitude === "number" &&
    typeof data.longitude === "number"
  );
}

function getDefaultCoordinate(result: LocationResultData) {
  const yextDisplayCoordinate = result?.rawData.yextDisplayCoordinate;
  if (!yextDisplayCoordinate) {
    console.error(
      'Unable to use the default "yextDisplayCoordinate" field as the result\'s coordinate to display on map.' +
        '\nConsider providing the "getCoordinate" prop to MapboxMap component to fetch the desire coordinate from result.'
    );
    return undefined;
  }
  if (!isCoordinate(yextDisplayCoordinate)) {
    console.error(
      'The default `yextDisplayCoordinate` field from result is not of type "Coordinate".'
    );
    return undefined;
  }
  return yextDisplayCoordinate;
}
