import { motion } from "framer-motion";
export default function Footer({ data }) {
  const OpenDialPad = () => {
    window.location.href = "tel:" + data?.mobile; // This will open the dial pad
  };

  return (
    <div
      className={`w-full bg-cover bg-center overflow-hidden flex items-center justify-evenly py-5 z-40 `}
      // style={{ backgroundImage: `url(${BackgroundImage})` }}
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
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ ease: "easeInOut", duration: 0.2 }}
        viewport={{ once: "true" }}
        onClick={OpenDialPad}
        className="w-40 text-sm md:text-base md:w-56 bg-yellow-500 hover:bg-yellow-600 duration-300 font-bold capitalize py-3 px-6 rounded-lg z-20"
      >
        +91 {data?.whatsapp}
      </motion.button>
    </div>
  );
}
