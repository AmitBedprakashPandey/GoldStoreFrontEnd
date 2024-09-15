import { motion } from "framer-motion";
import { getLivePrice } from "../../Store/Slice/LivePriceSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
export default function LivePriceCard(params) {
  const dispatch = useDispatch();
  const [matrial, setMaterial] = useState([]);
  useEffect(() => {
    dispatch(getLivePrice()).then((doc) => {
      setMaterial(doc.payload.data.price);
    });
  }, [matrial]);

  return (
    <>
      <div
        className="relative w-full py-10 bg-cover bg-center"
        // style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="relative w-full flex justify-center flex-wrap gap-3 z-50">
          {matrial.map((item, index) => (<>
            <GoldItems data={item} />         
          
          </>
          ))}
        </div>
      </div>
    </>
  );
}

const GoldItems = ({ data }) => {
  return (
    <>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ease: "easeInOut", duration: 0.3 }}
        className={`${
          data?.material === "Gold"
            ? "text-yellow-300 hover:bg-yellow-300 border-yellow-300"
            : "text-gray-300 hover:bg-gray-300 border-gray-300"
        } hover:text-black transition-colors duration-300 capitalize eczar-font border-2  rounded-full w-36 h-16 flex justify-center flex-col items-center`}
      >
        <p className="text-xs">
          {data?.material} {data?.carat} {data?.weight}
          {data?.prefix}
        </p>
        <strong> ₹ {data?.price} /-</strong>
      </motion.div>
    </>
  );
};
