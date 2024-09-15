import {PiMapPinLineFill } from "react-icons/pi";
export default function InfoCard({ data }) {
  return (
    <div
      className="relative w-full px-11 py-10 text-center bg-cover bg-center"
      // style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex items-center justify-center">
    <PiMapPinLineFill className="text-white" size={50}/>
        <p className="text-white flex flex-wrap">{data?.address}</p>
      </div>
    </div>
  );
}
