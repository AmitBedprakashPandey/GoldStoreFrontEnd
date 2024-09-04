import background from "../Assets/images/background.jpg";
import {motion} from 'framer-motion'
export default function Catagory(params) {
    return(
        <div className="z-40 bg-cover bg-center pt-5"
        style={{ backgroundImage: `url(${background})` }}
        
        >
            <h1 className="text-orange-300 eczar-font font-bold text-2xl py-4 px-4">Catagory</h1>
            <div className="w-full px-5 custom-scroll-on-mobile lg:flex lg:justify-center  py-5">
                <div className="flex space-x-4">

            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
                </div>
            </div>
           
        </div>
    )
}


const Item=()=>{
    return<motion.div
    initial={{scale:0}}
    whileInView={{scale:1}}
    transition={{ease:'easeInOut',duration:0.2}}
    viewport={{once:'true'}}
    className="flex flex-col flex-shrink-0 w-36 items-center">
    <div className="border-4 border-orange-300 overflow-hidden rounded-full h-32 w-32 bg-rose-950"> 

    </div>
<label className="text-orange-300 font-medium capitalize">Engagment Rings</label>
    </motion.div>
}