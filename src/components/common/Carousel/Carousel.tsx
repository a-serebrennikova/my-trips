"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { NextButton, PrevButton, usePrevNextButtons } from "./ArrowButton";
import Image from "next/image";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

const Carousel = ({ slides, options }: PropType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    ...options,
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);
  const hasScrollableSlides = slides.length > 1;

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <Image
                  width={300}
                  height={300}
                  src={slide}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={!hasScrollableSlides || prevBtnDisabled}
          />
          <NextButton
            onClick={onNextButtonClick}
            disabled={!hasScrollableSlides || nextBtnDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
