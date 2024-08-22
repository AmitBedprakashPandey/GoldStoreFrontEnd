import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loading(params) {
  return (
    <>
      <div
        className="absolute top-0 bottom-0 right-0 left-0 z-50 flex justify-center items-center"
        style={{ backgroundColor: "rgb(0,0,0,0.65)" }}
      >
        <div className="absolute m-auto z-50 bg-white px-3 w-20 h-20 flex justify-center items-center rounded-xl">
        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
      </div>
    </>
  );
}
