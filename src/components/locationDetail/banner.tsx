import * as React from "react";
import Defaultimage from "../../images/luxurystore.jpg";
import { CTA } from "@yext/pages/components";

export type Address = {
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
};

type BannerProps = {
  data?: {
    photoGallery?: {
      image: {
        url?: string | undefined;
      };
    }[];
    c_bannerTitile?: string;
  };
  c_banner?: {
    image: {
      url?: string;
    }[];
    title?: string;
  };
  c_bannerCta: CTA;
};



const Banner = (props: BannerProps) => {
  const { data, c_banner, c_bannerCta } = props;
  if (typeof data != "undefined") {
    return (
      <div className="hero-section">
        <img
          className="hero-image"
          src={
            data.photoGallery ? data.photoGallery[0].image?.url : Defaultimage
          }
          alt="banner"
          width="1"
          height="1"
          title="banner"
        />
        <div className="hero-content">
          <div className="container">
            <div className="banner-text">
              <h1>{data.c_bannerTitile ? data.c_bannerTitile : ""}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="hero-section">
        <img
          className="hero-image"
          src={c_banner && c_banner.image ? c_banner.image[0].url : Defaultimage}
          alt="banner"
          width="1"
          height="1"
          title="banner"
        />
        <div className="hero-content">
          <div className="container">
            <div className="banner-text text-center">
              <h1>{c_banner?.title ? c_banner.title : ""}</h1>
              <button className="btn notHighligh">{c_bannerCta.label}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default Banner;
