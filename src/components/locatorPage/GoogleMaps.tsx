// import * as React from "react";
// import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
// import { useSearchState } from "@yext/search-headless-react";
// import selectedIcon from "../../assets/images/selectedIcon.png";
// import mapIcon from "../../assets/images/mapIcon.png";
// import { SearchContext } from "../commons/SearchContextProvider";
// import useFetchResults from "../../hooks/useFetchResults";
// import { GoogleMapRef } from "../commons/GoogleMapContextProvider";
// import {
//   center_latitude,
//   center_longitude,
//   convertMetersToMiles,
//   locationUrl,
// } from "../../config/globalConfig";
// import { customStyles } from "./MapStyle";
// import { formatPhoneNumber } from "react-phone-number-input";
// import { svgIcons } from "../../assets/svgIcon/svgIcon";
// import { Address, Link } from "@yext/pages/components";
// import { StaticData } from "../../../sites-global/staticData";
// import GetDirection from "../commons/GetDirection";

// export const GoogleMaps = () => {
//   const { hoverLocation, clickLocation, setHoverLocation, setClickLocation } =
//     React.useContext(SearchContext);
//   const { setMapRef, userLatLng } = React.useContext(GoogleMapRef);
//   const [activeMarker, setActiveMarker] = React.useState<string | null>(null);
//   const locationBias =
//     useSearchState((state) => state.location.locationBias) || [];
//   const locationResults = useFetchResults() || [];
//   const [userMap, setUserMap] = React.useState(null);
//   const [changeMapIcon, setChangeMapIcon] = React.useState(null);
//   const markerDesigns = {
//     hoverMarker: {
//       url: mapIcon,
//       labelOrigin: new google.maps.Point(16, 20),
//     },

//     defaultMarker: {
//       url: mapIcon,
//       labelOrigin: new google.maps.Point(16, 20),
//     },

//     selectedMarker: {
//       url: selectedIcon,
//       labelOrigin: new google.maps.Point(22, 25),
//     },
//   };

//   const mapCenter = {
//     lat: center_latitude,
//     lng: center_longitude,
//   };

//   const handleOnLoad = (map) => {
//     setTimeout(() => {
//       const bounds = new window.google.maps.LatLngBounds();
//       bounds.extend(mapCenter);
//       map.fitBounds(bounds);
//       map.setZoom(4);
//     }, 200);
//     setUserMap(map);
//     setMapRef(map);
//   };

//   const fitBounds = () => {
//     const bounds = new window.google.maps.LatLngBounds();
//     locationResults.map((location) => {
//       bounds.extend({
//         lat: location?.rawData?.yextDisplayCoordinate?.latitude,
//         lng: location?.rawData?.yextDisplayCoordinate?.longitude,
//       });
//       return;
//     });

//     // if(userLatLng && userLatLng.lat && userLatLng.lng){
//     //   bounds.extend(userLatLng);
//     // }

//     if (userMap) {
//       userMap?.fitBounds(bounds);
//     }
//   };

//   React.useEffect(() => {
//     if (locationResults && locationResults.length > 0) {
//       fitBounds();
//     } else if (locationResults.length == 0 && userLatLng) {
//       userMap?.setCenter(mapCenter);
//       userMap?.setZoom(4);
//     } else {
//       if (userLatLng && userLatLng.lat && userLatLng.lng) {
//         userMap?.setCenter(userLatLng);
//       } else if (
//         locationBias &&
//         locationBias?.latitude &&
//         locationBias?.longitude
//       ) {
//         userMap?.setCenter({
//           lat: locationBias?.latitude,
//           lng: locationBias?.longitude,
//         });
//       }
//       userMap?.setZoom(16);
//       // const bounds = new window.google.maps.LatLngBounds();
//       // bounds.extend({lat: locationBias.latitude, lng: locationBias.longitude });
//       // userMap?.fitBounds(bounds);
//     }
//   }, [locationResults]);

//   const onMarkerClick = (
//     id: string | undefined,
//     rawId: string,
//     index: number
//   ) => {
//     /** On click of marker chaning the icon */
//     setChangeMapIcon(id);

//     /** Make Marker active */
//     setClickLocation(rawId);

//     /** Set list scroll item */
//     scrollToRow(index, 1000);
//     if (id === activeMarker) {
//       return;
//     }

//     setActiveMarker(id);
//   };

//   /** CODE EXPLAIN:- Change marker color and active marker on click of location card. */
//   React.useEffect(() => {
//     setChangeMapIcon(clickLocation);
//     setActiveMarker(clickLocation);
//   }, [clickLocation]);

//   return (
//     <GoogleMap
//       onLoad={handleOnLoad}
//       onClick={() => setActiveMarker(null)}
//       mapContainerStyle={{ width: "100%", height: "calc(100vh - 160px)" }}
//       options={{
//         disableDefaultUI: true,
//         zoomControl: true,
//         styles: customStyles,
//         zoomControlOptions: {
//           position: google.maps.ControlPosition.TOP_RIGHT,
//         },
//       }}
//     >
//       {userLatLng && userLatLng.lat && userLatLng.lng ? (
//         <Marker
//           position={{ lat: userLatLng.lat, lng: userLatLng.lng }}
//         ></Marker>
//       ) : (
//         <></>
//       )}

