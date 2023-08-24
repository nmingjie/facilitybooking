"use client";

import { Separator } from "@/components/ui/separator";
import { FaCircleQuestion } from "react-icons/fa6";
import { store } from "@/redux";
import { ListingParam, AmenityParam } from "../../unit";

interface ListingInfoProps {
  description?: string;
  capacity?: number;
  buildingName?: string;
  listing: ListingParam;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  capacity,
  buildingName,
  listing,
}) => {
  const bookingInfo = store.getState().booking;
  const facilityBookingInfo = bookingInfo[listing.facilityID];
  const userInfo = facilityBookingInfo?.userInfo?facilityBookingInfo.userInfo:store.getState().user.userinfo;

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
          className="
            flex 
            flex-row
          "
        >
          <div className=" p-2 space-y-2 w-2/4">
            <span>Facility Type</span>
            <div className="font-bold">{listing.facilityType} </div>
          </div>
          <Separator orientation="vertical" />
          <div className=" py-2 px-4 space-y-2 w-2/4">
            <span>Building Name</span>
            <div className="font-bold">{buildingName} </div>
          </div>
        </div>
        <Separator />

        <div
          className="
            flex 
            flex-row
          "
        >
          <div className=" p-2 space-y-2">
            <span>Date of Booking</span>
            <div className="font-bold">
              {facilityBookingInfo.bookingDate &&
                new Date(facilityBookingInfo.bookingDate).toDateString()}{" "}
            </div>
          </div>
        </div>
        <Separator />
        <div
          className="
            flex 
            flex-row
          "
        >
          <div className=" p-2 space-y-2 w-2/4">
            <span>Start Time</span>
            <div className="font-bold">
              {facilityBookingInfo.startTime &&
                new Date(facilityBookingInfo.startTime).toLocaleString(
                  "en-SG",
                  {
                    hour: "numeric",
                    hour12: true,
                    minute: "numeric",
                  }
                )}{" "}
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className=" py-2 px-4 space-y-2 w-2/4">
            <span>End Time</span>
            <div className="font-bold">
              {facilityBookingInfo.endTime &&
                new Date(facilityBookingInfo.endTime).toLocaleString("en-SG", {
                  hour: "numeric",
                  hour12: true,
                  minute: "numeric",
                })}{" "}
            </div>
          </div>
        </div>
        <Separator />

        <div
          className="
            flex 
            flex-row
          "
        >
          <div className=" p-2 space-y-2 w-2/4">
            <span>Capacity</span>
            <div className="font-bold">{capacity} Pax</div>
          </div>
          <Separator orientation="vertical" />
          <div className=" py-2 px-4 space-y-2 w-2/4">
            <span>Amenities</span>
            <div className="flex-col gap-8">
              {listing.basicAmenities &&
                listing.basicAmenities.map((amenity: AmenityParam) => (
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
                ))}
            </div>
          </div>
          <div></div>
        </div>

        <div
          className="
            flex 
            flex-col
          "
        >
          <div>Purpose of Usage</div>
          <div className="font-bold">{facilityBookingInfo.purpose}</div>
        </div>
      </div>

      <Separator></Separator>

      <div className="flex-col">
        <div className="text-lg font-bold">{"Applicant Details"}</div>
        <div className="flex flex-col pb-6">
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Name</span>
            <span className="font-bold">
              {" "}
              {`${userInfo.firstName || ""}  ${userInfo.lastName || ""}`}
            </span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Designation</span>
            <span className="font-bold"> {userInfo.designation || "-"} </span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Company Name</span>
            <span className="font-bold"> {userInfo.companyName || "-"}</span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Email</span>
            <span className="font-bold"> {userInfo.email || "-"}</span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Mobile</span>
            <span className="font-bold"> {userInfo.phoneNumber || "-"} </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
