import * as React from "react";
import CustomMapBox from "./CustomMapBox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "@yext/pages/components";

type data = {
  description?: string | undefined;
  yextDisplayCoordinate: object;
  displayCoordinate: object;
  googlePlaceId: string;
  c_pagesBusinessDescriptionHeroImage: { image: { url: string } };
};

export default function About(props: data) {
  const bgImage = props?.c_pagesBusinessDescriptionHeroImage
    ? props.c_pagesBusinessDescriptionHeroImage?.image?.url
    : "";

  return (
    <>
      <section
        className={"BgAbout"}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="container-narrow">
          <div className="flex justify-center items-center bg-gray-100 w-full aboutUsBlock">
            <div className="flex md:h-[583px] bg-white">
              <div className="w-full md:w-[58%] py-8 pl-8 pr-16">
                <div className="about">
                  <h2 className="About-title">About Tropical Smoothie Cafe</h2>
                  {props.description ? (
                    <div>
                      <p
                        style={{ whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{
                          __html: props.description,
                        }}
                      ></p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="actionBtn">
                  <Link
                    href={
                      "https://www.tropicalsmoothiecafe.com/?axdp=jh5SlI3-64u5UCjwnoMnis"
                    }
                    data-ya-track={"link#"}
                    eventName={"link#"}
                    rel="noopener noreferrer"
                    className="About-cta"
                  >
                    Visit our site
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-[42%] object-cover">
                <CustomMapBox
                  coordinate={
                    props?.yextDisplayCoordinate
                      ? props.yextDisplayCoordinate
                      : props.displayCoordinate
                  }
                  googlePlaceId={props.googlePlaceId}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
