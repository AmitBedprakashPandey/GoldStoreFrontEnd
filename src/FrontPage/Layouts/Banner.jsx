import Necklece from "../Assets/images/necklace.png";
import Banner1 from "../Assets/images/banner1.jpg";
import { PiArrowCircleLeft, PiArrowCircleRight } from "react-icons/pi";
import { Carousel } from "primereact/carousel";
import { useState } from "react";
export default function Banner({banner = []}) {
  const data = [
    { text: "", image: Banner1 },
    { text: "", image: Banner1 },
    { text: "", image: Banner1 },
    { text: "", image: Banner1 },
  ];

  const responsiveOptions = [
    {
      breakpoint: "640px",
      numVisible: 1,
      numScroll: 1,
    },
  ];


  const carouselTemplate = (newData) => {
    return (
      <div className="w-full flex justify-center ">
        <img src={newData} className="w-12/12"></img>
      </div>
    );
  };

  return (
      <div className="w-full relative">
        <Carousel
          value={banner}
          numVisible={1}
          autoplayInterval={3000}
          circular
          showIndicators={true}
          showNavigators={true}
          itemTemplate={carouselTemplate}
          // responsiveOptions={responsiveOptions}?
        />
        <div className="hidden md:block">
                  <div className="absolute inset-0 flex justify-between items-center px-5">
          <button
            className="p-2 bg-white text-black rounded-full mx-2 hover:bg-gray-300 duration-300"
            onClick={() => document.querySelector(".p-carousel-prev").click()}
          >
            <PiArrowCircleLeft size={40} />
          </button>
          <button
            className="p-2 bg-white text-black rounded-full mx-2 hover:bg-gray-300 duration-300"
            onClick={() => document.querySelector(".p-carousel-next").click()}
          >
            <PiArrowCircleRight size={40} />
          </button>
        </div>
        </div>

      </div>
  );
}
