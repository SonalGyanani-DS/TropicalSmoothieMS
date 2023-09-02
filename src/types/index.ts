import { CTA } from "@yext/pages/components";
import { Coordinate, Hours } from "./search/locations";

export type Organization = {
  "@context"?: string | string[];
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
};

export type BreadcrumbList = {
  "@context"?: string | string[];
  "@type": "BreadcrumbList";
  itemListElement: ListItem[];
};

export type ListItem = {
  "@type": "ListItem";
  position: number;
  item: { "@id": string; name: string };
};

export type EnvMode = "development" | "production";

export interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
  sublocality?: string;
  city: string;
  region: string;
  postalCode: string;
  extraDescription?: string;
  countryCode: string;
}

export interface ImageThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  thumbnails?: ImageThumbnail[];
  alternateText?: string;
}

export type EntityType = {
  id: string;
};

export interface Meta {
  entityType: EntityType;
  locale: string;
}
export type TemplateMeta = {
  mode: "development" | "production";
};

export interface HeaderRightSideLinkType {
  link: string;
  label: string;
  icon: Image;
}

export interface SocialMediaLinkType {
  link: string;
  icon: Image;
}

export interface FooterMenuLinkType {
  listHeading: string;
  listMenus: CTA[];
}
export interface SiteData {
  name: string;
  c_logo: Image;
  c_headerMenus: CTA[];
  c_headerRightSideLinks: HeaderRightSideLinkType[];
  c_headerOrderNowCTA: CTA;
  c_socialMedia: SocialMediaLinkType[];
  c_footerLogo: string;
  c_copyrightText: string;
  c_footerMenus: FooterMenuLinkType[];
  c_lowerFooterMenus: CTA[];
}

export interface DMDirectoryParent {
  entityId: string;
  name: string;
}

export interface FeaturedMenu {
  title: string;
  description: string;
  cTA: CTA;
  photo: Image;
}

export interface LocationData {
  id: string;
  type: string;
  website: string;
  slug?: string;
  appleBusinessId: string;
  appleCompanyId: string;
  deliveryUrl: string;
  geomodifier: string;
  googlePlaceId: string;
  savedFilters: string[];
  address: Address;
  description: string;
  hours: Hours;
  logo: {
    image: Image;
  };
  name: string;
  cityCoordinate: {
    latitude: number;
    longitude: number;
  };
  c_cafeNameForReporting: string;
  c_corpFBL: string;
  dm_directoryParents: DMDirectoryParent[];
  c_dMA: string;
  c_featuredMenuCTA: CTA;
  c_featuredMenu: FeaturedMenu[];
  c_featuredMenuTitle: string;
  c_fieldMarketingManagerName: string;
  c_franchiseeEmail: string;
  c_franchiseeFirstName: string;
  c_franchiseePhone: string;
  c_geomodifier: string;
  c_hiringBanner: {
    headerText: string;
    content: string;
  };
  c_locationPageMetaTitle: string;
  c_locationPageServices: string[];
  c_newsBoxPhoto1: {
    image: Image;
    clickthroughUrl: string;
    description: string;
    details: string;
  };
  c_newsBoxPhoto2: {
    image: Image;
    clickthroughUrl: string;
    description: string;
    details: string;
  };
  timezone?: string;
  orderUrl: {
    url: string;
  };
  yextDisplayCoordinate: Coordinate;
  c_crossStreetInfo: string;
}

export interface LocationDetailData {
  id: string;
  type: string;
  website: string;
  slug?: string;
  appleBusinessId: string;
  appleCompanyId: string;
  deliveryUrl: string;
  geomodifier: string;
  googlePlaceId: string;
  savedFilters: string[];
  address: Address;
  description: string;
  hours: Hours;
  logo: {
    image: Image;
  };
  name: string;
  cityCoordinate: {
    latitude: number;
    longitude: number;
  };
  c_cafeNameForReporting: string;
  c_corpFBL: string;
  dm_directoryParents: DMDirectoryParent[];
  c_dMA: string;
  c_featuredMenuCTA: CTA;
  c_featuredMenu: FeaturedMenu[];
  c_featuredMenuTitle: string;
  c_fieldMarketingManagerName: string;
  c_franchiseeEmail: string;
  c_franchiseeFirstName: string;
  c_franchiseePhone: string;
  c_geomodifier: string;
  c_hiringBanner: {
    headerText: string;
    content: string;
  };
  c_locationPageMetaTitle: string;
  c_locationPageServices: string[];
  c_newsBoxPhoto1: {
    image: Image;
    clickthroughUrl: string;
    description: string;
    details: string;
  };
  c_newsBoxPhoto2: {
    image: Image;
    clickthroughUrl: string;
    description: string;
    details: string;
  };
  timezone?: string;
  orderUrl: {
    url: string;
  };
  yextDisplayCoordinate: Coordinate;
  c_crossStreetInfo: string;
}

export interface LocationResultData {
  data: LocationData;
  rawData: LocationData;
  distance: number;
  distanceFromFilter: number;
}
