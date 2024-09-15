import img1 from "../Assets/images/1.jpg";
import img2 from "../Assets/images/2.jpg";
import img3 from "../Assets/images/3.jpg";
import img4 from "../Assets/images/4.jpg";
import img5 from "../Assets/images/5.jpg";
import background from "../Assets/images/background.jpg";
export default function GalleryCard(params) {
  return (
    <div
      className="w-full relative  bg-cover bg-center"
      // style={{ backgroundImage: `url(${background})` }}
    >
        <h1 className="2xl:ml-[15%] text-orange-300 font-bold text-4xl p-4 z-30">
          Gallery
        </h1>
      <div className="relative grid place-content-center z-30 p-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 justify-center">
          <img
            src={img1}
            className="col-span-3 w-fit h-fit sm:col-span-4 md:col-span-5 lg:col-span-4 border-slate-300/50 border-2  border-r-0"
          />

          <img
            src={img2}
            className="col-span-1 aspect-square h-40 md:h-80 lg:h-80 border-slate-300/50 border"
          />
          <img
            src={img3}
            className="col-span-1 aspect-square h-40 lg:h-80 border-slate-300/50 border"
          />
          <img
            src={img4}
            className="col-span-1 aspect-square h-40 lg:h-80 border-slate-300/50 border"
          />
          <img
            src={img5}
            className="hidden lg:block col-span-1 aspect-square h-40 lg:h-80 border-slate-300/50 border"
          />
        </div>
      </div>
    </div>
  );
}
