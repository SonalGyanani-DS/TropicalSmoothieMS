


/* eslint-disable no-prototype-builtins */

// window.requestAnimationFrame = (): number => {
//   window.clearTimeout(id: Number);
//   return 0;
// };

import * as React from "react";
import Contact from "../components/locationDetail/contact";
import Nearby from "../components/locationDetail/Nearby";
import { JsonLd } from "react-schemaorg";
import "../index.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import PageLayout from "../components/layouts/PageLayout";
import About from "../components/locationDetail/About";
import BreadCrumbs from "../components/layouts/Breadcrumb";
import { StaticData } from "../sites-global/staticData";
import {
  stagingBaseurl,
  AnalyticsEnableDebugging,
  AnalyticsEnableTrackingCookie,
  metaBots,
  siteLogo,
  googleAnalyticsScripts,
  downloadAppUrl,
} from "../sites-global/global";
import favicon from "../images/favicon.png";
import {
  AnalyticsProvider,
  AnalyticsScopeProvider,
  Link,
} from "@yext/pages/components";
import constant from "../constant";
import Faqs from "../components/locationDetail/Faqs";
import OpenClose from "../components/commons/openClose";
import RtfConverter from "@yext/rtf-converter";
import Newsbox from "../components/locationDetail/Newsbox";
import FeaturedMenu from "../components/locationDetail/FeaturedMenu";
import { BreadcrumbList, ListItem, SiteData } from "../types";
import { svgIcons } from "../svg icons/svgIcon";
import glassIcon from "../images/glass.svg";
import ScrollButton from "../components/locationDetail/ScrollButton";

/**
 * Required when Knowledge Graph data is used for a template.
 */
export const config: TemplateConfig = {
  stream: {
    $id: "locations",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "address",
      "mainPhone",
      "hours",
      "slug",
      "timezone",
      "yextDisplayCoordinate",
      "displayCoordinate",
      "cityCoordinate",
      "c_hiringBanner",
      "c_locationPageServices",
      "c_promotionPhoto",
      "c_promotionSectionDescription",
      "c_promotionPhotoAppText",
      "c_promotionSectionBackgroundHexCode",
      "c_newsBoxPhoto1",
      "c_newsBoxPhoto2",
      "c_newsBoxPhoto3",
      "description",
      "c_fAQSection",
      "orderUrl",
      "c_caterLink",
      "c_pagesBusinessDescriptionHeroImage",
      "dm_directoryParents.name",
      "dm_directoryParents.slug",
      "dm_directoryParents.meta.entityType",
      "c_newsBox1CTACopy",
      "c_newsBox2CTACopy",
      "c_newsBox3CTACopy",
      "c_locationPageMetaTitle",
      "c_locationPageMetaDescription",
      "googlePlaceId",
      "c_crossStreetInfo",
      "keywords",

      "additionalHoursText",
      "c_hideUberCTA",
      "c_featuredMenu",
    ],
    // Defines the scope of entities that qualify for this stream.
    filter: {
      entityTypes: ["location"],

    },
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en"],
      primary: false,
    },

  },
};

/**
 * Defines the path that the generated file will live at for production.
 *
 * NOTE: This currently has no impact on the local dev path. Local dev urls currently
 * take on the form: featureName/entityId
 */
export const getPath: GetPath<TemplateProps> = ({ document }) => {
  let url = "";
  if (!document.slug) {
    let finalresult: string | undefined = "";
    if (typeof document?.address.line1 != "undefined") {
      finalresult += document?.address.line1;
    }
    if (finalresult) {
      finalresult = constant.slugify(finalresult);
    } else {
      finalresult = constant.slugify(document.id);
    }
    url = `${constant.slugify(document.address.region)}/${constant.slugify(
      document.address.city
    )}/${finalresult}`;
  } else {
    url = `${constant.slugify(document.address.region)}/${constant.slugify(
      document.address.city
    )}/${constant.slugify(document.slug)}`;
  }
  return url;
};

