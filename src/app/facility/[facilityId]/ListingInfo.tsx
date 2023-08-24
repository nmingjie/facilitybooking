"use client";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { FaCircleQuestion } from "react-icons/fa6";
import { Calendar } from "./Calendar";

import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { store } from "@/redux/index";
import { ListingParam, AmenityParam } from "../unit";

import PublicUserInfo from "@/components/listing/PublicUserInfo";

interface ListingInfoProps {
  description?: string;
  capacity: number;
  price: number;
  reservation?: Object;
  setReservation: Function;
  listing: ListingParam;
  handleSubmitClick?: Function;
  purposeChange?: (
    e?: React.ChangeEvent<HTMLTextAreaElement> | undefined
  ) => void;
}

type ReservationParam = {
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
};

const ListingInfo = forwardRef(
  (
    {
      capacity,
      listing,
      setReservation,
      purposeChange,
      handleSubmitClick,
    }: ListingInfoProps,
    ref
  ) => {
    const [seeAllAmenities, setSeeAllAmenities] = useState(false);
    const [width, setWidth] = useState(store.getState().global.currentSize);

    store.subscribe(() => {
      setWidth(store.getState().global.currentSize);
    });

    const userInfo = store.getState().user.userinfo;

    const publicUserInfo = useRef(null);
    useImperativeHandle(ref, () => {
      return {
        handleClickOnSubmit: publicUserInfo?.current,
      };
    });
    return (
      <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div
            className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          "
          ></div>
          <div
            className="
        text-lg 
        font-bold
        "
          >
            {"Facility Details"}
          </div>
          <div
            className={width < 640 ? "flex flex-col" : "flex flex-row gap-4"}
          >
            <div className="flex-1 p-2 space-y-2">
              <span>Capacity</span>
              <div className="font-bold">{capacity} Pax</div>
            </div>
            <Separator orientation={width < 640 ? "horizontal" : "vertical"} />
            <div className="flex-1 p-2 space-y-2">
              <span>Amenities</span>
              <div className="flex-col gap-8">
                {listing.basicAmenities &&
                  listing.basicAmenities.map(
                    (amenity: AmenityParam, index: number) => {
                      const renderNode = (
                        <div
                          key={amenity.amenityName}
                          className="flex gap-2 items-center h-8"
                        >
                          {amenity.imagePath ? (
                            <div className="w-[20px] h-[20px]">
                              <img
                                className="w-full h-full object-cover"
                                src={amenity.imagePath}
                                alt="mySvgImage"
                              />
                            </div>
                          ) : (
                            <FaCircleQuestion className="w-[20px] h-[20px]" />
                          )}
                          {amenity.amenityName}
                        </div>
                      );
                      if (!seeAllAmenities && index < 3) {
                        return renderNode;
                      } else if (seeAllAmenities) return renderNode;
                    }
                  )}
                {!seeAllAmenities && (
                  <div
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setSeeAllAmenities(true)}
                  >
                    See all amenities
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          PurPose of Usage
          <Textarea onChange={purposeChange} />
        </div>
        <Separator></Separator>

        <div
          className="
        text-lg font-bold flex-col gap-4"
        >
          {"Choose a time"}
          <Calendar
            facilityId={listing.facilityID}
            bookingDate={new Date()}
            setReservation={(reservation: ReservationParam) => {
              setReservation(reservation);
            }}
          />
        </div>

        <Separator></Separator>
        {
          userInfo.role==='PUBLIC-USERS' && <PublicUserInfo
          ref={publicUserInfo}
          handleSubmitClick={handleSubmitClick}
        />
        }

      </div>
    );
  }
);

ListingInfo.displayName = "ListingInfo;"
export default ListingInfo;