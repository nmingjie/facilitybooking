"use client";

import FacilityBuildingCard from "@/components/FacilityBuildingCard";
import FacilityCard from "@/components/FacilityCard";
import FacilitySearch from "@/components/facilityHomeSearch/facilityHomeSearch";

import Carousel from "@/components/Carousel";
import MessageSlideBanner from "./components/MessageSlideBanner";
import { useState, useEffect } from "react";
import request from "@/api/request";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Facility | JTC",
  description: "Facility | JTC",
};

export default function Page() {
  let [facilitySearchSelection, setFacilitySearchSelection] = useState({facilityTypes:[],buildings:[]});
  let [buildingsByFacilityTypes, setBuildingsByFacilityTypes] = useState([]);
  const [announcementsInfo,setAnnouncementsInfo] = useState({});
  const [bookingsInfo,setBookingsInfo] = useState([]);

  const init = async () => {
    try {
      const announcementsData = await request.get("/api/annoucements/upcoming");
      const bookingsData = await request.get("/api/fb/bookings/upcoming");
      if (announcementsData.data.data) 
        setAnnouncementsInfo(announcementsData.data.data);
      if(bookingsData.data.data)
        setBookingsInfo(bookingsData.data.data)

      // *** important - [facilitySearchData and facilitySearchData Api] The interface structure must be unified on the back end
      const facilitySearchData = await request.get("/api/fb/Search");
      const buildingsByFacilityTypesData = await request.get("/api/Building/groupByFacilityTypes");
      if (facilitySearchData.data)
        setFacilitySearchSelection(facilitySearchData.data)
      if (buildingsByFacilityTypesData.data)
        setBuildingsByFacilityTypes(buildingsByFacilityTypesData.data)
    } catch (e: any) {
      throw new Error(e);
    }
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="container px-0 font-display">
      {/* <title> Facility | JTC</title> */ }
      {/* py:padding-top and bottom    font-weight:500 */}
      <div className="py-4 ml-4 text-4xl font-medium md:text-7xl lg:ml-32">
        Facility Booking
      </div>
      {/* Message Slide Banner */}
      <div className="block ml-4 mb-4 lg:ml-32 xl:mr-20 sm:mr-4 ">
        <MessageSlideBanner announcementsInfo={announcementsInfo} bookingsInfo={bookingsInfo}></MessageSlideBanner> 
      </div>
      <div
        className="
        w-full 
        bg-[url('/searchBackDrop.jpg')]
        bg-cover	
        flex items-center"
      >
        <div className="mx-auto my-8 w-11/12 sm:w-10/12">
          <FacilitySearch selection={facilitySearchSelection}></FacilitySearch>
        </div>
      </div>

      {buildingsByFacilityTypes.length > 0 && (
        <div>
          <h3 className="mb-4 ml-4 lg:ml-32 pt-10 text-3xl md:text-5xl leading-tight">
            Featured Facilities
          </h3>
          <div className="bg-gray-200/70 pb-8">
            {buildingsByFacilityTypes &&
              buildingsByFacilityTypes.map((buildingsByFacilityType: any, index: number) => (
                <div key={'buildingsByFacilityType'+index}>
                  <div className="pt-8 mb-4 ml-4 lg:ml-32 text-2xl md:text-4xl leading-tight">
                    {buildingsByFacilityType?.facilityType}
                  </div>
                  <div className="hidden lg:block ml-4 lg:ml-32">
                    <Carousel visibleSlides={3} sliderClass="w-full ml-0" isUseOriginClass={false} arrowClass=" w-10 h-10 rounded-full shadow-md flex items-center justify-center border border-slate-400">
                      {buildingsByFacilityType.buildings &&
                        buildingsByFacilityType.buildings.map(
                          (building: any) => (
                              <div
                                className="flex ml-0 flex-shrink-0 relative h-full"
                                key={building.buildingID + buildingsByFacilityType.facilityType}
                              >
                                <FacilityBuildingCard
                                  key={building.buildingID+ buildingsByFacilityType.facilityType}
                                  title={building.buildingName}
                                  imagePath={building.imagePath}
                                  locationAddress={building.buildingAddress}
                                  facilityType={building.facilityType}
                                  href="/facility/search/"
                                ></FacilityBuildingCard>
                              </div>
                          )
                        )}
                    </Carousel>
                  </div>
                  <div className="block lg:hidden ml-4 lg:ml-32">
                    <Carousel visibleSlides={2} sliderClass="w-full ml-0" isUseOriginClass={false} arrowClass=" w-10 h-10 rounded-full shadow-md flex items-center justify-center border border-slate-400">
                      {buildingsByFacilityType.buildings &&
                        buildingsByFacilityType.buildings.map(
                          (building: any) => (
                              <div
                                className="flex ml-0 flex-shrink-0 relative h-full"
                                key={building.buildingID + buildingsByFacilityType.facilityType}
                              >
                                <FacilityBuildingCard
                                  key={building.buildingID+ buildingsByFacilityType.facilityType}
                                  title={building.buildingName}
                                  imagePath={building.imagePath}
                                  locationAddress={building.buildingAddress}
                                  facilityType={building.facilityType}
                                  href="/facility/search/"
                                ></FacilityBuildingCard>
                              </div>
                          )
                        )}
                    </Carousel>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {/* <Carousel></Carousel> */}

      {/* <BuildingCard></BuildingCard> */}
      {/* <FacilityCard></FacilityCard> */}
    </div>
  );
}
