"use client";

import Image from "next/image";
import Carousel from "../Carousel";
import { useState, useEffect, useRef } from "react";
import { store } from "@/redux/index";

interface ListingHeadProps {
  title: string;
  subtitle?: string;
  images: string[];
}

type WidthParam = {
  width?: number;
  height?: number;
};

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  subtitle,
  images,
}) => {
  const [imageSize, setImageSize] = useState<WidthParam>({});
  const [width, setWidth] = useState(0);

  store.subscribe(() => {
    setWidth(store.getState().global.currentSize);
  });

  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setImageSize({
      width: imageRef.current?.offsetWidth || 0,
      height: imageRef.current?.offsetHeight || 0,
    });
    setWidth(store.getState().global.currentSize);
  }, [imageRef.current?.offsetWidth]);

  return (
    <>
      <div
        className="
          w-full
          rounded-xl
        "
      >
        <div className="flex flex-col md:flex-row h-80">
          <div
            className={
              width > 640
                ? "relative flex-1 w-1/2 h-full"
                : "relative flex-1 w-full h-1/2"
            }
            ref={imageRef}
          >
            <Carousel
              shouldHideButton={false}
              isUseOriginClass={false}
              sliderClass="w-full h-full overflow-hidden"
              arrowClass={
                "w-9 h-9 bg-gray-600 opacity-75 rounded-none flex justify-center items-center"
              }
              nextArrowClass={
                width > 640 ? "bottom-0 left-[36px]" : "bottom-0 right-0"
              }
              preArrowClass={
                width > 640 ? "bottom-0 left-0" : "bottom-0 right-[36px]"
              }
              arrowColor={"white"}
              arrowOriginPosition={false}
            >
              {imageSize.width &&
                imageSize.height &&
                images.map((imageSrc) => {
                  return (
                    <div key = {imageSrc} style={imageSize} className="object-cover">
                      <Image
                        src={imageSrc}
                        style={{width:'100%',height:imageSize.height}}
                        width={imageSize.width}
                        height={imageSize.height}
                        className="object-cover"
                        alt="Image"
                      />
                    </div>
                  );
                })}
            </Carousel>
          </div>

          <div className="w-full bg-gray-200 flex-1 flex flex-col justify-center items-center">
            <div className="w-full flex justify-center">
              <div className="flex justify-start flex-wrap flex-col p-4">
                <div>{title}</div>
                <div className="font-light text-sm text-neutral-500 mt-2">
                  {subtitle}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingHead;
