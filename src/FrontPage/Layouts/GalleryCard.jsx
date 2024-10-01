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
      <h1 className="text-lg text-orange-300 font-bold md:text-2xl py-4 px-0 z-30">
        Gallery
      </h1>

      <div className="w-full  flex flex-col items-center">
        <div className="flex justify-center w-full z-30 mb-1">
          <img src={img1} atl className="w-[100%] md:w-[80%] border border-yellow-700 " />
        </div>

        <div className="flex justify-center gap-0 w-full relative">
          <img
            src={img2}
            className="aspect-square   w-[25%] md:w-[20%] border border-yellow-700"
          />
          <img
            src={img3}
            className=" aspect-square w-[25%] md:w-[20%] border border-yellow-700"
          />
          <img
            src={img4}
            className=" aspect-square w-[25%] md:w-[20%] border border-yellow-700"
          />
          <img
            src={img5}
            className="aspect-square  w-[25%] md:w-[20%] border border-yellow-700"
          />
        </div>
      </div>
    </div>
  );
}
