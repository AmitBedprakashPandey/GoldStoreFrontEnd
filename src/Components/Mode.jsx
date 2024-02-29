import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilePenLine, Trash, X } from "lucide-react";
import toast, { toastConfig } from "react-simple-toasts";
import Loading from "./Loading";
import {
  createPyMode,
  fetchAllPyMode,
  deletePyMode,
  updatePyMode,
} from "../Store/Slice/PayModeSlice";

export default function Mode() {
  const dispatch = useDispatch();
  const [pymode, setPyMode] = useState();

  const [modeOpenModel, setModeOpenModel] = useState(false);

  const [modeId, setModeId] = useState();

  const { PyMode, loading } = useSelector((state) => state.Mode);

  useEffect(() => {
    dispatch(fetchAllPyMode());
  }, [dispatch]);
  toastConfig({
    duration: 2000,
    zIndex: 1000,
    className:
      "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
  });
  const saveMode = () => {
    dispatch(
      createPyMode({ mode: pymode, user: localStorage.getItem("user") })
    ).then((res) => {
      toast(res?.payload?.message);
      setPyMode("");
      dispatch(fetchAllPyMode());
    });
  };

  return (
    <>
      {loading && <Loading />}
      {modeOpenModel && (
        <ModeFormModel id={modeId} close={() => setModeOpenModel(false)} />
      )}
      <div className="flex justify-center">
        <div className="grid place-content-center mx-2 bg-white w-auto p-5 shadow-gray-400 shadow-md rounded-lg">
          <div className="my-5 text uppercase font-bold">
            <label className="">Payment Mode</label>
          </div>
          <div className="grid">
            <label>Enter Payment Mode</label>
            <input
              className="w-full py-3 border my-2 px-3 rounded-lg shadow-gray-300 shadow-md"
              placeholder="Enter Payment Mode"
              value={pymode}
              onChange={(e) => setPyMode(e.target.value)}
            />
            <button
              className="bg-green-500 py-3 rounded-lg my-2 disabled:bg-green-700"
              onClick={saveMode}
              disabled={pymode ? false : true}
            >
              Save
            </button>
          </div>

          <table>
            <thead>
              <tr className="bg-gray-200 w-full">
                <th className="w-60 py-3 px-4 text-start">Mode</th>
                <th className="w-48 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {PyMode.map((doc, index) => (
                <tr key={index} className="py-2">
                  <td className="px-4">{doc.mode}</td>
                  <td className="flex items-center gap-3 py-2">
                    <button
                      className="bg-blue-500 rounded-full p-3 text-white"
                      onClick={() => {
                        setModeId(doc._id);
                        setModeOpenModel(true);
                      }}
                    >
                      <FilePenLine size={16} />
                    </button>
                    <button
                      className="bg-red-500 rounded-full p-3 text-white "
                      onClick={() => {
                        dispatch(deletePyMode(doc._id)).then((res) => {
                          toast(res?.payload?.message);
                          dispatch(fetchAllPyMode());
                        });
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const ModeFormModel = ({ close, id }) => {
  const { PyMode, loading } = useSelector((state) => state.Mode);
  const [pyMode, setPyMode] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      const single = PyMode.filter((doc) => doc._id === id);
      console.log(single[0].mode);
      setPyMode(single[0]);
    }
  }, [pyMode,id]);
  const update = () => {
    dispatch(updatePyMode({ _id: id, mode: pyMode })).then((res) => {
      toast(res?.payload?.message);
      dispatch(fetchAllPyMode());
      close();
    });
  };
  return (
    <>
      {loading && <Loading />}
      <div
        className="absolute top-0 bottom-0 right-0 left-0 z-50 flex justify-center items-center"
        style={{ backgroundColor: "rgb(0,0,0,0.65)" }}
      >
        <div className="bg-white w-96 h-48 rounded-lg p-3 mx-3 flex flex-col justify-center items-center relative">
          <X
            size={20}
            onClick={close}
            className="w-10 h-10 absolute -top-5 right-0 bg-white rounded-full"
          />
          <label className="my-3">Update</label>
          <input
            className="w-full border rounded-lg py-2 px-3 shadow-gray-300 shadow-md"
            value={pyMode?.mode}
            onChange={(e) => setPyMode(e.target.value)}
          />
          <button
            className="py-3 bg-blue-500 w-full rounded-lg my-3 uppercase text-white"
            onClick={update}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};
