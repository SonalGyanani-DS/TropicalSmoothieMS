import { Link } from "@yext/pages/components";
import * as React from "react";
import { tropicalMenuUrl } from "../../sites-global/global";

type data = {
  c_featuredMenu: [];
};

type itemData = {
  photo: { alternateText: string; url: string };
  description: string;
  title: string;
  cTA: { cTA: string; label: string; link: string };
};

export default function FeaturedMenu(props: data) {
  const featuredMenu = props?.c_featuredMenu?.map((item: itemData) => {
    return (
      <>
        <div className="news-box">
          <div className="bg-white news-inner">
            <img
              className="Product-img"
              src={item.photo.url}
              alt={
                item.photo.alternateText ? item.photo.alternateText : item.title
              }
              title={
                item.photo.alternateText ? item.photo.alternateText : item.title
              }
            />
            <div className="news-content-wrapper">
              <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                {item.title}
              </h3>
              <p className="leading-relaxed text-base">{item.description}</p>
              <div className="Product-linkWrapper Product-eachChild">
                <Link
                  href={item.cTA.link}
                  data-ya-track={"link#"}
                  eventName={"link#"}
                  rel="noopener noreferrer"
                >
                  {item.cTA.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  });

  return (
    <>
      {" "}
      {props.c_featuredMenu ? (
        <section className="text-gray-600 body-font">
          <div className="container-narrow">
            <div className="section-title">
              <h2>Find your next tropic getaway</h2>
            </div>
            <div className="flex flex-wrap news-boxes featuredMenu">
              {featuredMenu}
            </div>
            <div className="view-menu-box">
              <Link
                href={tropicalMenuUrl}
                data-ya-track={"view_menu_cta"}
                eventName={"view_menu_cta"}
                rel="noopener noreferrer"
              >
                View Menu
              </Link>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
}
