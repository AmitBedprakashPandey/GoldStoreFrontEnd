import { motion } from "framer-motion";
import BackgroundImage from "../Assets/images/background.jpg";
export default function Footer({data}) {
  const handleDialPadOpen = () => {
    window.location.href = "tel:" + data?.mobile; // This will open the dial pad
  };


  return (
    <div className={`fixed bottom-0  w-full bg-cover bg-center overflow-hidden flex items-center justify-evenly py-5 z-50 `}
    style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="z-20 ">
        <label className="text-white lg:text-2xl">
          Contact Us{" "}
          <span className="text-orange-300 font-bold  eczar-font">
      {data?.name}
          </span>
        </label>
        <p className="text-white lg:text-xs  w-8/12 hidden md:block">
          call on this number for more informations
        </p>
      </div>

      <motion.button
       initial={{scale:0}}
       whileInView={{scale:1}}
       transition={{ease:'easeInOut',duration:0.2}}
       viewport={{once:'true'}}
        onClick={handleDialPadOpen}
        className="w-56 bg-yellow-500 hover:bg-yellow-600 duration-300 font-bold capitalize py-3 px-6 rounded-lg z-20"
      >
        +91 {data?.mobile}
      </motion.button>
    </div>
  );
}
