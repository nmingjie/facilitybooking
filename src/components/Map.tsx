"use client";

import { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import Image from "next/image";

import { FaLocationDot } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import Carousel from "@/components/Carousel";
import FacilityCardMap from "@/components/FacilityCardMap";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
//Wait to confirm whether to use divIcon
// const divIcon = L.divIcon({
//   html: `<div class="leaflet-div-icon">
//               <span class="icon-location-marker"></span>
//              </div>`,
//   iconSize: [30, 30],
//   iconAnchor: [15, 30],
// });
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

type imageType = {
  imagePath: string;
  itemId: string;
  itemName: null | string;
};

type childListingInfoType = {
  amenties: unknown[];
  buildingAddress: string;
  buildingID: string;
  buildingName: string;
  capacity: number;
  facilityID: string;
  facilityName: string;
  facilityType: string;
  hourlyRentWeekday: number;
  hourlyRentWeekend: number;
  images: imageType[];
  lat: number;
  lng: number;
  rentPerDay: number;
};

type listingInfo = {
  [key: string]: childListingInfoType[];
};

interface MapProps {
  center?: number[];
  children?: JSX.Element;
  listingsGroupByBuilding?: { [key: string]: listingInfo };
  markers?: { lat: number; lng: number }[];
  className?: string;
}

// Leaflet Icon
const LeafIcon = L.Icon.extend({
  options: {},
});

const greenIcon = new LeafIcon({
  iconUrl: "/icons/map-pin.svg",
});

const url = "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map: React.FC<MapProps> = ({
  center,
  children,
  listingsGroupByBuilding,
  markers,
  className,
}) => {
  const [buildingData, setBuildingData] = useState<{
    [key: string]: listingInfo;
  }>(listingsGroupByBuilding || {});
  const [popupContent, setPopUpContent] = useState<listingInfo>({});
  const [popupComponentKeys, setPopupComponentKeys] = useState<{
    [key: string]: string;
  }>({});

  const handleLabelChange = (
    buildingId: keyof typeof buildingData,
    labelIndex: number
  ) => {
    const tempPopup = { ...popupContent };
    tempPopup[buildingId] = callBackNeededBuildingInfo(buildingId, labelIndex);
    const tempPopupKeys = { ...popupComponentKeys };
    tempPopupKeys[buildingId] = createRamdomKey();
    setPopUpContent(tempPopup);
    setPopupComponentKeys(tempPopupKeys);
  };

  const callBackNeededBuildingInfo = (
    buildingId: keyof typeof buildingData,
    index: number
  ): childListingInfoType[] => {
    const currentTotalInfo = buildingData[buildingId];
    const currentTotalInfoKeys = Object.keys(currentTotalInfo);
    const defaultShowInfo = currentTotalInfo[currentTotalInfoKeys[index]];
    return defaultShowInfo;
  };

  const createRamdomKey = () =>
    "_" + Math.random().toString(36).substring(2, 9);

  useEffect(() => {
    const popup: listingInfo = {};
    let popupKeys: { [key: string]: string } = {};
    for (const buildingId in buildingData) {
      popup[buildingId] = callBackNeededBuildingInfo(buildingId, 0);
      popupKeys[buildingId] = createRamdomKey();
    }

    setPopUpContent(popup);
    setPopupComponentKeys(popupKeys);
  }, []);

  useEffect(() => {
    if (listingsGroupByBuilding) setBuildingData(listingsGroupByBuilding);
  }, [listingsGroupByBuilding]);

  return (
    <MapContainer
      key={createRamdomKey()}
      center={(center as L.LatLngExpression) || [1.3521, 103.819]}
      zoom={13}
      scrollWheelZoom={false}
      className={className || "h-[80vh] z-0"}
    >
      <TileLayer url={url} attribution={attribution} />
      {children}
      {markers && (
        <>
          {markers.map((item) => {
            return (
              <Marker key={[item.lat, item.lng]} position={[item.lat, item.lng]} icon={greenIcon}></Marker>
            );
          })}
        </>
      )}
      <>
        {typeof buildingData === "object" &&
          Object.keys(buildingData).length !== 0 &&
          Object.keys(buildingData).map((buildingId) => {
            const currentBuildingInfo = buildingData[buildingId];
            const keyofCurrentBuildingInfo = Object.keys(currentBuildingInfo);

            let lat, lng;

            lat =
              currentBuildingInfo[
                keyofCurrentBuildingInfo[0] as keyof typeof currentBuildingInfo
              ][0].lat;
            lng =
              currentBuildingInfo[
                keyofCurrentBuildingInfo[0] as keyof typeof currentBuildingInfo
              ][0].lng;
            return (
              <Marker
                position={[lat, lng] as L.LatLngExpression}
                // icon={divIcon}
                key={buildingId}
                icon={greenIcon}
              >
                <Popup>
                  <div className="flex flex-col gap-4 max-w-[350px] max-h-sm overflow-auto">
                    <div
                      className="
                                      aspect-video 
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
                    <span className="font-semibold">
                      {
                        currentBuildingInfo[keyofCurrentBuildingInfo[0]][0]
                          .buildingName
                      }
                    </span>
                    <div className="flex gap-2">
                      <FaLocationDot />
                      <span className="font-semibold">
                        {
                          currentBuildingInfo[keyofCurrentBuildingInfo[0]][0]
                            .buildingAddress
                        }
                      </span>
                    </div>

                    <Separator></Separator>
                    <span>
                      {/* Facility Type */}
                      <Carousel
                        visibleSlides={1}
                        sliderClass="w-full"
                        afterClickArrow={(index: number) => {
                          handleLabelChange(buildingId, index);
                        }}
                        isUseOriginClass={false}
                      >
                        {Object.keys(currentBuildingInfo).map(
                          (facilityType) => {
                            return (
                              <>
                                <span className="text-blue-500 flex justify-center item-center">
                                  {" "}
                                  {facilityType}{" "}
                                </span>
                              </>
                            );
                          }
                        )}
                      </Carousel>
                    </span>
                    <span>
                      {/* Facility of Choosen Type */}
                      {popupContent[buildingId] && (
                        <div key={popupComponentKeys[buildingId]}>
                          <Carousel
                            visibleSlides={2}
                            arrowClass=" w-10 h-10 rounded-full shadow-md flex items-center justify-center border border-slate-400"
                            sliderClass="w-full"
                            isUseOriginClass={false}
                          >
                            {popupContent[buildingId].map((facility) => {
                              return (
                                <FacilityCardMap
                                  key={facility.facilityID}
                                  data={facility}
                                  cardOutsideClass={"px-3 h-full"}
                                >
                                  {" "}
                                </FacilityCardMap>
                              );
                            })}
                          </Carousel>
                        </div>
                      )}
                    </span>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </>
    </MapContainer>
  );
};

export default Map;
