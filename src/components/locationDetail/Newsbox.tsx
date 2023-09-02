import * as React from "react";
type innerData = {
  description: string;
  details?: string | "";
  image: {
    url: string;
    alternateText: string;
  };
  clickthroughUrl: string;
};
type data = {
  c_newsBoxPhoto1: innerData;
  c_newsBoxPhoto2: innerData;
  c_newsBoxPhoto3: innerData;
  c_newsBox1CTACopy: string;
  c_newsBox2CTACopy: string;
  c_newsBox3CTACopy: string;
};

export default function Newsbox(props: data) {
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container-narrow">
          <div className="flex flex-wrap news-boxes">
            {props.c_newsBoxPhoto1 ? (
              <div className="news-box">
                <div className="bg-white news-inner">
                  <img
                    className="Product-img"
                    src={props.c_newsBoxPhoto1.image.url}
                    alt={
                      props.c_newsBoxPhoto1.image.alternateText
                        ? props.c_newsBoxPhoto1.image.alternateText
                        : props.c_newsBoxPhoto1.description
                    }
                    title={
                      props.c_newsBoxPhoto1.image.alternateText
                        ? props.c_newsBoxPhoto1.image.alternateText
                        : props.c_newsBoxPhoto1.description
                    }
                  />

                  <div className="news-content-wrapper">
                    <h3
                      className="tracking-widest text-indigo-500 text-xs font-medium title-font"
                      dangerouslySetInnerHTML={{
                        __html: props.c_newsBoxPhoto1.description.replace(
                          "®",
                          "<sup class='product-copyright'>®</sup>"
                        ),
                      }}
                    ></h3>
                    <p className="leading-relaxed text-base">
                      {props.c_newsBoxPhoto1.details}{" "}
                    </p>
                    <div className="Product-linkWrapper Product-eachChild">
                      <a
                        className="Product-link"
                        href={props.c_newsBoxPhoto1.clickthroughUrl}
                      >
                        {props.c_newsBox1CTACopy
                          ? props.c_newsBox1CTACopy
                          : "ORDER NOW"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {props.c_newsBoxPhoto2 ? (
              <div className="news-box">
                <div className="bg-whit news-inner">
                  <img
                    className="Product-img"
                    src={props.c_newsBoxPhoto2.image.url}
                    alt={
                      props.c_newsBoxPhoto2.image.alternateText
                        ? props.c_newsBoxPhoto2.image.alternateText
                        : props.c_newsBoxPhoto2.description
                    }
                    title={
                      props.c_newsBoxPhoto2.image.alternateText
                        ? props.c_newsBoxPhoto2.image.alternateText
                        : props.c_newsBoxPhoto2.description
                    }
                  />
                  <div className="news-content-wrapper">
                    <h3
                      className="tracking-widest text-indigo-500 text-xs font-medium title-font"
                      dangerouslySetInnerHTML={{
                        __html: props.c_newsBoxPhoto2.description.replace(
                          "®",
                          "<sup class='product-copyright'>®</sup>"
                        ),
                      }}
                    ></h3>
                    <p className="leading-relaxed text-base">{props.c_newsBoxPhoto2.details}</p>
                    <div className="Product-linkWrapper Product-eachChild">
                      <a
                        className="Product-link"
                        href={props.c_newsBoxPhoto2.clickthroughUrl}
                      >
                        {props.c_newsBox2CTACopy
                          ? props.c_newsBox2CTACopy
                          : "LEARN MORE"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {props.c_newsBoxPhoto3 ? (
              <div className="news-box">
                <div className="bg-whit news-inner">
                  <img
                    className="Product-img"
                    src={props.c_newsBoxPhoto3.image.url}
                    alt={
                      props.c_newsBoxPhoto3.image.alternateText
                        ? props.c_newsBoxPhoto3.image.alternateText
                        : props.c_newsBoxPhoto3.description
                    }
                    title={
                      props.c_newsBoxPhoto3.image.alternateText
                        ? props.c_newsBoxPhoto3.image.alternateText
                        : props.c_newsBoxPhoto3.description
                    }
                  />
                  <div className="news-content-wrapper">
                    <h3
                      className="tracking-widest text-indigo-500 text-xs font-medium title-font"
                      dangerouslySetInnerHTML={{
                        __html: props.c_newsBoxPhoto3.description.replace(
                          "®",
                          "<sup class='product-copyright'>®</sup>"
                        ),
                      }}
                    ></h3>
                    <p className="leading-relaxed text-base">{props.c_newsBoxPhoto3.details}</p>
                    <div className="Product-linkWrapper Product-eachChild">
                      <a
                        className="Product-link"
                        href={props.c_newsBoxPhoto3.clickthroughUrl}
                      >
                        {props.c_newsBox3CTACopy
                          ? props.c_newsBox3CTACopy
                          : "ORDER NOW"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
    </>
  );
}
