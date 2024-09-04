import BrandLogo from "../Assets/images/BrandLogo.png";
export default function Navbar(params) {
  return (
    <div className="relative w-full flex justify-center items-center gap-3 eczar-font p-3 z-40">
      <img src={BrandLogo} className="w-8 lg:w-12" />
      <label className="text-orange-300 font-bold lg:text-2xl capitalize">
        Shubham Jewallers
      </label>
    </div>
  );
}
