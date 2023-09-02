import * as React from "react";
import CookieConsent from "react-cookie-consent";
import "../../index.css";
import { svgIcons } from "../../svg icons/svgIcon";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { CTA, Link } from "@yext/pages/components";
import useDimensions from "../../hooks/useDimensions";
import { FooterMenuLinkType, SiteData, SocialMediaLinkType } from "../../types";
import { cookieText, cookiesUrl } from "../../sites-global/global";

/***
 * for using the all pages footer section
 *
 */

type FooterProps = {
  footer: SiteData;
  isSmallScreen: boolean;
};

type LowerFooterListProps = {
  lowerFooterMenus: CTA[];
};

type SocialMediaListProps = {
  socialMediaMenus: SocialMediaLinkType[];
};

type FooterMenuListProps = {
  footerMenu: FooterMenuLinkType[];
};

// Lower footer links
const LowerFooterList = ({ lowerFooterMenus }: LowerFooterListProps) => {
  return (
    <div className="Footer-bottomLinks">
      {lowerFooterMenus.map((res: CTA, index: number) => {
        return (
          <Link
            href={res.link}
            data-ya-track="footer-links"
            eventName={`footer-links`}
            rel="noopener noreferrer"
            key={index}
          >
            {res.label}
          </Link>
        );
      })}
    </div>
  );
};

// For social media icons
const SocialMediaList = ({ socialMediaMenus }: SocialMediaListProps) => {
  return (
    <div className="footerSocial">
      {socialMediaMenus.map(
        ({ icon, link }: SocialMediaLinkType, index: number) => {
          return (
            <Link
              key={index}
              href={link}
              data-ya-track={"social_" + icon.alternateText?.toLowerCase()}
              eventName={"social_" + icon.alternateText?.toLowerCase()}
              rel="noopener noreferrer"
            >
              <img
                alt={icon.alternateText}
                src={icon.url}
                title={icon.alternateText}
              />
            </Link>
          );
        }
      )}
    </div>
  );
};

const FooterMenuList = ({ footerMenu }: FooterMenuListProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [toggleButton, setToggleButton] = React.useState(false);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const { width } = useDimensions();
  React.useEffect(() => {
    if (width < 1023) {
      setIsSmallScreen(true);
      document.body.classList.add("mobile-hdr");
    } else {
      setIsSmallScreen(false);
      document.body.classList.remove("mobile-hdr");
    }

    return () => {
      setIsSmallScreen(false);
    };
  }, [width]);
  return (
    <div className="footerMenusList">
      {footerMenu.map(
        ({ listHeading, listMenus }: FooterMenuLinkType, index: number) => {
          function activeFunction() {
            setActiveIndex(index);
            if (index === activeIndex) {
              const toggleEvent = () => {
                if (toggleButton) {
                  setToggleButton(false);
                } else {
                  setToggleButton(true);
                }
              };
              toggleEvent();
            }
          }
          return (
            <React.Fragment key={index}>
              {!isSmallScreen ? (
                <div className="Footer-col" onClick={() => activeFunction()}>
                  <div
                    className={
                      toggleButton && index === activeIndex
                        ? "title active"
                        : "title"
                    }
                  >
                    {listHeading}
                  </div>
                  <ul>
                    <li>
                      {listMenus.map((res: CTA, i: number) => {
                        return (
                          <Link
                            key={i}
                            href={res.link}
                            data-ya-track={`link#`}
                            eventName={`link#`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {res.label}
                          </Link>
                        );
                      })}
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="Footer-col" onClick={() => activeFunction()}>
                  {/*  */}
                  <Accordion allowZeroExpanded>
                    <AccordionItem key={index}>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          <div className="title">{listHeading}</div>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <ul>
                          <li>
                            {listMenus.map((res: CTA, i: number) => {
                              return (
                                <Link
                                  key={i}
                                  href={res.link}
                                  data-ya-track={`link#`}
                                  eventName={`link#`}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {res.label}
                                </Link>
                              );
                            })}
                          </li>
                        </ul>
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                  {/*  */}
                </div>
              )}
            </React.Fragment>
          );
        }
      )}
    </div>
  );
};

const Footer = ({ footer }: FooterProps) => {
  const socialMediaMenus = footer.c_socialMedia ? footer.c_socialMedia : [];

  const lowerFooterMenus = footer.c_lowerFooterMenus
    ? footer.c_lowerFooterMenus
    : [];

  const footerMenu = footer.c_footerMenus ? footer.c_footerMenus : [];

  return (
    <>
      <div className="footer">
        <div className="Footer-topWrapper">
          <SocialMediaList socialMediaMenus={socialMediaMenus} />
          <div className="footerLogo">
            <img
              src={footer.c_logo.url}
              alt={footer.c_logo.alternateText}
              title={footer.c_logo.alternateText}
            ></img>
            {svgIcons.footerLogo}
          </div>
        </div>
        <FooterMenuList footerMenu={footerMenu} />
        <div className="Footer-bottomWrapper">
          <LowerFooterList lowerFooterMenus={lowerFooterMenus} />
          <div className="Footer-copyright">
            {footer.c_copyrightText
              ? footer.c_copyrightText
              : "Tropical Smoothie Cafe, LLC"}
          </div>
        </div>
      </div>
      <CookieConsent
        buttonText={"×"}
        buttonStyle={{
          marginLeft: "100px",
        }}
      >
        <h2 className="oswald pb-4 text-grey-darker text-2xl">
          We Use Cookies
        </h2>
        <p className="text-grey-darker text-base leading-normal">
          {cookieText}{" "}
          <Link
            href={cookiesUrl}
            data-ya-track={"privacy-policy"}
            eventName={"privacy-policy"}
            rel="noopener noreferrer"
            target="_blank"
          >
            our Privacy Policy
          </Link>
          .
        </p>
      </CookieConsent>
    </>
  );
};

export default Footer;
