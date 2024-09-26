import background from "../Assets/images/background.jpg";import { motion } from "framer-motion";
import bracelet from "../Assets/images/Catagory/bracelet.jpg";
import earring from "../Assets/images/Catagory/earring.png";
import necklace from "../Assets/images/Catagory/necklace.png";
import pendant from "../Assets/images/Catagory/pendant.png";
import ring from "../Assets/images/Catagory/ring.png";
import bangals from "../Assets/images/Catagory/bangals.png";
import brooch from "../Assets/images/Catagory/brooch.png";
import chain from "../Assets/images/Catagory/chain.png";
export default function Catagory(params) {
  const jewelryTypes = [
    {
      name: "Ring",
      description:
        "Worn on fingers and often symbolize engagement, marriage, or fashion.",
        img:ring
    },
    {
      name: "Necklace",
      description:
        "Chains or strands worn around the neck, which may include pendants.",img:necklace
    },
    {
      name: "Bracelet",
      description:
        "Worn on the wrist, made of various materials such as metal, leather, or beads.",img:bracelet
    },
    {
      name: "Earrings",
      description:
        "Worn on the earlobes, available in styles like studs, hoops, or dangly designs.",img:earring
    },
    {
      name: "Pendant",
      description:
        "Small pieces worn on chains or necklaces, typically decorative or symbolic.",img:pendant
    },
    {
      name: "Brooch",
      description:
        "Decorative pins worn on clothing, often used as accessories or to hold fabric together.",img:brooch
    },
   
    {
      name: "Bangle",
      description: "Rigid bracelets that can be worn stacked or alone.",img:bangals
    },
    {
      name: "Chain",
      description: "Simple strands of metal worn around the neck or wrist.",img:chain
    },
  ];

  return (
    <div
      className="z-40 bg-cover bg-center pt-5"
      // style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="2xl:ml-[15%] text-orange-300 font-bold text-4xl p-4 z-30">
       Jewellery Catagory
      </h1>
      <div className="w-full sm custom-scroll-on-mobile lg:flex lg:justify-center  py-5">
        <div className="flex">
          {jewelryTypes.map((item, index) => (
            <Item data={item} key={index}  />
          ))}
        </div>
      </div>
    </div>
  );
}

const Item = ({data}) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ ease: "easeInOut", duration: 0.2 }}
      viewport={{ once: "true" }}
      className="flex flex-col flex-shrink-0 w-36 items-center"
    >
      <div className="border-4 border-orange-300 overflow-hidden rounded-full h-32 w-32 bg-rose-950">
        <img src={data.img}/>
      </div>
      <label className="text-orange-300 py-4 font-medium capitalize">
        {data.name}
      </label>
    </motion.div>
  );
};
