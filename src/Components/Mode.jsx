import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { PiInfoDuotone, PiPencilLine, PiTrash } from "react-icons/pi";
import { Toast } from "primereact/toast";
import Loading from "./Loading";
import {
  createPyMode,
  fetchAllPyMode,
  deletePyMode,
  updatePyMode,
  clearNotifications,
} from "../Store/Slice/PayModeSlice";

export default function Mode() {
  const dispatch = useDispatch();
  const [pymode, setPyMode] = useState();
  const [modeOpenModel, setModeOpenModel] = useState(false);
  const toast = useRef(null);

  const [modeId, setModeId] = useState();

  const { PyMode, loading, message, error } = useSelector(
    (state) => state.Mode
  );

  useEffect(() => {
    dispatch(fetchAllPyMode());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.current.show({
        severity: "success",
        summary: message,
        life: 2000,
        closable: false,
        icon: null,
        className: "bg-black text-white z-50",
      });
      dispatch(clearNotifications());
    }
    if (error) {
      toast.current.show({
        severity: "error",
        summary: error,
        life: 2000,
        icon: null,
        closable: false,
        classNames: "z-50",
      });
      dispatch(clearNotifications());
    }
  }, [message, error]);

  const saveMode = () => {
    dispatch(
      createPyMode({ mode: pymode, user: localStorage.getItem("user") })
    );
  };

  const deleteAction = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete ?",
      header: "Confirmation",
      icon: <PiInfoDuotone size={20} />,
      defaultFocus: "accept",
      acceptClassName: "bg-red-500 p-3 text-white",
      rejectClassName: "p-3 mr-3",
      accept: () => dispatch(deletePyMode(id)),
    });
  };

  return (
    <>
      <Toast ref={toast} position="bottom-center" />
      {loading && <Loading />}
      <Dialog
        header={"Update Mode"}
        visible={modeOpenModel}
        onHide={() => setModeOpenModel(false)}
        className="w-96 mx-10"
      >
        <ModeFormModel id={modeId} />
      </Dialog>
      <div className="flex justify-center h-screen bg-white">
        <div className="flex flex-col">
          <div className="text uppercase font-bold">
            <label className="text-xs">Payment Mode</label>
          </div>
          <div className="grid">
            <label className="text-xs">Enter Payment Mode</label>
            <input
              className="w-full py-2 border px-3 rounded-lg shadow-gray-300 shadow-md"
              placeholder="Enter Payment Mode"
              value={pymode}
              onChange={(e) => setPyMode(e.target.value)}
            />
            <button
              className="bg-green-500 hover:bg-green-800 duration-300 py-2 rounded-lg my-2 text-white disabled:bg-green-700"
              onClick={saveMode}
              disabled={pymode ? false : true}
            >
              Save
            </button>
          </div>

          <table>
            <thead>
              <tr className="bg-gray-200 w-full">
                <th className="w-60 text-xs py-3 px-4 text-start">Mode</th>
                <th className="w-48 text-xs text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {PyMode.map((doc, index) => (
                <tr key={index} className="">
                  <td className="px-4 text-xs">{doc.mode}</td>
                  <td className="flex items-center gap-2 py-0.5">
                    <button
                      className="bg-blue-500 hover:bg-blue-800 duration-300 rounded-full p-2 text-white"
                      onClick={() => {
                        setModeId(doc._id);
                        setModeOpenModel(true);
                      }}
                    >
                      <PiPencilLine size={16} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-800 duration-300 rounded-full p-2 text-white "
                      onClick={() => deleteAction(doc._id)}
                    >
                      <PiTrash size={16} />
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
  const { PyMode, message, error } = useSelector((state) => state.Mode);
  const [pyMode, setPyMode] = useState();
  const dispatch = useDispatch();

  const pyModeHandler = (e) => {
    setPyMode({ ...pyMode, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (id) {
      const single = PyMode.filter((doc) => doc._id === id);
      setPyMode(single[0]);
    }
  }, [id]);

  const update = () => {
    dispatch(updatePyMode(pyMode));
  };

  return (
    <>
      <div className="bg-white rounded-lg flex flex-col justify-center items-center relative">
        <input
          className="w-full border rounded-lg py-2 px-3 shadow-gray-300 shadow-md"
          name="mode"
          value={pyMode?.mode}
          onChange={pyModeHandler}
        />
        <button
          className="py-3 bg-blue-500 hover:bg-blue-800 duration-300 w-full rounded-lg my-3 uppercase text-white"
          onClick={update}
        >
          Update
        </button>
      </div>
    </>
  );
};
