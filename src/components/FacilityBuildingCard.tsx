'use client'

import { useCallback } from "react";

import qs from "query-string";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


import { Button } from "@/components/ui/button";


type CardProps = {
  title?: string;
  imagePath?: string;
  locationAddress?: string;
  facilityType?: string;
  href: string;
};

function FacilityBuildingCard({ title,imagePath, locationAddress, facilityType, href }: CardProps) {
  const router = useRouter();
  // const params = useSearchParams();

  const handleClick = useCallback((data:any) => {
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
    <div className="w-full flex flex-col h-auto grow">
      <div className="w-80 ml-0 overflow-hidden shadow-lg bg-white h-full flex flex-col">
        <div
          className="
              aspect-auto
              items-stretch 
              w-full
              min-h-[280px]
              overflow-hidden 
            "
        >
          <Image
            width={320}
            height={280}
            className="object-cover w-full h-full min-h-[280px] max-w-[320px] transition hover:scale-110"
            src={imagePath?imagePath:"/facility.png"}
            blurDataURL="/facility.png"
            alt="Listing"
          />
        </div>
        <div className="flex flex-col h-full py-6 justify-between gap-4">
          <div className="px-6 grow">
            <div className="text-xl lg:text-2xl font-bold mb-2 line-clamp-2">{title || "Unknown"}</div>
            <p className="text-gray-700 text-base">
              {locationAddress || "No Location"}
            </p>
          </div>
          <div className="self-center">
            <Button onClick={()=>handleClick({buildingName:title, facilityType:facilityType})}>
              Check Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacilityBuildingCard;
