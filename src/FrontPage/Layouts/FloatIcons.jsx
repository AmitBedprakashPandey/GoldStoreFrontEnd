import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { PiArrowCircleUpFill, PiWhatsappLogoDuotone } from "react-icons/pi";

export default function FloatIcons({scrollButton, OwnerImg, facebook, whatsapp, youtube }) {
    const [isVisible, setIsVisible] = useState(false);
    const openWhatsApp = (phoneNumber) => {
    // Format the URL for WhatsApp
    const url = `https://wa.me/${phoneNumber}`;

    // Open the URL
    window.location.href = url;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll
    });
  };
  return (
      <div className="flex justify-end sticky bottom-3 px-5 ">
        <div className="flex flex-col items-center gap-5">
        <button
          onClick={() => openWhatsApp(whatsapp)}
          className="relative rounded-full h-14 w-14"
        >
          <Tag
            icon={<PiWhatsappLogoDuotone />}
            className="absolute right-0 -top-2 rounded-full"
          />
          <img
            src={OwnerImg}
            className="rounded-full overflow-hidden h-14 w-14"
          />
        </button>
        
        {/* {scrollButton && 
        
        } */}
        {/* <button
        onClick={scrollToTop}
        className=" text-white"
        >
       <PiArrowCircleUpFill size={40} />
        </button> */}
        </div>
      </div>
      );
}
