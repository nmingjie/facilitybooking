"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { FaLocationDot, FaCube, FaUser, FaRegClock, FaMap } from "react-icons/fa6";

import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

export type Listing = {
  facilityID: string;
  buildingName?: string;
  facilityType?: string;
  facilityName?: string;
  capacity?: string;
  buildingAddress?: string;
  hourlyRentWeekday?: number;
  images: Array<ImageObj>;
};
type ImageObj = {
  imagePath: string;
  itemId: string;
  itemName?: string;
}
type FacilityCardProps = {
  data: Listing;
  isLoading: boolean;
};

const FacilityCard: React.FC<FacilityCardProps> = ({
  data,
  isLoading = false,
}) => {
  const router = useRouter();
  // If there is no picture information, the default picture is used
  const imageSrc = data.images.length && data.images[0].imagePath ? data.images[0].imagePath : "/facility.png";
  return (
    <div
      className={`group max-w-sm overflow-hidden shadow-lg flex flex-col bg-white col-span-1 h-full lg:max-w-[370px] lg:min-w-[370px]`}
    >
      {isLoading && <Skeleton className="bg-gray-400 h-96">
        <span> hello</span>
      </Skeleton>}
      <div className="relative  overflow-hidden">
        <Image className="object-cover group-hover:scale-110 transition"
          src={imageSrc}
          style={{width:'100%', height:200}}
          width={356}
          height={200}
          quality={100}
          alt="Listing"/>
      </div>
      <div className="px-6 pt-6">
        <div className="text-xl font-semibold mb-2">
          {data.buildingName || "Unknown"}
        </div>
        <div className="text-md">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center gap-2">
                <FaCube size={14} className="fill-blue-500" />
                {`${data.facilityType} - ${data.facilityName}` || "Unknown"}
              </div>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <FaUser size={14} className="fill-blue-500" />
                {`${data.capacity || "Unknown"} Pax`}
              </div>
            </li>
            <li>
              <div className="flex items-center gap-2 text-green-500 font-semibold">
                <FaRegClock size={14} className="fill-blue-500" />
                {"Available"}
                {/* {status || "Unknown"} */}
              </div>
            </li>
            {/* This field is displayed only when it is added to the interface in the future */}
            {/* <li>
              <div className="flex items-center gap-2">
                <FaMap size={14} className="fill-blue-500" />
                {"West"}
              </div>
            </li> */}
          </ul>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center gap-2 text-blue-500 font-semibold">
            <FaLocationDot size={14} className="fill-blue-500" />
            {data.buildingAddress || "Unknown"}
          </div>
          <div className="flex items-center gap-2 text-blue-500 font-semibold">
            {`$${data.hourlyRentWeekday || "Unknown"}/Hour`}
          </div>
        </div>
      </div>
      <div className="px-6 pt-4 pb-1 self-end">
        <Button
          onClick={() => router.push(`/facility/${data.facilityID}`)}
        >
          Book Now
        </Button>
      </div>
      <div className="px-6 pb-3 self-end text-blue-500">{"Prices are inclusive of GST."}</div>
      {/* <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #photography
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #travel
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #winter
        </span>
      </div> */}
    </div>
  );
};

export default FacilityCard;
