import "./Layouts/style.css";
import BackgroundImage from "./Assets/images/background.jpg";
import Banner from "./Layouts/Banner";
import Catagory from "./Layouts/Catagory";
import Footer from "./Layouts/Footer";
import GalleryCard from "./Layouts/GalleryCard";
import InfoCard from "./Layouts/InfoCard";
import LivePriceCard from "./Layouts/LivePriceCard";
import Navbar from "./Layouts/NavBar";

import { getCompany } from "../Store/Slice/LivePriceSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function FrontPage(params) {
  
  const dispatch = useDispatch()

  const [data,setData]=useState()

  useEffect(()=>{
      dispatch(getCompany()).then((doc) =>setData(doc.payload))
  },[dispatch])
  
  
  return (
    <div className="bg-red-950 h-screen eczar-font relative w-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <Navbar data={data}/>
      <Banner />
      <LivePriceCard />
      {/* <Catagory /> */}
      {/* <GalleryCard /> */}
      {/* <InfoCard /> */}

      <Footer data={data} /> 
    </div>
  );
}
