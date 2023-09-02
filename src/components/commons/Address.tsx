import * as React from "react";
import { Address as AddressType } from "../../types";

type AddressProps = {
  address: AddressType;
};
/***
 * for the address showing the locator listing
 * 
 */
const Address = (props: AddressProps) => {
  const { address } = props;

  return (
    <div className="address notHighlight ">
      <div className="address_1 notHighlight">
        <div>
          {address.line1 ? <p>{address.line1}</p> : ""}
          {address.line2 ? <p>{address.line2}</p> : ""}
          {address.city}, {address.region} {address.postalCode}
        </div>
      </div>
    </div>
  );
};

export default Address;
