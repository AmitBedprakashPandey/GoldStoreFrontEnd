import Necklece from "../Assets/images/necklace.png";
import { motion } from "framer-motion";
export default function Banner(params) {
  return (
    <div className="relative z-40">
      <div className="relative flex justify-center mt-5 w-full">
        <div className="w-full flex flex-col-reverse lg:flex-row lg:justify-between items-center lg:px-40">
          <motion.div
           initial={{x:-50}}
           animate={{x:0}}
           transition={{ ease: "easeInOut", duration: 0.5,delay:0.5 }}
          className="text-white w-4/5 grid mt-16 ">
            <small
            className="text-yellow-300 capitalize font-bold">
              choose your dream
            </small>
            <strong className="capitalize text-6xl">
              Discover The best of best
            </strong>
            <p className="text-xs">
              To open the dial pad in a mobile device using ReactJS
            </p>
          </motion.div>
          <motion.div
          initial={{scale:0.7}}
          animate={{ scale: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5 ,delay:0.5}}
          className="relative"
          >
            <img src={Necklece} className="w-96 lg:w-[400px]" />
          </motion.div>
        </div>
      </div>


    </div>
  );
}
