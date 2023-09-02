import * as React from "react";
import { Address as AddressType } from "../../types";
import { Link } from "@yext/pages/components";

type GetDirectionsPropsTypes = {
  address?: AddressType;
  googlePlaceId: string;
  className:string;
  label:string | React.ReactElement;
};
/***
 * for the address showing the locator listing
 *
 */
const GetDirections = (props: GetDirectionsPropsTypes) => {
  const { address, googlePlaceId, className, label } = props;

  return (
    <>
      {googlePlaceId ? (
        <Link          
          href={
            "https://www.google.com/maps/place/?q=place_id:" + googlePlaceId
          }
          data-ya-track={"directions"}
          eventName={"directions"}
          rel="noopener noreferrer"
          target="_blank"
          className={className}
        >
          {label}
        </Link>
      ) : (
        <Link          
          href={`https://www.google.com/maps/dir/?api=1&destination=${address?.line1},${address?.city}`}
          data-ya-track={"directions"}
          eventName={"directions"}
          rel="noopener noreferrer"
          target="_blank"
          className={className}
        >
          {label}
        </Link>
      )}
    </>
  );
};

export default GetDirections;
