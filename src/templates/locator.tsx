import * as React from "react";
import "../index.css";
import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { SearchHeadlessProvider } from "@yext/search-headless-react";
import PageLayout from "../components/layouts/PageLayout";
import SearchLayout from "../components/locatorPage/SearchLayout";
import {
  experienceKey,
  apiKey,
  verticalKey,
  stagingBaseurl,
  AnswerExperienceConfig,
  AnalyticsEnableDebugging,
  AnalyticsEnableTrackingCookie,
  metaBots,
  siteLogo,
  googleAnalyticsScripts,
} from "../sites-global/global";
import favicon from "../images/favicon.png";
import { JsonLd } from "react-schemaorg";
import {
  AnalyticsProvider,
  AnalyticsScopeProvider,
} from "@yext/pages/components";
import { StaticData } from "../sites-global/staticData";
import { BreadcrumbList, Organization } from "../types";

export const config: TemplateConfig = {
  stream: {
    $id: "Locator",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: [
      "name",
      "slug",
      // "c_logo",
      // "c_headerMenus",
      // "c_headerRightSideLinks",
      // "c_headerOrderNowCTA",
    ],
    // Defines the scope of entities that qualify for this stream.
    filter: {
      entityIds: ["global-data"],
    },
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en"],
      primary: false,
    },
  },
};


export const getPath: GetPath<TemplateProps> = () => {
  return `/search`;
};
export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  const metaTitle =
    "Find the nearest Tropical Smoothie Cafe location near you | smoothies, rewards, flatbreads, wraps";
  const metaDescription =
    "Search Tropical Smoothie Cafe locations to find healthy food and delicious smoothies made with fresh fruits and veggies. Order online to beat the rush, and sign up on our mobile app to get rewards!";
  return {
    title: metaTitle,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    tags: [
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
          name: "description",
          content: metaDescription,
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
          href: `${stagingBaseurl + "search"}`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:title",
          content: metaTitle,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:description",
          content: metaDescription,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:url",
          content: `${stagingBaseurl + "search"}`,
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
          content: metaTitle,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:description",
          content: metaDescription,
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
          content: `${stagingBaseurl + "search"}`,
        },
      },
    ],
    other:googleAnalyticsScripts
  };
};

interface datText extends TemplateRenderProps {
  _site: string[];
}

const Locator: Template<datText> = ({ path, document, __meta }: datText) => {
  const { _site } = document;
  const templateData = { document: document, __meta: __meta };

  // console.log("site", _site);
  return (
    <>
      <JsonLd<Organization>
        item={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Tropical Smoothie ",
          url: stagingBaseurl,
          logo: favicon,
        }}
      />
      <JsonLd<BreadcrumbList>
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@id": "#",
                name: "Home",
              },
            },
            {
              "@type": "ListItem",
              position: 2,
              item: {
                "@id": stagingBaseurl + path,
                name: "Store Locator",
              },
            },
          ],
        }}
      />
      <AnalyticsProvider
        templateData={templateData}
        enableDebugging={AnalyticsEnableDebugging}
        enableTrackingCookie={AnalyticsEnableTrackingCookie}
      >
        <AnalyticsScopeProvider name={"locator"}>
          
          <PageLayout _site={_site}>
            <SearchHeadlessProvider
              experienceKey={experienceKey}
              locale={AnswerExperienceConfig.locale}
              apiKey={apiKey}
              verticalKey={verticalKey}
              experienceVersion="STAGING"
              sessionTrackingEnabled={true}
              endpoints={AnswerExperienceConfig.endpoints}
            >
              <SearchLayout  _site={_site} meta={__meta} />
            </SearchHeadlessProvider>
          </PageLayout>
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    </>
  );
};

export default Locator;
