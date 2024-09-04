import { motion } from "framer-motion";

export default function LivePriceCard(params) {
  return (
    <div className="relative grid gap-5 mt-5 py-5">
      <div className="relative w-full flex gap-3 justify-center z-50">
       <GoldItems/>
       <GoldItems/>
       <GoldItems/>
      </div>
      <div className="relative w-full flex gap-3 justify-center z-50">
       <SilverItems/>
       <SilverItems/>
       <SilverItems/>
      </div>
   
    </div>
  );
}


const GoldItems=({})=>{
    return<>
    <motion.div
    initial={{scale:0}}
    animate={{scale:1}}
    transition={{delay:0.5,ease:'easeInOut',duration:0.5}}
    className="text-yellow-300 hover:bg-yellow-300 hover:text-black transition-colors duration-300 capitalize eczar-font border-2 border-yellow-300 rounded-full w-36 h-16 flex justify-center flex-col items-center">
          <p className="text-xs">Gold 22 Carat 1g</p>
          <strong> ₹ 7187 /-</strong>
        </motion.div>
    
    </>
}

const SilverItems=({})=>{
    return<>
    <motion.div
     initial={{scale:0}}
     animate={{scale:1}}
     transition={{delay:0.5,ease:'easeInOut',duration:0.5}}
      className="text-gray-300 hover:bg-gray-300 hover:text-black transition-colors duration-300 capitalize eczar-font border-2 border-gray-300 rounded-full w-36 h-16 flex justify-center flex-col items-center">
          <p className="text-xs">Gold 22 Carat 1g</p>
          <strong> ₹ 7187 /-</strong>
        </motion.div>
    
    </>
}