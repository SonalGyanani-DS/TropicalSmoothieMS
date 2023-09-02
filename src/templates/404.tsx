import * as React from "react";
import "../index.css";
import {
  GetHeadConfig,
  GetPath,
  Template,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import {
  AnalyticsEnableDebugging,
  AnalyticsEnableTrackingCookie,
  favicon,
  metaBots,
  orderUrl,
} from "../sites-global/global";

import {
  AnalyticsProvider,
  AnalyticsScopeProvider,
  Link,
} from "@yext/pages/components";
import PageLayout from "../components/layouts/PageLayout";
import AcaiBerryBoost from "../images/AcaiBerryBoost.png";
import detoxIslandGreen from "../images/detoxIslandGreen.png";
import sunriseSunset from "../images/sunriseSunset.png";

export const getPath: GetPath<TemplateProps> = () => {
  return "404";
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = () => {
  return {
    title: "Page Not Found",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: `Page Not Found`,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "author",
          content: metaBots,
        },
      },
      {
        type: "link",
        attributes: {
          rel: "shortcut icon",
          href: favicon,
        },
      },
    ],
  };
};

interface datText extends TemplateRenderProps {
  _site: string[];
}

const FourOhFour: Template<datText> = ({ document, __meta }: datText) => {
  const { _site } = document;
  const templateData = { document: document, __meta: __meta };

  return (
    <>
      <AnalyticsProvider
        templateData={templateData}
        enableDebugging={AnalyticsEnableDebugging}
        enableTrackingCookie={AnalyticsEnableTrackingCookie}
      >
        {" "}
        <AnalyticsScopeProvider name={"404"}>
          <PageLayout _site={_site}>
            <div className="page-404 w-full">
              <div className="text-center text-grey-darker mx-auto py-20 px-2">
                <h1>404: Page Not Found</h1>
                <p className="error-msg">
                  In the meantime, try one
                  <br />
                  of our fan favorites
                </p>
                <div className="error-products">
                  <div className="products">
                    <h2 className="uppercase">
                      Acai Berry Boost<sup>™</sup>
                    </h2>
                    <img
                      height="300"
                      width="200"
                      src={AcaiBerryBoost}
                      alt="Acai Berry Boost™"
                      className=" block mx-auto"
                    />
                    <p>
                      acai, pomegranate,
                      <br />
                      banana, blueberries &amp;
                      <br />
                      strawberries
                    </p>
                    <Link
                      href={orderUrl}
                      data-ya-track="olo"
                      eventName={`olo`}
                      rel="noopener noreferrer"
                      aria-label="Order Acai Berry Boost™"
                      className="btn"
                    >
                      Order Now
                    </Link>
                  </div>
                  <div className="products">
                    <h2 className="uppercase">SUNRISE SUNSET</h2>
                    <img
                      height="300"
                      width="200"
                      src={sunriseSunset}
                      alt="SUNRISE SUNSET™"
                      className=" block mx-auto"
                    />
                    <p>
                      strawberries,
                      <br />
                      pineapple, mango
                      <br />& orange juice
                    </p>
                    <Link
                      href={orderUrl}
                      data-ya-track="olo"
                      eventName={`olo`}
                      rel="noopener noreferrer"
                      aria-label="Order SUNRISE SUNSET™"
                      className="btn"
                    >
                      Order Now
                    </Link>
                  </div>
                  <div className="products">
                    <h2 className="uppercase">DETOX ISLAND GREEN</h2>
                    <img
                      height="300"
                      width="200"
                      src={detoxIslandGreen}
                      alt="DETOX ISLAND GREEN™"
                      className=" block mx-auto"
                    />
                    <p>
                      spinach, kale, mango,
                      <br />
                      pineapple, banana & fresh
                      <br />
                      ginger (naturally sweetned)
                    </p>
                    <Link
                      href={orderUrl}
                      data-ya-track="olo"
                      eventName={`olo`}
                      rel="noopener noreferrer"
                      aria-label="Order DETOX ISLAND GREEN™"
                      className="btn"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </PageLayout>
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    </>
  );
};

export default FourOhFour;
