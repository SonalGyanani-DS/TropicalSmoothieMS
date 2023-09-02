import * as React from "react";
import Modal from "react-modal";
import { Cross } from "../../sites-global/global";
import { StaticData } from "../../sites-global/staticData";
import Holidayhours from "./Holdayhours";
import { HolidayHours } from "../../types/search/locations";

const customStyles = {
  content: {},
};

type ModelProps = {
  holidayHours: HolidayHours[];
  name: string;
  c_specific_day: string;
};

function Model(props: ModelProps) {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  // function openModal() {
  //   document.body.classList.add("overflow-hidden");
  //   setIsOpen(true);
  // }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    document.body.classList.remove("overflow-hidden");
    setIsOpen(false);
  }

  return (
    <>
      {props.holidayHours.map((res: HolidayHours) => {
        const d1 = new Date();
        const d2 = new Date(res.date);

        if (d2.getDate() >= d1.getDate()) {
          return (
            <>
              {/* <a
                onClick={openModal}
                className="text-link"
                id="holidaybtn"
                href="javascript:void(0);"
              >
                {props.name}
              </a> */}
              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <button
                  onClick={closeModal}
                  type="button"
                  id="closeButton"
                  className="closeButton bg-closeIcon bg-no-repeat bg-center w-7 h-7 bg-[length:48px]"
                >
                  <div dangerouslySetInnerHTML={{ __html: Cross }} />
                </button>

                {props.holidayHours ? (
                  <>
                    <div className="font-bold text-lg  mb-4">
                      {StaticData.Holdiay}
                    </div>
                    <div className="pop-up-holyhrs heading">
                      <div>Date</div>

                      <div>Day</div>
                      <div> Opening Hours</div>
                      {props.c_specific_day && <div> Specific Day</div>}
                    </div>
                    <Holidayhours
                      hours={props.holidayHours}
                      c_specific_day={props.c_specific_day}
                    />
                  </>
                ) : (
                  ""
                )}
              </Modal>
            </>
          );
        }
      })}
    </>
  );
}

export default Model;
