import * as React from "react";
import RtfConverter from "@yext/rtf-converter";

/** Accordion for FAQs  */

type faqs = {
  showDescription: string;
  ariaExpanded: boolean;
  fontWeightBold: string;
  background: string;
  item: {question:string,answer:string};
  index:number;
  onClick: () => void;
};

const AccordionItem = (props: faqs) => {
  const {
    showDescription,
    ariaExpanded,
    fontWeightBold,
    background,
    item,
    index,
    onClick,
  } = props;
  return (
    <div className="faq-tab" key={item.question}>
      <div
        aria-expanded={ariaExpanded}
        aria-controls={`faq${index + 1}_desc`}        
        className={`faq__question-button !px-0 ${fontWeightBold} `}
        role={"group"}
        onClick={onClick}
      >
        <div className={`faq-tab-label  ${background} `}>
          <div
            dangerouslySetInnerHTML={{
              __html: RtfConverter.toHTML(item.question),
            }}
          />
        </div>
      </div>
      <div
        id={`faq${index + 1}_desc`}
        data-qa="faq__desc"
        className={`faq-tab-content ${showDescription}`}
      >
        <div
          dangerouslySetInnerHTML={{ __html: RtfConverter.toHTML(item.answer) }}
        />
      </div>
    </div>
  );
};

export default AccordionItem;