/**
 * This allows the user to define a function which will take in their template
 * data and procude a HeadConfig object. When the site is generated, the HeadConfig
 * will be used to generate the inner contents of the HTML document's <head> tag.
 * This can include the title, meta tags, script tags, etc.
 */
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  let url = "";
  if (!document.slug) {
    let finalresult: string | undefined = "";
    if (typeof document?.address.line1 != "undefined") {
      finalresult += document?.address.line1;
    }
    if (finalresult) {
      finalresult = constant.slugify(finalresult);
    } else {
      finalresult = constant.slugify(document.id);
    }
    url = `${constant.slugify(document.address.region)}/${constant.slugify(
      document.address.city
    )}/${finalresult}`;
  } else {
    url = `${constant.slugify(document.address.region)}/${constant.slugify(
      document.address.city
    )}/${constant.slugify(document.slug)}`;
  }

  const metaTitle = `Sandwiches | Wraps | Smoothies | Delivery | ${document.address.city}, ${document.address.region} | Tropical Smoothie Cafe`;
  const metaDescription = `Visit your local Tropical Smoothie Cafe at  ${document.address.line1} in ${document.address.city}, ${document.address.region} to find healthy food and delicious smoothies made with fresh fruits and veggies.`;

  return {
    title:
      metaTitle,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: `${document?.c_locationPageMetaDescription &&
            metaDescription
            }`,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "keywords",
          content: `${document.keywords
              ? document.keywords
              : `${document.name} Store of Tropical Smoothie`
            }`,
        },
      },
      {
        type: "link",
        attributes: {
          rel: "shortcut icon",
          href: favicon,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "author",
          content: StaticData.Brandname,

        },
      },
      {
        type: "meta",
        attributes: {
          name: "robots",
          content: metaBots,
        },
      },
      {
        type: "link",
        attributes: {
          rel: "canonical",
          href: `${stagingBaseurl + url}`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:title",
          content: `${document.c_locationPageMetaTitle
              ? document.c_locationPageMetaTitle
              : metaTitle
            }`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:description",
          content: `${document.c_locationPageMetaDescription
              ? document.c_locationPageMetaDescription
              : metaDescription
            }`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:url",
          content: `${stagingBaseurl + url}`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:image",
          content: siteLogo,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:card",
          content: "summary",
        },
      },
      {
        type: "meta",
        attributes: {
          property: "twitter:title",
          content: `${document.c_locationPageMetaTitle
              ? document.c_locationPageMetaTitle
              : metaTitle
            }`,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:description",
          content: `${document.c_locationPageMetaDescription
              ? document.c_locationPageMetaDescription
              : metaDescription
            }`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "twitter:image",
          content: siteLogo,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:url",
          content: `${stagingBaseurl + url}`,
        },
      },
    ],
    other: googleAnalyticsScripts,
  };
};

interface datText extends TemplateRenderProps {
  _site: SiteData;
}

