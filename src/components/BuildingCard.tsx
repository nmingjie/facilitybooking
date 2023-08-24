'use client'

import { useCallback } from "react";

import qs from "query-string";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


import { Button } from "@/components/ui/button";


type CardProps = {
  title?: string;
  locationAddress?: string;
  facilityType?: string;
  href: string;
};

function BuildingCard({ title, locationAddress, facilityType, href }: CardProps) {
  const router = useRouter();
  // const params = useSearchParams();

  const handleClick = useCallback((data) => {
    let currentQuery = {};

    // if (params?.get("buildingName") === label) {
    //   delete updatedQuery.category;
    // }

    const url = qs.stringifyUrl(
      {
        url: href ? href : "#",
        query: {
          ...data
          // buildingName: title,
          // facilityType: "Board Room"
        },
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, title]);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg flex flex-col bg-white h-full gap-4">
      <div
        className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
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
          src={"/facility.png"}
          alt="Listing"
        />
      </div>
      <div className="px-6">
        <div className="text-xl mb-2">{title || "Unknown"}</div>
        <p className="text-gray-700 text-base">
          {locationAddress || "No Location"}
        </p>
      </div>
      <div className="self-center mb-6">
        <Button onClick={()=>handleClick({buildingName:title, facilityType:facilityType})}>
          Check Availability
        </Button>
      </div>
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
}

export default BuildingCard;
