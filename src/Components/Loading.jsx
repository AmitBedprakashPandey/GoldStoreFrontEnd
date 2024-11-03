import { ProgressSpinner } from "primereact/progressspinner";

export default function Loading(params) {
  return (
      <div
        className="absolute top-0 bottom-0 left-0 right-0 z-50 flex justify-center items-center"
        style={{ backgroundColor: "rgb(0,0,0,0.55)" }}
      >
        <div className="absolute m-auto z-50 bg-white px-3 w-10 h-10 flex justify-center items-center rounded-xl">
          <ProgressSpinner            
            strokeWidth="10"
            fill="#fff"
            animationDuration=".5s"
          />
        </div>
      </div>

  );
}