const Location: Template<datText> = ({
  relativePrefixToRoot,
  path,
  document,
  __meta,
}: datText) => {
  const {
    _site,
    name,
    address,
    mainPhone,
    hours,
    displayCoordinate,
    cityCoordinate,
    timezone,
    yextDisplayCoordinate,
    dm_directoryParents,
    c_featuredMenu,
  } = document;

  const templateData = { document: document, __meta: __meta };
  const hoursSchema = [];
  const breadcrumbScheme: ListItem[] = [];
  for (const key in hours) {
    if (hours?.hasOwnProperty(key)) {
      let openIntervalsSchema = {};
      if (key !== "holidayHours") {
        if (hours[key].isClosed) {
          openIntervalsSchema = {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: key,
          };
        } else {
          let end = "";
          let start = "";
          if (typeof hours[key].openIntervals != "undefined") {
            const openIntervals = hours[key].openIntervals;
            for (const o in openIntervals) {
              if (openIntervals.hasOwnProperty(o)) {
                end = openIntervals[o].end;
                start = openIntervals[o].start;
              }
            }
          }
          openIntervalsSchema = {
            "@type": "OpeningHoursSpecification",
            closes: end,
            dayOfWeek: key,
            opens: start,
          };
        }
      }

      hoursSchema.push(openIntervalsSchema);
    }
  }
  breadcrumbScheme.push({
    "@type": "ListItem",
    position: 1,
    item: {
      "@id": `${stagingBaseurl}`,
      name: "Locations",
    },
  });

  interface DirectoryParent {
    meta: {
      entityType: {
        id: string;
        uid: number;
      };
    };
    name: string;
    slug: string;
  }

  document.dm_directoryParents &&
    document.dm_directoryParents.map((i: DirectoryParent, index: number) => {
      if (i.meta.entityType.id == "ce_region") {
        let url = "";
        document.dm_directoryParents.map((j: DirectoryParent) => {
          if (
            j.meta.entityType.id != "ce_region" &&
            j.meta.entityType.id != "ce_city" &&
            j.meta.entityType.id != "ce_country" &&
            j.meta.entityType.id != "ce_root"
          ) {
            url = url + j.slug;
          }
        });
        breadcrumbScheme.push({
          "@type": "ListItem",
          position: index,
          item: {
            "@id": stagingBaseurl + document.dm_directoryParents[index].slug,
            name: i.name,
          },
        });
      } else if (i.meta.entityType.id == "ce_city") {
        let url = "";
        document.dm_directoryParents.map((j: DirectoryParent) => {
          if (
            j.meta.entityType.id != "ce_city" &&
            j.meta.entityType.id != "ce_country" &&
            j.meta.entityType.id != "ce_root"
          ) {
            if (url) {
              url = url + "/" + j.slug;
            } else {
              url = url + j.slug;
            }
          }
        });
        breadcrumbScheme.push({
          "@type": "ListItem",
          position: index,
          item: {
            "@id":
              stagingBaseurl +
              url +
              "/" +
              document.dm_directoryParents[index].slug,
            name: i.name,
          },
        });
      }
    });

  breadcrumbScheme.push({
    "@type": "ListItem",
    position: 4,
    item: {
      "@id": stagingBaseurl + path,
      name: document.name,
    },
  });

  interface FastFoodRestaurant {
    "@context"?: string | string[];
    "@type": "FastFoodRestaurant";
    name: string;
    telephone: string;
    address: {
      "@type": "PostalAddress";
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    openingHoursSpecification: OpeningHours;
  }

  interface OpeningHours {
    "@type": "OpeningHoursSpecification";
    closes?: string;
    dayOfWeek?: string | "";
    opens?: string;
  }

  interface FAQPage {
    "@context"?: string | string[];
    "@type": "FAQPage";
    mainEntity: mainEntity;
  }

  interface mainEntity {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }
  const makesSchemaOffer = [];

  type itemFeaturedData = {
    photo: { alternateText: string; url: string };
    description: string;
    title: string;
    cTA: { cTA: string; label: string; link: string };
  };

  c_featuredMenu &&
    c_featuredMenu.map((item: itemFeaturedData) => {
      makesSchemaOffer.push({
        "@type": "Products",
        image: item.photo.url,
        name: item.title,
        description: item.description,
        url: item.cTA.link,
      });
    });

  if (document?.c_newsBoxPhoto1) {
    makesSchemaOffer.push({
      "@type": "Products",
      image: document?.c_newsBoxPhoto1.image.url,
      name: document.c_newsBoxPhoto1.description,
      description: document.c_newsBoxPhoto1.details,
      url: document?.c_newsBoxPhoto1?.clickthroughUrl,
    });
  }

  if (document?.c_newsBoxPhoto2) {
    makesSchemaOffer.push({
      "@type": "Products",
      image: document?.c_newsBoxPhoto2.image.url,
      name: document.c_newsBoxPhoto2.description,
      description: document.c_newsBoxPhoto2.details,
      url: document?.c_newsBoxPhoto2?.clickthroughUrl,
    });
  }

  if (document?.c_newsBoxPhoto3) {
    makesSchemaOffer.push({
      "@type": "Products",
      image: document?.c_newsBoxPhoto3.image.url,
      name: document.c_newsBoxPhoto3.description,
      description: document.c_newsBoxPhoto3.details,
      url: document?.c_newsBoxPhoto3?.clickthroughUrl,
    });
  }

  return (
    <>
      <JsonLd<FastFoodRestaurant>
        item={{
          "@context": "https://schema.org",
          "@type": "FastFoodRestaurant",
          priceRange: "$$",
          image: siteLogo,
          servesCuisine: "smoothies and juice",
          name: name,
          telephone: mainPhone,
          geo: {
            "@type": "GeoCoordinates",
            latitude: document?.yextDisplayCoordinate?.latitude,
            longitude: document?.yextDisplayCoordinate?.longitude,
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: address.line1,
            addressLocality: address.city,
            addressRegion: address.region,
            postalCode: address.postalCode,
            addressCountry: address.countryCode,
          },
          openingHoursSpecification: hoursSchema,
          makesOffer: {
            "@type": "Offer",
            itemOffered: makesSchemaOffer,
          },
        }}
      />
      <JsonLd<BreadcrumbList>
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbScheme,
        }}
      />
      {document.c_fAQSection ? (
        <>
          <JsonLd<FAQPage>
            item={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity:
                document.c_fAQSection &&
                document.c_fAQSection.map(
                  (i: { question: string; answer: string }) => {
                    return {
                      "@type": "Question",
                      name: i.question,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: `<p>${i.answer}</p>`,
                      },
                    };
                  }
                ),
            }}
          />
        </>
      ) : (
        <></>
      )}

      <AnalyticsProvider
        templateData={templateData}
        enableDebugging={AnalyticsEnableDebugging}
        enableTrackingCookie={AnalyticsEnableTrackingCookie}
      >
        <AnalyticsScopeProvider name={"restaurant"}>
          <h1>hellloooo</h1>
          {/* <PageLayout _site={_site}>
            <div className="hero-section">
              <div className="hero-content">
                <div className="container-narrow">
                  <div className="banner-content-row">
                    <div className="banner-text">
                      <h1>{document.name}</h1>
                      <h2>{address.city}</h2>
                    </div>

                    <div className="banner-box">
                      <div className="inner-box-wrapper">
                        <div className="openClosestatus detail-page closeing-div">
                          <OpenClose
                            timezone={timezone}
                            hours={hours}
                            id={document.id}
                          />
                        </div>
                        <div className="Hero-cta">
                          {document.orderUrl ? (
                            <Link
                              href={document.orderUrl.url}
                              data-ya-track="olo"
                              eventName={`olo`}
                              rel="noopener noreferrer"
                              className="Button redBtn Button--secondary"
                            >
                              Order online
                            </Link>
                          ) : (
                            ""
                          )}
                          {document.c_caterLink ? (
                            <Link
                              href={document.c_caterLink}
                              data-ya-track="cater"
                              eventName={`cater`}
                              rel="noopener noreferrer"
                              className="Button redBtn Button--secondary"
                            >
                              Catering
                            </Link>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-narrow mt-5">
              <BreadCrumbs
                name={name}
                parents={dm_directoryParents}
                baseUrl={relativePrefixToRoot}
                address={address}
              ></BreadCrumbs>
            </div>
            <div className="container-narrow Banner">
              <div className="Banner-row">
                <div className="banner-red-box">
                  <h3 className="Banner-title">
                    {document.c_hiringBanner}
                  </h3>
                  <div
                    className="Banner-content"
                    dangerouslySetInnerHTML={{
                      __html: RtfConverter.toHTML(
                        document.c_hiringBanner
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="container-narrow">
              <div className="location-information">
                <Contact
                  address={address}
                  phone={mainPhone}
                  name={name}
                  hours={hours}
                  googlePlaceId={document.googlePlaceId}
                  crossStreetInfo={document.c_crossStreetInfo}
                  happyHoursText={document.c_happyHoursText}
                  additionalHoursText={document.additionalHoursText}
                  c_specific_day={document.c_specific_day}
                  hideUberCTA={document.c_hideUberCTA}
                  latitude={
                    document?.yextDisplayCoordinate.latitude
                      ? document?.yextDisplayCoordinate.latitude
                      : document?.displayCoordinate.latitude
                  }
                  longitude={
                    document?.yextDisplayCoordinate.longitude
                      ? document?.yextDisplayCoordinate.longitude
                      : document?.displayCoordinate.longitude
                  }
                />
                <div className="map-sec Cafe-item-wrapper">
                  <h4 className="box-title Cafe-icon-features"><img src={glassIcon} />CAFE FEATURES</h4>
                  <ul className="Cafe-features-serList">
                    {document.c_locationPageServices &&
                      document.c_locationPageServices.map((item: string) => {
                        return (
                          <>
                            <li className="eachService">{item}</li>
                          </>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
             
            <div className="container-narrow">
              <div className="grid grid-cols-2">
                {/* <img
                  alt={
                    document.c_promotionPhoto.image.alternateText
                      ? document.c_promotionPhoto.image.alternateText
                      : document.c_promotionPhoto.description
                  }
                  title={
                    document.c_promotionPhoto.image.alternateText
                      ? document.c_promotionPhoto.image.alternateText
                      : document.c_promotionPhoto.description
                  }
                  className="Promo-image"
                  src={document.c_promotionPhoto.image.url}
                /> */}

                {/* <div
                  className="Promo-container"
                  style={{
                    backgroundColor:
                      document.c_promotionSectionBackgroundHexCode,
                  }}
                >
                  <div className="Promo-infoWrapper"> */}
                    {/* <h2 className="Promo-title">
                      {document.c_promotionPhoto.description}
                    </h2> */}
                    {/* <div className="Promo-details"> */}
                      {/* <div
                        dangerouslySetInnerHTML={{
                          __html: RtfConverter.toHTML(
                            document.c_promotionSectionDescription
                          ),
                        }}
                      /> */}
                    {/* </div>
                    <div className="Promo-downloadsText">
                      {document.c_promotionPhotoAppText}
                    </div>
                    <div className="Promo-downloads"> */}
                      {/* <Link
                        href={downloadAppUrl}
                        data-ya-track="itunes"
                        eventName={`itunes`}
                        rel="noopener noreferrer"
                        className="Promo-downloads-apple"
                      >
                        {svgIcons.appStoreIcon}
                      </Link> */}
                      {/* <Link
                        href={downloadAppUrl}
                        data-ya-track="google"
                        eventName={`google`}
                        rel="noopener noreferrer"
                        className="Promo-downloads-google"
                      >
                        {svgIcons.googlePlayIcon}
                      </Link> */}
                    {/* </div>
                  </div>
                </div>
              </div>
            </div> 
            
            <Newsbox
              c_newsBoxPhoto1={document.c_newsBoxPhoto1}
              c_newsBoxPhoto2={document.c_newsBoxPhoto2}
              c_newsBoxPhoto3={document.c_newsBoxPhoto3}
              c_newsBox1CTACopy={document.c_newsBox1CTACopy}
              c_newsBox2CTACopy={document.c_newsBox2CTACopy}
              c_newsBox3CTACopy={document.c_newsBox3CTACopy}
            />
            <FeaturedMenu c_featuredMenu={document.c_featuredMenu} />
            <About
              description={document.description}
              yextDisplayCoordinate={document?.yextDisplayCoordinate}
              displayCoordinate={document?.displayCoordinate}
              googlePlaceId={document.googlePlaceId}
              c_pagesBusinessDescriptionHeroImage={
                document.c_pagesBusinessDescriptionHeroImage
              }
            />
            <Faqs
              c_readMoreCta={document.c_readMoreCta}
              c_faqHeading={document.c_faqHeading}
              faqs={document.c_fAQSection}
            />
            {(yextDisplayCoordinate || cityCoordinate || displayCoordinate) && (
              <Nearby
                c_nearbyTitile={"Nearby Locations"}
                c_viewmoreCta={"See more locations"}
                geocodedCoordinate={
                  yextDisplayCoordinate
                    ? yextDisplayCoordinate
                    : displayCoordinate
                }
                id={document.id}
              />
            )}

            <ScrollButton/>
          </PageLayout> */}
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    </>
  );
};

export default Location;
