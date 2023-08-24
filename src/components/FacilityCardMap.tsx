"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  FaMapLocation,
  FaDollarSign,
  FaCube,
  FaUser,
  FaRegClock,
} from "react-icons/fa6";

import { useRouter } from "next/navigation";

export type Listing = {
  // id: string
  // title?: string;
  facilityID: string;
  buildingName?: string;

  facilityType?: string;
  facilityName?: string;
  capacity?: string;
  // status?: string;
  buildingAddress?: string;
  hourlyRentWeekday?: number;
};

type FacilityCardProps = {
  data: Listing;
  cardOutsideClass: string;
};

const FacilityCard: React.FC<FacilityCardProps> = ({
  data,
  cardOutsideClass,
}) => {
  const router = useRouter();

  return (
    <div className={cardOutsideClass ? cardOutsideClass : ""}>
      <div
        className="group max-w-sm rounded-lg overflow-hidden shadow-lg flex flex-col bg-white col-span-1 h-full border border-gray-200"
        onClick={() => router.push(`/facility/${data.facilityID}`)}
      >
        <div className="p-4">
          <div className="text-md">
            <ul className="space-y-2">
              <li>
                <div className="flex items-center gap-2">
                  <div className="w-3.5">
                    <FaCube size={14} className="fill-blue-500" />
                  </div>
                  {`${data.facilityType} - ${data.facilityName}` || "Unknown"}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <div className="w-3.5">
                    <FaUser size={14} className="fill-blue-500" />
                  </div>
                  {data.capacity || "Unknown"}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <div className="w-3.5">
                    <FaRegClock size={14} className="fill-blue-500" />
                  </div>
                  {"Unknown"}
                  {/* {status || "Unknown"} */}
                </div>
                <li>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5">
                      <FaDollarSign size={14} className="fill-blue-500" />
                    </div>
                    {data.hourlyRentWeekday || "Unknown"} <span> /Hour</span>
                  </div>
                </li>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
