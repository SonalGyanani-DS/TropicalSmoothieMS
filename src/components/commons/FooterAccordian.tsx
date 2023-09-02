import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { svgIcons } from "../../svg icons/svgIcon";

/***
 * for using the footer accordions on mobile   
 * 
 */
type Data = {
  data: { c_copyrightText: string; c_footerMenus: []; c_lowerFooterMenus: [] };
};

const Footeraccordian = (SectionFooter: Data) => {
  const lowerSectionMenus = SectionFooter.data.c_lowerFooterMenus
    ? SectionFooter.data.c_lowerFooterMenus
    : [];
  const footerCopyRighttext = SectionFooter.data.c_copyrightText;
  const lowerSectionList = lowerSectionMenus.map(
    (val: { link: string; label: string }) => {
      return (
        <>
          <li>
            <a href={val.link}>{val.label}</a>
          </li>
        </>
      );
    }
  );
  const footerMenus = SectionFooter.data.c_footerMenus
    ? SectionFooter.data.c_footerMenus
    : [];
  const footerMenusList = footerMenus.map(
    (val: { listMenus: []; listHeading: string }) => {
      const listHeading = val.listHeading;
      const listmenus = val.listMenus
        ? val.listMenus.map((res: { link: string; label: string }) => {
            return (
              <>
                <li>
                  <a
                    className="inline-block hover:text-orangeDark"
                    href={res.link}
                    title="Main Menu"
                  >
                    {res.label}
                  </a>
                </li>
              </>
            );
          })
        : null;

      return (
        <>
          <div className="column">
            <AccordionItem>
              <div className="footer-link">
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <h5 className="footer-title">{listHeading}</h5>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <ul className="footer-menu">{listmenus}</ul>
                </AccordionItemPanel>
              </div>
            </AccordionItem>
          </div>
        </>
      );
    }
  );
  return (
    <>
      <footer className="site-footer">
        <div className="container flex flex-wrap">
          <div className="w-full px-4 mb-5">
            <div className="Footer-topWrapper">
              <div className="footerSocial">
                <a href="#">{svgIcons.faceBookIcon} </a>
                <a href="#">{svgIcons.instaIcon} </a>
                <a href="#">{svgIcons.twitterIcon}</a>
                <a href="#">{svgIcons.tiktakIicon} </a>
                <a href="#">{svgIcons.youTube} </a>
                <a href="#">{svgIcons.pintrestIcon} </a>
                <a href="#">{svgIcons.lindinIicon} </a>
              </div>
              <div className="footerLogo">{svgIcons.footerLogo}</div>
            </div>
          </div>
          <div className="w-full px-4 flex flex-col">
            <Accordion allowZeroExpanded>{footerMenusList}</Accordion>

            <div className="footer-block social-block">
              <ul className="social-links">{lowerSectionList}</ul>
              <h5 className="footer-title">{footerCopyRighttext}</h5>
            </div>
            <div className="footer-block address-block"></div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footeraccordian;
