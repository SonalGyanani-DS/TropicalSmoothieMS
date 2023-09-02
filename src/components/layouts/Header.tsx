import * as React from "react";
import { useState } from "react";
import constant from "../../constant";
import { CTA, Link } from "@yext/pages/components";
import { downloadAppUrl, stagingBaseurl } from "../../sites-global/global";
import { HeaderRightSideLinkType, SiteData } from "../../types";

/***
 * for using the all pages header section
 * 
 */

type HeaderProps = {
  _site: SiteData;
  isSmallScreen: boolean;
};

type HeaderIconListProps = {
  headerRightSideLinks: HeaderRightSideLinkType[];
};
type HeaderMenuListProps = {
  headerMenus: CTA[];
};

const HeaderIconList = ({ headerRightSideLinks }: HeaderIconListProps) => {
  return (
    <div className="headerIconMenus">
      {headerRightSideLinks.map(
        ({ link, icon, label }: HeaderRightSideLinkType, index: number) => {
          let track = "";
          if(index == 0){
            track = "locator";
          }else{
            track = "ordernow";
          }
          return (
            <div className="icons" key={index}>
              <Link
                href={link}
                data-ya-track={track}
                eventName={track}
                rel="noopener noreferrer"
              >
                <img alt={label} src={icon.url} title={track} ></img>
                <span>{label}</span>
              </Link>
            </div>
          );
        }
      )}
    </div>
  );
};

const HeaderMenuList = ({ headerMenus }: HeaderMenuListProps) => {
  return (
    <>
      {headerMenus.map((val: CTA, index: number) => {
        return (
          <li key={index}>
            <Link
              href={val.link}
              data-ya-track="link#"
              eventName={`link#`}
              rel="noopener noreferrer"
            >
              {val.label}
            </Link>
          </li>
        );
      })}
    </>
  );
};

const HeaderMenuMobileList = ({ headerMenus }: HeaderMenuListProps) => {
  return (
    <>
      {headerMenus.map((val: CTA, index: number) => {
        if (val.label == "Menu") {
          return (
            <React.Fragment key={index}>
              <li>
                <Link
                  href={val.link}
                  data-ya-track="link#"
                  eventName={"link#"}
                  rel="noopener noreferrer"
                >
                  {val.label}
                </Link>
              </li>
              <li>
                <Link
                  href={stagingBaseurl + "search"}
                  data-ya-track={"link#"}
                  eventName={"link#"}
                  rel="noopener noreferrer"
                >
                  Locations
                </Link>
              </li>
            </React.Fragment>
          );
        } else {
          return (
            <li key={index}>
              <Link
                href={val.link}
                data-ya-track={"link#"}
                eventName={"link#"}
                rel="noopener noreferrer"
              >
                {val.label}
              </Link>
            </li>
          );
        }
      })}
    </>
  );
};

const Header = ({ _site, isSmallScreen }: HeaderProps) => {
  const [toggleButton, setToggleButton] = useState(false);

  const toggleEvent = () => {
    if (toggleButton) {
      setToggleButton(false);
    } else {
      setToggleButton(true);
    }
  };

  const headerLogoImage = _site.c_logo ? _site.c_logo.url : "";

  const headerOrderNowCta = _site.c_headerOrderNowCTA;

  return (
    <div className="tropicalSmoothieHeader">
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-MK4DC5F"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      <div className="leftPart">
        <div className="headerLogo">
          <Link
            href={constant.originalSite}
            data-ya-track="logo"
            eventName={`logo`}
            rel="noopener noreferrer"
            title={
              _site.c_logo.alternateText ? _site.c_logo.alternateText : "Logo"
            }
          >
            <img
              alt={
                _site.c_logo.alternateText ? _site.c_logo.alternateText : "Logo"
              }
              title={ _site.c_logo.alternateText ? _site.c_logo.alternateText : "Logo"}              
              src={headerLogoImage}
            ></img>
          </Link>
        </div>
        <div className="headerMenus">
          <div
            className={toggleButton ? "toggleButton active" : "toggleButton"}
            onClick={toggleEvent}
          >
            <span></span>
          </div>
          {!isSmallScreen ? (
            <ul className={toggleButton ? "shownav" : ""}>
              <HeaderMenuList headerMenus={_site.c_headerMenus} />
            </ul>
          ) : (
            <ul className={toggleButton ? "shownav" : ""}>
              <li className="downlaodApp">
                <Link
                  href={downloadAppUrl}
                  data-ya-track="app"
                  eventName={`app`}
                  rel="noopener noreferrer"
                  title={"Download App"}
                >
                  Download App
                </Link>
              </li>
              <HeaderMenuMobileList headerMenus={_site.c_headerMenus} />
            </ul>
          )}
        </div>
      </div>
      <div className="rightPart">
        <HeaderIconList headerRightSideLinks={_site.c_headerRightSideLinks} />
        <div className="headerOrderNowCta">
          <Link
            href={headerOrderNowCta.link}
            data-ya-track="ordernow"
            eventName={`ordernow`}
            rel="noopener noreferrer"
            className="redBtn"
            title={"Order Now"}
          >
            {headerOrderNowCta.label}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
