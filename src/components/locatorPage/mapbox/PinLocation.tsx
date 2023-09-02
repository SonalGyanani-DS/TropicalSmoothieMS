import * as React from "react";
import mapPin from "../../../images/locationPin.svg";
import GetDirections from "../../commons/GetDirections";
import { Address as AddressType } from "../../../types";

export default function PinLocation(props: {
  googlePlaceId: string;
  address: AddressType;
}) {
  const { address, googlePlaceId } = props;

  return (
    <>
      <GetDirections
        googlePlaceId={googlePlaceId}
        address={address}
        className={"button-red"}
        label={<img id={"marker-img"} alt="Marker" className="" src={mapPin} />}
      />
    </>
  );
}
