"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { FaLocationDot, FaRegClock, FaRegFlag } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";

import { useRouter } from "next/navigation";
import { format } from "date-fns";

export type Listing = {
  brid: string;
  buildingName?: string;
  facilityType?: string;
  facilityName?: string;
  capacity?: string;
  status?: string;
  bookingDate?: string;
  bookingTimeFrom?: string;
  bookingTimeTo?: string;
  imagePath?: string;
};

type FacilityCardProps = {
  data: Listing;
};

const FacilityCard: React.FC<FacilityCardProps> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="group max-w-sm  overflow-hidden shadow-md flex flex-col bg-white col-span-1 h-full pb-4">
      <div
        className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
          "
      >
        <Image
          fill
          className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
          src={data.imagePath ? data.imagePath : "/facility.png"}
          alt="Listing"
        />
      </div>
      <div className="px-6">
        <div className="text-xl font-semibold mb-2">
          {data.brid || "Unknown"}
        </div>

        <div className="text-md">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                  <FaRegClock size={20} className="fill-blue-500" />
                </div>

                {data.bookingDate && data.bookingTimeFrom && data.bookingTimeTo
                  ? `${format(new Date(data.bookingDate), "PPP")} , ${format(
                      new Date(data.bookingTimeFrom),
                      "h aa"
                    )} - ${format(new Date(data.bookingTimeTo), "h aa")}`
                  : "Unknown"}
              </div>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 -translate-x-1">
                  <MdOutlineLocationOn size={23} className="fill-blue-500" />
                </div>
                {`${data.facilityType} - ${data.facilityName}` || "Unknown"}
              </div>
            </li>

            <li>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                  <FaRegFlag size={20} className="fill-blue-500" />
                </div>
                {data.status ? (
                  data.status.toLowerCase() === "in-progress" ? (
                    <span className="text-amber-400">{data.status}</span>
                  ) : (
                    <span>{data.status}</span>
                  )
                ) : (
                  "Unknown"
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
