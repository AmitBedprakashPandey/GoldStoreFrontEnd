import "./Layouts/style.css";
import BackgroundImage from "./Assets/images/background.jpg";
import Catagory from "./Layouts/Catagory";
import Footer from "./Layouts/Footer";
import GalleryCard from "./Layouts/GalleryCard";
import InfoCard from "./Layouts/InfoCard";
import LivePriceCard from "./Layouts/LivePriceCard";
import Navbar from "./Layouts/NavBar";
import { getCompany, getLivePrice } from "../Store/Slice/LivePriceSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PiArrowCircleUpFill, PiWhatsappLogoDuotone } from "react-icons/pi";
import { Tag } from "primereact/tag";
import OwnerImage from "./Assets/images/ownerimage.jpg" 
import Marquee from "react-fast-marquee";
import Banner from "./Layouts/Banner";
export default function FrontPage(params) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [matrial, setMaterial] = useState([]);

  const UserData = {
    name : "Shubh Lakshmi Jewellers",
    ownerimg : OwnerImage,
    ownername:"SHRI VEER BABU SONY",
    phone1:7011457639,
    phone2:7703844783,
    youtube:"https://www.youtube.com/@shubhlakshmijewellers3265",
    instagram:"https://www.instagram.com/shubhlakshmijewellers/?igsh=MTB6cjBqeDVzOHJqbw%3D%3D",
    address:"shop no 34,block-c,baba sudas market,sec-91,faridabad-121003",
    gst:"06FXCPS6555NIZO",
    pan : "FXCPS6555N",
    facebook : null,
  }

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

      dispatch(getLivePrice()).then((doc) => {
        setMaterial(doc.payload?.data?.price);
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
      {/* {loading && <ProgressSpinner />} */}
      <div
        className="bg-red-950 flex flex-col items-center w-full eczar-font relative bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
      <Marquee
        pauseOnHover={true}
        direction="left"
        speed={100}
        className="text-orange-300 capitalize overflow-hidden w-full"
      >
        {matrial?.map((item, index) => (
          <>
            <p key={index} className="mx-5 py-3">
              {item?.material} {item?.weight}
              {item?.prefix} : {"₹ "}
              {item?.price}
              {"/-"}{" "}
            </p>
          </>
        ))}
      </Marquee>
      <div className="w-full  max-w-[90%]">

        <Navbar brandname={UserData?.name} />
        <Banner />
        <LivePriceCard matrial={matrial} />
        <Catagory />
        <GalleryCard />
        <InfoCard data={UserData} />



        <Footer mobile={UserData?.phone1} brandname={UserData?.name}/> 
     
      </div>
      </div>
       <div className="sticky bottom-0 px-5 z-50">
        <div className="absolute bottom-5 right-5 flex flex-col items-center gap-5">
        <button
          onClick={() => openWhatsApp(UserData?.phone1)}
          className="relative rounded-full h-14 w-14"
        >
          <Tag
            icon={<PiWhatsappLogoDuotone />}
            className="absolute right-0 -top-2 h-6 w-6 rounded-full"
          />
          <img
            src={UserData?.ownerimg}
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
    </>
  );
}
