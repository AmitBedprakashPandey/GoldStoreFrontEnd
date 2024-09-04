import { useEffect, useState } from "react";
import imgs from "../asstes/jewellery-background-4608-x-2592-0kq8mwdpc8xkyqna.webp";
import { Modal } from "antd";
import Navbar from "../Components/NavBar";
import { Outlet } from "react-router-dom";
function HomePage(params) {
  const [model1Open, setModel1open] = useState(true);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => (document.body.style.overflowX = "scroll");
  }, []);

  return (
    <>
    <Navbar />
    
    <div className=" bg-white w-screen h-screen">
      <div className="mt-14" />
<Outlet/>
    </div>
      </>
  );
}
export default HomePage;
