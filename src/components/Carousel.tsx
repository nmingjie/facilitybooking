"use client";

import React, { useState, useEffect } from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import { store } from "@/redux/index";
import "pure-react-carousel/dist/react-carousel.es.css";

type ArrowClassParam = {
  largeNext: string;
  largePre: string;
  mediumNext: string;
  mediumPre: string;
  smallNext: string;
  smallPre: string;
};

type CarouselParam = {
  readonly children?: React.ReactNode;
  readonly visibleSlides?: number;
  readonly sliderClass?: string;
  readonly isUseOriginClass?: Boolean;
  readonly arrowClass?: string;
  readonly afterClickArrow?: Function;
  readonly preArrowClass?: string;
  readonly nextArrowClass?: string;
  readonly shouldHideButton?: boolean;
  readonly arrowColor?: string;
  readonly arrowOriginPosition?: boolean;
};

const Carousel: React.FC<CarouselParam> = ({
  children,
  visibleSlides = 1,
  sliderClass,
  isUseOriginClass = true,
  arrowClass,
  afterClickArrow,
  preArrowClass,
  nextArrowClass,
  shouldHideButton = true,
  arrowColor = "blue",
  arrowOriginPosition = true,
}) => {
  const maxCount = React.Children.count(children);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [hidedenAfter, setHidedenAfter] = useState(
    shouldHideButton
      ? maxCount === 1
        ? true
        : maxCount < visibleSlides
        ? true
        : false
      : false
  );
  const [hiddenPre, sethiddenPre] = useState(shouldHideButton);
  const [step, setStep] = useState(1);
  const [conbineArrowClass, setConbineArrowClass] = useState<ArrowClassParam>({
    largeNext: "",
    largePre: "",
    mediumNext: "",
    mediumPre: "",
    smallNext: "",
    smallPre: "",
  });

  const originArrowClass: ArrowClassParam = {
    largeNext: `absolute z-30 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
      arrowOriginPosition ? "right-1" : ""
    }`,
    largePre: `rounded-full shadow-lg absolute z-30  focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer ${
      arrowOriginPosition ? "left-1" : ""
    }`,
    mediumNext: `absolute z-30 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
      arrowOriginPosition ? "mr-8 right-0" : ""
    }`,
    mediumPre: `rounded-full shadow-lg absolute z-30  focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer ${
      arrowOriginPosition ? "ml-8 left-0" : ""
    }`,
    smallNext: `absolute z-30  focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
      arrowOriginPosition ? "mr-8 right-0" : ""
    }`,
    smallPre: `rounded-full shadow-lg absolute z-30  focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer ${
      arrowOriginPosition ? "ml-8 left-0" : ""
    }`,
  };

  const combinArrowClass = () => {
    let tempconbineArrowClass: ArrowClassParam = { ...originArrowClass };

    const arrowClassNames = Object.keys(originArrowClass);
    arrowClassNames.forEach((name: string) => {
      if (arrowClass) {
        tempconbineArrowClass[
          name as keyof typeof tempconbineArrowClass
        ] = `${arrowClass} ${
          originArrowClass[name as keyof typeof originArrowClass]
        }`;
      } else
        tempconbineArrowClass[name as keyof typeof tempconbineArrowClass] =
          originArrowClass[name as keyof typeof originArrowClass];

      if (name.indexOf("Next") !== -1 && nextArrowClass)
        tempconbineArrowClass[name as keyof typeof tempconbineArrowClass] = `${
          tempconbineArrowClass[name as keyof typeof tempconbineArrowClass]
        } ${nextArrowClass}`;
      if (name.indexOf("Pre") !== -1 && preArrowClass)
        tempconbineArrowClass[name as keyof typeof tempconbineArrowClass] = `${
          tempconbineArrowClass[name as keyof typeof tempconbineArrowClass]
        } ${preArrowClass}`;
    });

    setConbineArrowClass(tempconbineArrowClass);
  };

  useEffect(() => {
    if (arrowClass || nextArrowClass || preArrowClass) combinArrowClass();
  }, [arrowClass, nextArrowClass, preArrowClass]);

  // isUseOriginClass [facility/home is false]
  const defaultSliderClass =
    " h-full flex items-center justify-start transition ease-out duration-700 items-stretch ";
  const originSliderClass = " lg:gap-8 md:gap-6 gap-14 ";
  const originSmallSliderClass = " lg:gap-8 md:gap-6 gap-24 ";

  const handlePreClick = () => {
    if (sliderIndex === 0) return;
    if (shouldHideButton) {
      sethiddenPre(sliderIndex - step <= 0);
      setHidedenAfter(false);
      setSliderIndex(sliderIndex - step < 0 ? 0 : sliderIndex - step);
    }

    if (afterClickArrow) afterClickArrow(sliderIndex - step);
  };

  const handleAfterClick = () => {
    if (sliderIndex === maxCount) return;
    if (shouldHideButton) {
      sethiddenPre(false);
      setHidedenAfter(sliderIndex + step >= maxCount - 1);
      setSliderIndex(
        sliderIndex + step > maxCount ? maxCount : sliderIndex + step
      );
    }

    if (afterClickArrow) afterClickArrow(sliderIndex + step);
  };

  const setCurrentStep = () => {
    const width = store.getState().global.currentSize;
    setStep(width <= 1200 ? 1 : visibleSlides || 1);
  };

  useEffect(() => {
    setCurrentStep();
  }, []);

  store.subscribe(() => {
    setCurrentStep();
  });

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        {/* Carousel for desktop and large size devices */}
        <CarouselProvider
          className="lg:block hidden w-full"
          naturalSlideWidth={200}
          // naturalSlideHeight={125}
          isIntrinsicHeight={true}
          totalSlides={maxCount}
          visibleSlides={step || Math.min(3, maxCount)}
          step={step || 1}
          dragEnabled={false}
          touchEnabled={false}
          // infinite={true}
        >
          <div className="w-full relative flex items-center justify-center">
            <ButtonBack
              role="button"
              aria-label="slide backward"
              className={
                hiddenPre
                  ? `${conbineArrowClass.largePre} hidden`
                  : conbineArrowClass.largePre
              }
              id="prev"
              onClick={handlePreClick}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7L7 13"
                  stroke={arrowColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonBack>

            <div className="w-full h-full overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className={`${
                    defaultSliderClass +
                    " " +
                    (isUseOriginClass ? originSliderClass : "") +
                    " " +
                    (sliderClass || "")
                  }`}
                >
                  {React.Children.map(children, (child, index) => (
                    <Slide index={index}>{child}</Slide>
                  ))}
                </div>
              </Slider>
            </div>
            <ButtonNext
              role="button"
              aria-label="slide forward"
              className={
                hidedenAfter
                  ? `${conbineArrowClass.largeNext} hidden`
                  : conbineArrowClass.largeNext
              }
              id="next"
              onClick={handleAfterClick}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L1 13"
                  stroke={arrowColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>

        {/* Carousel for tablet and medium size devices */}
        <CarouselProvider
          className="lg:hidden md:block hidden w-full"
          naturalSlideWidth={100}
          isIntrinsicHeight={true}
          totalSlides={maxCount}
          visibleSlides={step || Math.min(3, maxCount)}
          step={step || 1}
          dragEnabled={false}
          touchEnabled={false}
          // infinite={true}
        >
          <div className="w-full relative flex items-center justify-center">
            <ButtonBack
              role="button"
              aria-label="slide backward"
              className={
                hiddenPre
                  ? `${conbineArrowClass.mediumPre} hidden`
                  : conbineArrowClass.mediumPre
              }
              id="prev"
              onClick={handlePreClick}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7L7 13"
                  stroke={arrowColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonBack>
            <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className={`${
                    defaultSliderClass +
                    " " +
                    (isUseOriginClass ? originSliderClass : "") +
                    " " +
                    (sliderClass || "")
                  }`}
                >
                  {React.Children.map(children, (child, index) => (
                    <Slide index={index}>{child}</Slide>
                  ))}
                </div>
              </Slider>
            </div>
            <ButtonNext
              role="button"
              aria-label="slide forward"
              className={
                hidedenAfter
                  ? `${conbineArrowClass.mediumNext} hidden`
                  : conbineArrowClass.mediumNext
              }
              id="next"
              onClick={handleAfterClick}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L1 13"
                  stroke={arrowColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>

        {/* Carousel for mobile and Small size Devices */}
        <CarouselProvider
          className="block md:hidden w-full"
          naturalSlideWidth={100}
          naturalSlideHeight={100}
          isIntrinsicHeight={true}
          totalSlides={maxCount}
          visibleSlides={Math.min(1, maxCount)}
          step={1}
          dragEnabled={false}
          touchEnabled={false}
          // infinite={true}
        >
          <div className="w-full relative flex items-center justify-center">
            <ButtonBack
              role="button"
              aria-label="slide backward"
              className={
                hiddenPre
                  ? `${conbineArrowClass.smallPre} hidden`
                  : conbineArrowClass.smallPre
              }
              id="prev"
              onClick={handlePreClick}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7L7 13"
                  stroke={arrowColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonBack>
            <div className="w-full h-full overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className={`${
                    defaultSliderClass +
                    " " +
                    (isUseOriginClass ? originSmallSliderClass : "") +
                    " " +
                    (sliderClass || "")
                  }`}
                >
                  {React.Children.map(children, (child, index) => (
                    <Slide index={index}>{child}</Slide>
                  ))}
                </div>
              </Slider>
            </div>
            <ButtonNext
              role="button"
              aria-label="slide forward"
              className={
                hidedenAfter
                  ? `${conbineArrowClass.smallNext} hidden`
                  : conbineArrowClass.smallNext
              }
              id="next"
              onClick={handleAfterClick}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L1 13"
                  stroke={arrowColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>
      </div>
    </div>
  );
};

export default Carousel;
