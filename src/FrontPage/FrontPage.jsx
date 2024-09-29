import "./Layouts/style.css";
import BackgroundImage from "./Assets/images/background.jpg";
import Banner from "./Layouts/Banner";
import Catagory from "./Layouts/Catagory";
import Footer from "./Layouts/Footer";
import GalleryCard from "./Layouts/GalleryCard";
import InfoCard from "./Layouts/InfoCard";
import LivePriceCard from "./Layouts/LivePriceCard";
import Navbar from "./Layouts/NavBar";
import ProgressSpinner from "./Layouts/Loading";
import { getCompany } from "../Store/Slice/LivePriceSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import FloatIcons from "./Layouts/FloatIcons";
import { PiArrowCircleUpFill, PiWhatsappLogoDuotone } from "react-icons/pi";
import { Tag } from "primereact/tag";

export default function FrontPage(params) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getCompany())
      .then((doc) => {
        setData(doc.payload);
        setLoading(false);
      })
      .catch((error) => {
        if (error) {
          setLoading(true);
        }
      });
  }, [dispatch]);

  const handleScroll = () => {
    // Get the height of the viewport
    const halfScreenHeight = window.innerHeight / 2;

    // Show the button when scrolled more than half of the screen height
    if (window.scrollY > halfScreenHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Smooth scroll
    });
  };

  const openWhatsApp = (phoneNumber) => {
    // Format the URL for WhatsApp
    const url = `https://wa.me/${phoneNumber}`;

    // Open the URL
    window.location.href = url;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {loading && <ProgressSpinner />}

      <div
        className="bg-red-950 w-full eczar-font relative px-3 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Navbar data={data} />
        <Banner banner={data?.banner} />
        <LivePriceCard />
        <Catagory />
        <GalleryCard />
        <InfoCard data={data} />


       <div className="sticky bottom-0 px-5 z-50">
        <div className="absolute bottom-0 right-0 flex flex-col items-center gap-5">
        <button
          onClick={() => openWhatsApp(data?.whatsapp)}
          className="relative rounded-full h-14 w-14"
        >
          <Tag
            icon={<PiWhatsappLogoDuotone />}
            className="absolute right-0 -top-2 h-6 w-6 rounded-full"
          />
          <img
            src={data?.ownerimg}
            className="rounded-full overflow-hidden h-14 w-14"
          />
        </button>
      {isVisible&& 
        
        <button
        onClick={scrollToTop}
        className=" text-white"
        >
       <PiArrowCircleUpFill size={40} />
        </button>
      }
        </div>
      </div>
        <Footer data={data} /> 
        {/* 
        */}
      </div>
    </>
  );
}
