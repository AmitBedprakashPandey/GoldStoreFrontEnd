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

export default function FrontPage(params) {
  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    dispatch(getCompany()).then((doc) => {
      setData(doc.payload);
      setLoading(false);
    });
  }, [dispatch]);

  return (
    <>
      {/* {loading && <ProgressSpinner/>} */}
      <div
        className="bg-red-950 h-screen eczar-font relative w-screen bg-cover bg-center overflow-x-hidden"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Navbar data={data} />
        <Banner />
        <LivePriceCard />
        <Catagory />
        <GalleryCard />
        <InfoCard data={data} />

        <Footer data={data} />
      </div>
    </>
  );
}
