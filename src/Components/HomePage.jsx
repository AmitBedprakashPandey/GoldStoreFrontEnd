import { useEffect, useState } from "react";
import imgs from "../asstes/jewellery-background-4608-x-2592-0kq8mwdpc8xkyqna.webp";
import { Modal } from "antd";
import Navbar from "../Components/NavBar";
import { Outlet } from "react-router-dom";
function HomePage(params) {
  const [model1Open, setModel1open] = useState(true);

  // useEffect(() => {
  //   document.body.style.overflowX = "hidden";
  //   return () => (document.body.style.overflowX = "scroll");
  // }, []);

  return (
    <div className="relative bg-slate-200 w-full h-screen">
      <Navbar />

      <div className="w-full h-full">
        <Outlet />

      </div>
      
    </div>
  );
}
export default HomePage;
