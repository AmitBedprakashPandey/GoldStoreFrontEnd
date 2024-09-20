import { PiGearDuotone } from "react-icons/pi";

import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Settings(params) {
  const Menu = [
    {
      url: "websitesetting",
      icon: <PiGearDuotone size={25} />,
      lable: "Website Settngs",
    },
  ];

  return (
      <div className="relative flex w-full gap-3">
        <div className="w-72 h-[94.5vh]  bg-white shadow-lg shadow-slate-600 z-30">
            {Menu.map((item,index)=>(

                <Link
                to={item.url}
                className="py-4 px-3 flex items-center gap-3 hover:bg-yellow-100"
                >
            {item.icon}
            <p className="text-sm">{item.lable}</p>
          </Link>
        ))}
        </div>
        <div className=" w-full h-[94.5vh] bg-white border-2 shadow-lg shadow-slate-600">
          <Outlet />
        </div>
      </div>
  );
}
