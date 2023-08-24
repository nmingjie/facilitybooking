"use client";

import dynamic from "next/dynamic";

import FacilityCard from "@/components/FacilityCard";
import FacilityCardMap from "@/components/FacilityCardMap";

import FacilitiesFilter from "@/components/FacilitiesFilter";

import { DataCardPagination } from "./data-card-pagination";

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import Image from "next/image";
import { Metadata } from "next";

import { promises as fs } from "fs";
import path from "path";

import request from "@/api/request";


const metadata: Metadata = {
  title: "Facility | JTC",
  description: "Facility | JTC",
};

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface HomeProps {
  searchParams: FilterObject;
}

import { facilityData } from "./facilities.js";
import EmptyState from "@/components/EmptyState";
import { Separator } from "@/components/ui/separator";
import Carousel from "@/components/Carousel";
import { Skeleton } from "@/components/ui/skeleton";

type Facilities = {
  buildingName:string;
  facilityType:string;
  facilityName:string;
  buildingID:string;

}
type FilterObject = {
  bookingDate?:Date;
  buildingName?:string;
  capacity?:string;
  endTime?:string;
  facilityType?:string;
  startTime?:string;
}
export default function Page({ searchParams }: HomeProps) {
  const [listings, setListings] = useState([]);
  const [listingsGroupByBuilding, setlistingsGroupByBuilding] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState("list");
  const [sortOrder, setSortOrder] = useState("ASC");

  const searchQuery = useSearchParams();

  const currentUser = { userId: "tenant" };
  const userId = "tenant";

  useEffect(() => {
    let params:any = {
      facilityType: searchQuery?.get('facilityType')? searchQuery?.get('facilityType') : null,
      buildingName: searchQuery?.get('buildingName')? searchQuery?.get('buildingName') : null,
      capacity: searchQuery?.get('capacity')?searchQuery?.get('capacity') : null,
      bookingTimeFrom: searchQuery?.get('startTime')?searchQuery?.get('startTime') : null,
      bookingTimeTo: searchQuery?.get('endTime')?searchQuery?.get('endTime') : null,
      bookingDate: searchQuery?.get('bookingDate')?searchQuery?.get('bookingDate') : null,
    }
    request.post("/api/fb/Search",params).then((res) => {
      let facilities = res.data;
      if (sortOrder === "ASC") {
        facilities.sort(
          (a:Facilities, b:Facilities) =>
            a.buildingName.localeCompare(b.buildingName) ||
            a.facilityType.localeCompare(b.facilityType) ||
            a.facilityName.localeCompare(b.facilityName)
        );
      } else {
        facilities.sort(
          (a:Facilities, b:Facilities) =>
            b.buildingName.localeCompare(a.buildingName) ||
            b.facilityType.localeCompare(a.facilityType) ||
            b.facilityName.localeCompare(a.facilityName)
        );
      }
      setListings(facilities);
      const objectGroupByBuilding = facilities.reduce(function (r:any, a:Facilities) {
        if (r[a.buildingID]) {
          r[a.buildingID][a.facilityType] =
            r[a.buildingID][a.facilityType] || [];
        } else {
          r[a.buildingID] = {};
          r[a.buildingID][a.facilityType] =
            r[a.buildingID][a.facilityType] || [];
        }
        r[a.buildingID][a.facilityType].push(a);
        return r;
      }, Object.create(null));
      setlistingsGroupByBuilding(objectGroupByBuilding);
      setIsLoading(false);
    }).catch((e) => {
      throw new Error(e);
    })
  }, [searchQuery, sortOrder]);

  function handleClickSort(sortOrder: string) {
    setSortOrder(sortOrder);
  }

  function handleClick(mode: string) {
    setViewMode(mode);
  }

  return (
    <>
      <div className="container flex flex-col gap-4">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        <FacilitiesFilter
          // handleViewModeClick={"true"}
          handleViewModeClick={handleClick}
          mode={viewMode}
          handleClickSort={handleClickSort}
          sortOrder={sortOrder}
        ></FacilitiesFilter>

        {viewMode === "map" && (
          <Map
            center={
              Object.keys(listingsGroupByBuilding).length !== 0
                ? [
                    Object.values(
                      Object.values(listingsGroupByBuilding)[0]
                    )[0][0].lat,
                    Object.values(
                      Object.values(listingsGroupByBuilding)[0]
                    )[0][0].lng,
                  ]
                : null
            }
            listingsGroupByBuilding={listingsGroupByBuilding}
          >
            {/* To do: Putting Child in here will cause window not defined error */}
          </Map>
        )}
      </div>
      {viewMode === "list" && (
        <div className="bg-gray-200/70 flex flex-col">
          <div className="container">
            {/* {isLoading && (
              <Skeleton className="bg-gray-400 h-96">
              <span> hello</span>
            </Skeleton>
            )} */}
            {!isLoading && listings.length === 0 && (
              <EmptyState
                showReset={true}
                resetUrl="/facility/search/"
              ></EmptyState>
            )}
            {
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 my-4 justify-items-center">
                {isLoading &&
                  Array.from({ length: 12 }, (_, i) => i + 1).map((id) => (
                    <div
                      key={id}
                      className="flex flex-col gap-2 bg-white col-span-1 w-full p-4"
                    >
                      {/* Image */}
                      <Skeleton className="rounded-md bg-gray-300 h-44 w-full"></Skeleton>
                      {/* Title */}
                      <Skeleton className="bg-gray-300 h-12 w-3/4"></Skeleton>
                      {/* Content */}
                      <Skeleton className="bg-gray-300 h-44 w-3/2"></Skeleton>
                    </div>
                  ))}

                {listings.length !== 0 &&
                  listings.map((facility: any,index:number) => (
                    <div key={facility.facilityID + index}>
                      <FacilityCard
                        data={facility}
                        isLoading={isLoading}
                      ></FacilityCard>
                    </div>
                  ))}
              </div>
            }
          </div>
          {/* <DataCardPagination  /> */}
          {!isLoading && listings.length !== 0 && (
            <p className="mb-2 text-xl md:text-2xl leading-tight font-medium self-center pb-4">
              Showing 1 - {listings.length} of {listings.length} properties
            </p>
          )}
        </div>
      )}
    </>
  );
}
