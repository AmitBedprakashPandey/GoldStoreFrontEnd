import img1 from "../Assets/images/1.jpg";
import img2 from "../Assets/images/2.jpg";
import img3 from "../Assets/images/3.jpg";
import img4 from "../Assets/images/4.jpg";
import img5 from "../Assets/images/5.jpg";
import background from "../Assets/images/background.jpg";
export default function GalleryCard(params) {
  return (
    <div className="relative bg-red-950  bg-cover bg-center"
    style={{ backgroundImage: `url(${background})` }}
    >
      <div className="grid grid-cols-6 gap-2 relative p-3 z-30">
      <h1 className="col-span-6 text-orange-300 font-bold text-3xl py-5 z-30">Gallery</h1>
        <img src={img1} className="col-span-4 w-full h-40 lg:h-5/6 border-slate-300/50 border" />
        <img src={img2} className="col-span-2 w-full h-40 lg:h-5/6 border-slate-300/50 border" />
        <img src={img3} className="col-span-2 w-full h-40 lg:h-5/6 border-slate-300/50 border" />
        <img src={img4} className="col-span-2 w-full h-40 lg:h-5/6 border-slate-300/50 border" />
        <img src={img5} className="col-span-2 w-full h-40 lg:h-5/6 border-slate-300/50 border" />
      </div>
    </div>
  );
}
