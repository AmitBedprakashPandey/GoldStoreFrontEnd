import { ProgressSpinner } from "primereact/progressspinner";
export default function Loading({hide}) {
    return<div style={{zIndex:1080}} className={`${hide ? "hidden":'block absolute top-0'} bg-white/20 w-screen h-screen`}>
        <div className="flex justify-center items-center h-full ">
            <div className="flex justify-center items-center bg-white p-3 rounded-md w-24 h-24 relative shadow-2xl shadow-white">

    <ProgressSpinner strokeWidth="4" className="w-20" animationDuration="0.6s" aria-label="Loading"  />
            </div>

        </div>
    
    </div>
}