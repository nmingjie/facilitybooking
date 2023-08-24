"use client";

import { Separator } from "@/components/ui/separator";
import { FaCircleQuestion } from "react-icons/fa6";
import { BookingDetailsParam, AmenityParam } from "../../../unit";
import {format } from "date-fns";

interface ListingInfoProps {
  description?: string;
  capacity?: number;
  buildingName?: string;
  listing: BookingDetailsParam;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  capacity,
  buildingName,
  listing
}) => {
  const {facilityDetails,bookingDetails,applicantDetails} = listing;
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-lg sm:text-xl">
        <div className="text-xl sm:text-2xl font-semibold">
          {"Facility Details"}
        </div>
        <div className="py-2 space-y-2">
          <span className="text-neutral-500">Booking Reference ID</span>
          <div className="font-medium">{bookingDetails.brid} </div>
        </div>
        <div
          className="
            flex 
            sm:flex-row
            flex-col
          "
        >
          <div className="py-2 space-y-2 sm:w-2/4 w-full">
            <span className="text-neutral-500">Facility Type</span>
            <div className="font-medium">{facilityDetails.facilityType} </div>
          </div>
          <Separator orientation="vertical" className="hidden sm:block" />
          <div className="py-2 sm:px-4 space-y-2 sm:w-2/4 w-full">
            <span className="text-neutral-500">Building Name</span>
            <div className="font-medium">{buildingName} </div>
          </div>
        </div>
        <Separator />

        <div
          className="
            flex 
            flex-row
          "
        >
          <div className="py-2 space-y-2">
            <span className="text-neutral-500">Date of Booking</span>
            <div className="font-medium">
              {bookingDetails.bookingDate&&format(new Date(bookingDetails.bookingDate), 'PP')}
            </div>
          </div>
        </div>
        <Separator />
        <div
          className="
            flex 
            sm:flex-row
            flex-col
          "
        >
          <div className="py-2 space-y-2 sm:w-2/4 w-full">
            <span className="text-neutral-500">Start Time</span>
            <div className="font-medium">
              {bookingDetails.bookingTimeFrom&&format(new Date(bookingDetails.bookingTimeFrom), 'h:mm aa')}
            </div>
          </div>
          <Separator orientation="vertical" className="hidden sm:block"/>
          <div className="py-2 sm:px-4 space-y-2 sm:w-2/4 w-full">
            <span className="text-neutral-500">End Time</span>
            <div className="font-medium">
              {bookingDetails.bookingTimeTo&&format(new Date(bookingDetails.bookingTimeTo), 'h:mm aa')}
            </div>
          </div>
        </div>
        <Separator />

        <div
          className="
            flex 
            sm:flex-row
            flex-col
          "
        >
          <div className="py-2 space-y-2 sm:w-2/4 w-full">
            <span className="text-neutral-500">Capacity</span>
            <div className="font-medium">{capacity} Pax</div>
          </div>
          <Separator orientation="vertical" className="hidden sm:block"/>
          <div className="py-2 sm:px-4 space-y-2 sm:w-2/4 w-full">
            <span className="text-neutral-500">Amenities</span>
            <div className="flex-col gap-8">
              {
                facilityDetails.basicAmenities.length == 0 &&("-")
              }
              {facilityDetails.basicAmenities.length > 0 &&
                facilityDetails.basicAmenities.map((amenity: AmenityParam) => (
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
        </div>
      </div>
      <Separator></Separator>
      <div className="flex-col">
        <div className="text-xl sm:text-2xl font-semibold">{"Applicant Details"}</div>
        <div className="flex flex-col pb-6 text-lg sm:text-xl">
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Name</span>
            <span className="font-medium">{applicantDetails?.userName || "-"}</span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Designation</span>
            <span className="font-medium">{applicantDetails?.designation || "-"}</span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Company Name</span>
            <span className="font-medium"> {applicantDetails?.companyName || "-"}</span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Email</span>
            <span className="font-medium"> {applicantDetails.email || "-"}</span>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-2 py-4">
            <span className="font-light text-neutral-500"> Mobile</span>
            <span className="font-medium"> {applicantDetails.mobilePhone || "-"} </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
