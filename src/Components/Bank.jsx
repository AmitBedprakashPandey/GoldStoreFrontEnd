import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiNotePencil, PiTrash, PiFloppyDisk, PiUpload } from "react-icons/pi";
import { Dialog } from "primereact/dialog";
import toast, { toastConfig } from "react-simple-toasts";
import Loading from "./Loading";
import {
  createPyBank,
  fetchAllPyBank,
  deletePyBank,
  updatePyBank,
} from "../Store/Slice/PayBankSlice";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

toastConfig({
  duration: 2000,
  zIndex: 2080,
  className:
    "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
});

export default function BankMode() {
  const dispatch = useDispatch();
  const [pybank, setPyBank] = useState("");
  const [bankOpenModel, setBankOpenModel] = useState(false);
  const [bankId, setBankId] = useState(null);
  const { PyBank, loading } = useSelector((state) => state.Bank);

  useEffect(() => {
    dispatch(fetchAllPyBank());
  }, [dispatch]);

  const saveBank = useCallback(() => {
    dispatch(
      createPyBank({ bank: pybank, user: localStorage.getItem("user") })
    ).then((res) => {
      toast(res?.payload?.message);
      setPyBank("");
    });
  }, [dispatch, pybank]);

  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePyBank(id));
    },
    [dispatch]
  );

  const handleEdit = useCallback((id) => {
    setBankId(id);
    setBankOpenModel(true);
  }, []);

  return (
    <div className="h-screen bg-white">
      {loading && <Loading />}
      <Dialog
        header="Update Bank"
        visible={bankOpenModel}
        onHide={() => setBankOpenModel(false)}
        className="w-96 mx-10"
      >
        <BankFormModel id={bankId} />
      </Dialog>

      <div className="flex justify-center">
        <div className="grid place-content-center mx-2 bg-white w-auto">
          <div className="uppercase font-bold">
            <label className="text-xs">Payment Bank</label>
          </div>
          <div className="grid">
            <label className="text-xs">Enter Payment Bank</label>
            <input
              className="w-full border py-2 px-3 rounded-lg shadow-gray-200 shadow"
              placeholder="Enter Payment Bank"
              value={pybank}
              onChange={(e) => setPyBank(e.target.value)}
            />
            <button
              className="flex justify-center items-center gap-2 text-white font-bold bg-green-500 hover:bg-green-800 duration-300 py-2 rounded-lg my-2 disabled:bg-green-700"
              onClick={saveBank}
              disabled={!pybank}
            >
              Save
            </button>
          </div>

          <table>
            <thead>
              <tr className="bg-gray-200 w-full">
                <th className="w-60 py-3 text-xs px-4 text-start">Bank</th>
                <th className="w-48 px-4 text-xs text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {PyBank?.map((doc) => (
                <tr key={doc._id} className="">
                  <td className="px-4 text-xs">{doc.bank}</td>
                  <td className="px-4 py-1">
                    <Button
                      className="bg-blue-500 hover:bg-blue-800 duration-300 rounded-full p-2 text-white"
                      onClick={() => handleEdit(doc._id)}
                    >
                      <PiNotePencil size={16} />
                    </Button>
                    <Button
                      className="bg-red-500 ml-4 hover:bg-red-800 duration-300 rounded-full p-2 text-white"
                      onClick={() =>
                        confirmDialog({
                          message: "Are you sure you want to delete ?",
                          header: "Confirmation",
                          icon: <piInfoBold size={20} />,
                          defaultFocus: "accept",
                          acceptClassName: "bg-red-500 p-3 text-white",
                          rejectClassName: "p-3 mr-3",
                          accept: () => handleDelete(doc._id),
                        })
                      }
                    >
                      <PiTrash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const BankFormModel = ({ id }) => {
  const dispatch = useDispatch();
  const { PyBank } = useSelector((state) => state.Bank);
  const [pyBank, setPyBank] = useState("");

  useEffect(() => {
    if (id) {
      const single = PyBank.find((doc) => doc._id === id);
      setPyBank(single?.bank || "");
    }
  }, [id, PyBank]);

  const updateBank = useCallback(() => {
    dispatch(updatePyBank({ _id: id, bank: pyBank })).then((res) => {
      toast(res?.payload?.message);
    });
  }, [dispatch, id, pyBank]);

  return (
    <div className="bg-white flex flex-col justify-center items-center relative">
      <input
        className="w-full border rounded-lg py-2 px-3 shadow-gray-300 shadow-md"
        value={pyBank}
        onChange={(e) => setPyBank(e.target.value)}
      />
      <Button
        className="flex justify-center items-center gap-3 py-3 hover:bg-blue-800 duration-300 bg-blue-500 w-full rounded-lg my-3 uppercase text-white"
        onClick={updateBank}
      >
        <PiUpload />
        Update
      </Button>
    </div>
  );
};
