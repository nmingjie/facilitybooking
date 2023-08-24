"use client";

import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { IconType } from "react-icons";

import { FaMap } from "react-icons/fa6";

// import useCountries from "@/app/hooks/useCountries";
// import { SafeUser } from "@/app/types";

// import Avatar from "../Avatar";
// import ListingCategory from "./ListingCategory";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  //   user: SafeUser,
  description: string;
  capacity: number;
  price: number;
  //   roomCount: number;
  //   bathroomCount: number;
  //   category: {
  //     icon: IconType,
  //     label: string;
  //     description: string;
  //   } | undefined
  //   locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  //   user,
  //   description,
  //   guestCount,
  //   roomCount,
  //   bathroomCount,
  //   category,
  //   locationValue,
  capacity,
  price,
}) => {
  //   const { getByValue } = useCountries();

  //   const coordinates = getByValue(locationValue)?.latlng

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
        >
          {/* <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} /> */}
        </div>
        <div
          className="
        text-lg 
        font-bold
         text-neutral-500
        "
        >
          {"Details"}
        </div>
        <div
          className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div className="flex-1">
            Capacity
            <div>{capacity} Pax</div>
          </div>
          <div className="flex-1">
            Amenities
            
            <div>  <FaMap/> {"Projector"}</div>
            <div> <FaMap/> {"Projector"}</div>
          
          </div>

          {/* <div>
            {roomCount} rooms
          </div>
          <div>
            {bathroomCount} bathrooms
          </div> */}
          <div></div>
        </div>
      </div>
      {/* {category && (
        <ListingCategory
          icon={category.icon} 
          label={category?.label}
          description={category?.description} 
        />
      )} */}
      <Separator></Separator>

      <div
        className="
      text-lg font-light text-neutral-500"
      >
        {"Choose a time"}
      </div>

      <Separator></Separator>
      <div
        className="
        text-lg font-bold text-neutral-500"
      >
        {"How to get there"}
      </div>
      <Map />
    </div>
  );
};

export default ListingInfo;
