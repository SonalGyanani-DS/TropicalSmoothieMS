import * as React from "react";
import { useEffect, useState } from "react";
import Footer from "./footer";
import Header from "./Header";
import useDimensions from "../../hooks/useDimensions";
import { SiteData } from "../../types";


type Props = {
  title?: string;
  _site?: SiteData;
  children?: React.ReactNode;
};

const PageLayout = ({ _site, children }: Props) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { width } = useDimensions();

  useEffect(() => {
    document.body.setAttribute("id", "body");
    if (width < 767) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }

    return () => {
      setIsSmallScreen(false);
    };
  }, [width]);

  return (
    <>
      {typeof _site != "undefined" && (
        <Header _site={_site} isSmallScreen={isSmallScreen} />
      )}
      {children}
      {typeof _site != "undefined" && (
        <Footer footer={_site} isSmallScreen={isSmallScreen} />
      )}
    </>
  );
};

export default PageLayout;
