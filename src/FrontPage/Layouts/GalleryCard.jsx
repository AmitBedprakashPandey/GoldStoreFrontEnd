import img1 from "../Assets/images/1.jpg";
import img2 from "../Assets/images/2.jpg";
import img3 from "../Assets/images/3.jpg";
import img4 from "../Assets/images/4.jpg";
import img5 from "../Assets/images/5.jpg";
export default function GalleryCard(params) {
  return (
    <div
      className="w-full relative"
      // style={{ backgroundImage: `url(${background})` }}
    >
        <h1 className="2xl:ml-[15%] text-orange-300 font-bold text-4xl p-4 z-30">
          Gallery
        </h1>
      <div className="relative w-full z-30 p-3">
          <img
            src={img1}
            className="col-span-4 w-full mb-3 border"
          />
        <div className="flex justify-between w-full  ">

          <img
            src={img2}
           className="aspect-square min-w-14 max-w-96 border-slate-300/50 border"
          />
          <img
            src={img3}
            className=" aspect-square min-w-14 max-w-96 border-slate-300/50 border"
          />
          <img
            src={img4}
            className=" aspect-square min-w-14 max-w-96 border-slate-300/50 border"
          />
          <img
            src={img5}
            className="aspect-square min-w-14 max-w-96  border-slate-300/50 border"
          />
        </div>
      </div>

    </div>
  );
}
