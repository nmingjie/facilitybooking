'use client'

import React, { useState } from "react";

import {FaArrowCircleRight} from "react-icons/fa6";
import BuildingCard from "@/components/BuildingCard";


type arrowStyleProps = {
    arrowStyle?: string
}
const Arrow = ({ arrowStyle }: arrowStyleProps) => {
  return (
    <svg
      width="16"
      height="26"
      viewBox="0 0 16 26"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className={`cursor-pointer z-50 ${arrowStyle}`}
    >
      <path
        d="M13.8462 2L2 13L13.8462 24"
        stroke="#6b7280"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
const images = [
  "https://www.tailwindtap.com/assets/components/all-inclusive-carousel/desk-office.jpg",
  "https://www.tailwindtap.com/assets/components/all-inclusive-carousel/architecture-office.jpg",
  "https://www.tailwindtap.com/assets/components/all-inclusive-carousel/office-working-people.jpg",
];


const buildings = [
    {name: "building 1"},
    {name: "building 2"},
    {name: "building SJDKAHS"},
]

const text = ["lorem ipsum", "lorem ipsum dollar", "lorem ipsum dollar amet"];
export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const decreseIndex = () => {
    if (currentIndex <= 0) {
      setCurrentIndex(images.length - 1);
    } else setCurrentIndex(currentIndex - 1);
  };
  const increseIndex = () => {
    if (currentIndex === images.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <>
      <div className="w-full flex justify-center items-center mb-4">
        <div className="relative">
          <div
            className="absolute inset-y-0 top-1/2 left-3 w-5 flex"
            onClick={decreseIndex}
          >
            <Arrow />
            {/* <FaArrowCircleRight/> */}
          </div>
          <div>
            {/* <BuildingCard title="1"/>
            <BuildingCard title="2"/>
            <BuildingCard /> */}
            {buildings.map((building,index) => {
                if (currentIndex === index) {
                return ( <BuildingCard key={index} title={building.name}> </BuildingCard>);
                } else {
                    return null;
                }
                    
            })}
            {/* {images.map((img, index) => {
              if (currentIndex === index) {
                return (
                  <img
                    key={index}
                    src={img}
                    alt="Multiple images for slide and show"
                    className="object-cover w-full temporary-bounce animate-[pulse_3s_linear_infinite] relative lg:max-h-[700px] sm:max-h-[500px] max-h-[400px]"
                  />
                );
              } else return null;
            })} */}
          </div>
          <div
            className="absolute inset-y-0 right-2 w-5 flex top-1/2"
            onClick={increseIndex}
          >
            <Arrow arrowStyle="rotate-180" />
          </div>
          {/* text portion */}
          {/* <div className="absolute bottom-6 inset-x-0 bg-cyan-900 opacity-50">
            {text.map((textdata, index) => {
              if (currentIndex === index) {
                return (
                  <span
                    key={index}
                    className="text-xl text-white flex justify-center"
                  >
                    {textdata}
                  </span>
                );
              } else return null;
            })}
          </div> */}
          {/* custom dot portion */}
          <div className="absolute bottom-2 inset-x-0 flex flex-row gap-2 justify-center">
            {images.map((a, index) =>
              currentIndex === index ? (
                <div
                  key={index}
                  className="w-2 h-2 bg-gray-400 rounded-[50%] cursor-pointer"
                ></div>
              ) : (
                <div
                  key={index}
                  className="w-2 h-2 bg-gray-600 rounded-[50%] cursor-pointer"
                  onClick={() => setCurrentIndex(index)}
                ></div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
