import { PiArrowCircleLeft, PiArrowCircleRight } from "react-icons/pi";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
export default function Banner({ banner = [] }) {
  const carouselTemplate = (newData) => {
    return (
      <div className=" w-ful">
        <img src={newData} className="w-12/12"></img>
      </div>
    );
  };

  const customPrevButton = (options) => {
    return (
      <Button
        type="button"
        icon={<PiArrowCircleLeft size={40} />}
        className="z-[1080] bg-white w-28 h-28  p-button-rounded p-button-text p-button-secondary carousel-next-button"
        onClick={options.onClick}
      />
    );
  };

  const customNextButton = (options) => {
    return (
      <Button
        type="button"
        icon={<PiArrowCircleRight size={40} />}
        className="z-[1080] bg-white w-28 h-28  p-button-rounded p-button-text p-button-secondary carousel-next-button"
        onClick={options.onClick}
      />
    );
  };

  const responsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 1,

        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
        // showNavigators:false ,
    }
];

  return (
    <div className="relative">
      <Carousel
        value={banner}
        numVisible={1}
        autoplayInterval={3000}
        circular
        itemTemplate={carouselTemplate}
        showIndicators={true}
        showNavigators={true}
        responsiveOptions={responsiveOptions}
        nextIcon={customNextButton}
        prevIcon={customPrevButton}
      />
    </div>
  );
}
