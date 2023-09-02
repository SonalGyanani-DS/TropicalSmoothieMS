import * as React from "react";
import { StaticData } from "../../sites-global/staticData";
import Link from "../commons/Link";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

export default function Faq(props: {
  c_readMoreCta: {
    linkType: string;
    link: string;
    label: string;
  };
  c_faqHeading: string;
  faqs: Array<{ question: string; answer: string }>;
}) {
  const renderedQuestionsAnswers = props.faqs
    ? props.faqs.map(
        (item: { question: string; answer: string }, index: number) => {
          return (
            <>
              <div className="faq-tab">
                <div
                  aria-expanded="false"
                  aria-controls={"faq"+index+"_desc"}                  
                  className="faq__question-button !px-0 "
                  role={"group"}
                >
                  <Accordion allowZeroExpanded>
                    <AccordionItem key={index}>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          <div className="faq-tab-label">
                            <div>
                              <p>{item.question}</p>
                            </div>
                          </div>
                        </AccordionItemButton>
                      </AccordionItemHeading>

                      <AccordionItemPanel>
                        <div
                          id={"faq"+index+"_desc"}
                          data-qa="faq__desc"
                          className="faq-tab-content"
                        >
                          <div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.answer,
                              }}
                            />
                          </div>
                        </div>
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </>
          );
        }
      )
    : "";

  return (
    <>
      {renderedQuestionsAnswers ? (
        <div className=" faq-main-sec">
          <div className="container-narrow">
            <div className=" faq-card ">
              <div className="faq-sec-inner">
                <h2 className="">
                  {props.c_faqHeading
                    ? props.c_faqHeading
                    : StaticData.FAQheading}
                </h2>
                <div className="faq-tabs">{renderedQuestionsAnswers}</div>
              </div>
            </div>
            <div className="faq_CTA">
              {props.c_readMoreCta && <Link props={props.c_readMoreCta} />}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
