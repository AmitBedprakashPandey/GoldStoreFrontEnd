import { useDispatch, useSelector } from "react-redux";
import BrandLogo from "../Assets/images/BrandLogo.png";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import { getLivePrice } from "../../Store/Slice/LivePriceSlice";

export default function Navbar({ data }) {
  const dispatch = useDispatch();
  const [matrial, setMaterial] = useState([]);

  useEffect(() => {
    dispatch(getLivePrice()).then((doc) => {
      setMaterial(doc.payload?.data?.price);
    });
  }, [matrial]);

  return (
    <>
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
      <div className="relative w-full flex justify-center items-center gap-3 eczar-font p-3 z-40">
        <img src={BrandLogo} className="w-8 lg:w-12" />
        <label className="text-orange-300 font-bold lg:text-2xl capitalize">
          {data?.name}
        </label>
      </div>
    </>
  );
}
