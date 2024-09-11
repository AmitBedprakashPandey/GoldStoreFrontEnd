import { motion } from "framer-motion";
import BackgroundImage from "../Assets/images/background.jpg";
import { getLivePrice } from "../../Store/Slice/LivePriceSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
export default function LivePriceCard(params) {
const dispatch = useDispatch()
  const [matrial,setMaterial]=useState([]);
  const [silver,setSilver]=useState([]);
  const [gold,setGold]=useState([]);
  useEffect(()=>{
    dispatch(getLivePrice()).then((doc)=>setMaterial(doc.payload.data.price)).then(()=>{
      setGold(matrial.filter((item)=>item.material === 'Gold'));
      setSilver(matrial.filter((item)=>item.material === 'Silver'));
    });
    
  },[matrial])

  return (
    <div className="relative w-full px-24 grid gap-5 mt-5 py-5 bg-cover bg-center"
    style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
        
      <div className="relative w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 place-content-center  z-50">
      {gold.map((item,index)=>(
       <GoldItems data={item}/>
       
       
      ))}
      
      </div>
      <div className="relative w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 place-content-center  z-50">
      {silver.map((item,index)=>(
       <SilverItems data={item}/>
       
      ))}
      </div>
   
    </div>
  );
}


const GoldItems=({data})=>{
    return<>
    <motion.div
    initial={{scale:0}}
    animate={{scale:1}}
    transition={{delay:0.5,ease:'easeInOut',duration:0.5}}
    className="text-yellow-300 hover:bg-yellow-300 hover:text-black transition-colors duration-300 capitalize eczar-font border-2 border-yellow-300 rounded-full w-36 h-16 flex justify-center flex-col items-center">
          <p className="text-xs">{data?.material} {data?.carat} {data.weight}{data.prefix}</p>
          <strong> ₹ {data.price} /-</strong>
        </motion.div>
    
    </>
}

const SilverItems=({data})=>{
    return<>
    <motion.div
     initial={{scale:0}}
     animate={{scale:1}}
     transition={{delay:0.5,ease:'easeInOut',duration:0.5}}
      className="text-gray-300 hover:bg-gray-300 hover:text-black transition-colors duration-300 capitalize eczar-font border-2 border-gray-300 rounded-full w-36 h-16 flex justify-center flex-col items-center">
           <p className="text-xs">{data?.material} {data.weight}{data.prefix}</p>
           <strong> ₹ {data.price} /-</strong>
        </motion.div>
    
    </>
}