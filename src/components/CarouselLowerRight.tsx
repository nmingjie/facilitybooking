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
};

type CarouselParam = {
  readonly children?: React.ReactNode;
  readonly visibleSlides?: number;
  readonly sliderClass?: string;
  readonly arrowClass?: string;
  readonly afterClickArrow?: Function;
};

const CarouselLowerRight: React.FC<CarouselParam> = ({
  children,
  visibleSlides,
  sliderClass,
  arrowClass,
  afterClickArrow,
}) => {
  const maxCount = React.Children.count(children);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [hidedenAfter, setHidedenAfter] = useState(
    maxCount === 1 ? true : false
  );
  const [hiddenPre, sethiddenPre] = useState(true);
  const [step, setStep] = useState(1);

  const originArrowClass: ArrowClassParam = {
    largeNext:
      "p-4 z-30 cursor-pointer",
    largePre:
      "p-4 z-30 right-5 cursor-pointer"
  };

  let conbineArrowClass: ArrowClassParam = { ...originArrowClass };

  if (arrowClass) {
    const arrowClassNames = Object.keys(originArrowClass);
    arrowClassNames.forEach((name: string) => {
      conbineArrowClass[
        name as keyof typeof conbineArrowClass
      ] = `${arrowClass} ${
        originArrowClass[name as keyof typeof originArrowClass]
      }`;
    });
  }

  const defaultSliderClass = "";

  const handlePreClick = () => {
    if (sliderIndex === 0) return;
    sethiddenPre(sliderIndex - step <= 0);
    setHidedenAfter(false);
    setSliderIndex(sliderIndex - step < 0 ? 0 : sliderIndex - step);
    if (afterClickArrow) afterClickArrow(sliderIndex - step);
  };

  const handleAfterClick = () => {
    if (sliderIndex === maxCount) return;

    sethiddenPre(false);
    setHidedenAfter(sliderIndex + step >= maxCount - 1);
    setSliderIndex(
      sliderIndex + step > maxCount ? maxCount : sliderIndex + step
    );
    if (afterClickArrow) afterClickArrow(sliderIndex + step);
  };


  const setCurrentStep = ()=>{
    const width = store.getState().global.currentSize
    setStep(width <= 1200 ? 1 : visibleSlides || 1);
  }

  useEffect(() => {
    setCurrentStep()
  }, []);
 

  store.subscribe(()=>{
    setCurrentStep()
  })

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <CarouselProvider
          className="lg:block w-full"
          naturalSlideWidth={200}
          isIntrinsicHeight={true}
          totalSlides={maxCount}
          visibleSlides={step || Math.min(3, maxCount)}
          step={step || 1}
          dragEnabled={false}
          touchEnabled={false}
        >
          <div className="w-full flex flex-col items-center"> 
            <div className="w-full h-full overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className={`${
                    defaultSliderClass +
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
            <div className="w-full flex justify-end">
                <div className="flex justify-center bg-slate-500 rounded-br-lg">
                    <ButtonBack
                        role="button"
                        aria-label="slide backward"
                        className={
                            conbineArrowClass.largePre
                        }
                        disabled={hiddenPre?true:false}
                        id="prev"
                        onClick={handlePreClick}
                        >
                        <svg
                            width={28}
                            height={28}
                            viewBox="0 0 8 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7 1L1 7L7 13"
                                stroke="white"
                                strokeWidth={1}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </ButtonBack>
                    <ButtonNext
                        role="button"
                        aria-label="slide forward"
                        className={
                            conbineArrowClass.largeNext
                        }
                        disabled={hidedenAfter?true:false}
                        id="next"
                        onClick={handleAfterClick}
                        >
                        <svg
                            width={28}
                            height={28}
                            viewBox="0 0 8 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 1L7 7L1 13"
                                stroke="white"
                                strokeWidth={1}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                />
                        </svg>
                    </ButtonNext>
                </div>
            </div>
          </div>
        </CarouselProvider>
      </div>
    </div>
  );
};

export default CarouselLowerRight;
