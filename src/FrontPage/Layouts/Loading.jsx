import { ProgressSpinner } from "primereact/progressspinner";
export default function Loading({hide}) {
    return<div className={`${hide ? "hidden":'block absolute top-0'}  z-50 bg-white/40 w-screen h-screen`}>
        <div className="flex justify-center items-center h-full">
    <ProgressSpinner strokeWidth="8" animationDuration="0.5s" aria-label="Loading"  />

        </div>
    
    </div>
}