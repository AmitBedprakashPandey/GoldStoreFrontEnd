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
    if (window.scrollY > 300) { // Adjust the threshold as needed
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
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
        className="bg-red-950 h-screen eczar-font relative w-screen bg-cover bg-center overflow-x-hidden"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Navbar data={data} />
        <Banner banner={data?.banner} />
        <LivePriceCard />
        <Catagory />
        <GalleryCard />
        <InfoCard data={data} />
        <FloatIcons scrollButton={isVisible} OwnerImg={data?.ownerimg} />
        <Footer data={data} />
      </div>
    </>
  );
}