//       {locationResults &&
//         locationResults.map(({ id, rawData, distance }, index: number) => (
//           <Marker
//             label={{
//               text: String(index + 1),
//               color: "#fff",
//               className: "marker-label relative",
//             }}
          
//             key={id}
//             icon={
//               changeMapIcon === id
//                 ? markerDesigns.selectedMarker
//                 : hoverLocation === id
//                 ? markerDesigns.selectedMarker
//                 : markerDesigns.defaultMarker
//             }
//             position={{
//               lat: rawData?.yextDisplayCoordinate?.latitude,
//               lng: rawData?.yextDisplayCoordinate?.longitude,
//             }}
//             onClick={() => {
//               onMarkerClick(id, rawData.id, index);
//             }}
//             onMouseOver={() => {
//               setHoverLocation(id);
//             }}
//             onMouseOut={() => {
//               setHoverLocation("");
//             }}
//             zIndex={
//               hoverLocation === id || clickLocation === id ? 999 : index + 1
//             }
//           >
//             {activeMarker === id ? (
//               <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                 <>
//                   <div className="flex justify-between">
//                     <h3 className="location-name">
//                       <Link
//                         href={locationUrl(rawData.type, rawData.address)}
//                         data-ya-track={`Locator Listing Heading Click`}
//                         eventName={`Locator Listing Heading Click`}
                    
//                       >
//                         {rawData.geomodifier}
//                       </Link>
//                     </h3>

//                     <div className="Teaser-miles text-sm">
//                       {convertMetersToMiles(Number(distance))} mi
//                     </div>
//                   </div>
//                   <br></br>
//                   <br></br>
//                   <div className="block mapIcon">
//                     <span className="icon float-left">{svgIcons.mapIcon}</span>
//                     <Address address={rawData.address} />
//                   </div>
//                   <br>
//                   </br>
//                     <br></br>
//                   {/* fax container */}
//                   {rawData.mainPhone ? (
//                     <div className="block faxIcon">
//                       <span className="icon">{svgIcons.phoneIcon}</span>
//                       <span className="content">
//                         {formatPhoneNumber(rawData.mainPhone)}
//                       </span>
//                     </div>
//                   ) : (
//                     <></>
//                   )}

//                   {/* routing no container */}
//                   {rawData.routingNumber ? (
//                     <div className="block routingIcon">
//                       <span className="icon float-left">
//                         {svgIcons.bankIcon}
//                       </span>
//                       <span className="content float-right">
//                         {rawData.routingNumber}
//                       </span>
//                     </div>
//                   ) : (
//                     <></>
//                   )}
//                   <br>
//                   </br>
//                     <br></br>
//                   <div>
//                     <Link
//                       eventName={
//                         rawData.geomodifier
//                           ? rawData.geomodifier
//                           : rawData?.address?.city +
//                             " " +
//                             rawData?.address?.region
//                       }
//                       href={
//                         rawData.c_pagesURL
//                           ? rawData.c_pagesURL.replace("/store", "")
//                           : rawData.id + "-" + rawData.name
//                       }
//                       className="primaryBtn"
//                       data-ya-track="visitpage"
//                     >
//                       {`Open An Account`}
//                     </Link>

//                     <GetDirection
//                       buttonText={`Get Directions`}
//                       className="primaryBtn"
//                       placeId={rawData.googlePlaceId}
//                       address={rawData.address}
//                       dataTrackText="Get_direction_CTA"
//                       eventName="Get_direction_CTA"
//                     />
//                   </div>
//                 </>
//               </InfoWindow>
//             ) : null}
//           </Marker>
//         ))}
//     </GoogleMap>
//   );
// };

// /** Initialize Scroller */
// export function scrollToRow(rowIndex: number, duration: number) {
//   const resultElements: HTMLElement[] = Array.from(
//     document.querySelectorAll(".result")
//   );
//   const firstResultElement = resultElements[0];
//   const targetResultElement = resultElements[rowIndex];

//   const targetPosition =
//     targetResultElement?.offsetTop - firstResultElement?.offsetTop + 80;

//   Array.from(document.querySelectorAll(".scrollbar-container")).forEach(
//     (scrollContainer: Element) => {
//       const startTime = performance.now();
//       const startTop = (scrollContainer as HTMLElement).scrollTop;
//       const targetTop = targetPosition;
//       const distance = targetTop - startTop;

//       const scroll = (currentTime: number) => {
//         const elapsed = currentTime - startTime;
//         const progress = Math.min(elapsed / duration, 1);
//         const easedProgress = easeInOutCubic(progress);
//         const scrollTop = startTop + distance * easedProgress;

//         (scrollContainer as HTMLElement).scrollTop = scrollTop;

//         if (elapsed < duration) {
//           requestAnimationFrame(scroll);
//         }
//       };

//       scroll(startTime);
//     }
//   );
// }

// function easeInOutCubic(t: number): number {
//   return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// }
