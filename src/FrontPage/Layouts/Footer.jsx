import { motion } from "framer-motion";
import BackgroundImage from "../Assets/images/background.jpg";
export default function Footer(params) {
  const handleDialPadOpen = () => {
    window.location.href = "tel:913976795"; // This will open the dial pad
  };

  return (
    <div className={`bg-cover bg-center relative overflow-hidden px-4 py-5 flex justify-between items-center`}
    style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="z-20 ">
        <label className="text-white lg:text-2xl">
          Contact Us{" "}
          <span className="text-orange-300 font-bold  eczar-font">
            Shubham jewallers
          </span>
        </label>
        <p className="text-white lg:text-xs  w-8/12 hidden md:block">
          To open the dial pad in a mobile device using ReactJS, you can use the
          tel: protocol in the href attribute of an anchor
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
        +91 9137976758
      </motion.button>
    </div>
  );
}
