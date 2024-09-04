import "./Layouts/style.css";
import BackgroundImage from "./Assets/images/background.jpg";
import Banner from "./Layouts/Banner";
import Catagory from "./Layouts/Catagory";
import Footer from "./Layouts/Footer";
import GalleryCard from "./Layouts/GalleryCard";
import InfoCard from "./Layouts/InfoCard";
import LivePriceCard from "./Layouts/LivePriceCard";
import Navbar from "./Layouts/NavBar";

export default function FrontPage(params) {
  return (
    <div className="bg-red-950 h-screen eczar-font relative w-full bg-cover bg-center"
    style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <Navbar />
      <Banner />
      <LivePriceCard />
      {/* <Catagory /> */}
      <GalleryCard />
      {/* <InfoCard /> */}

      <Footer /> 
    </div>
  );
}
