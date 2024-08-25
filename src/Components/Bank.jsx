import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit, BiTrash } from "react-icons/bi";
import { Dialog } from "primereact/dialog";
import toast, { toastConfig } from "react-simple-toasts";
import Loading from "./Loading";
import {
  createPyBank,
  fetchAllPyBank,
  deletePyBank,
  updatePyBank,
} from "../Store/Slice/PayBankSlice";

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
    dispatch(createPyBank({ bank: pybank, user: localStorage.getItem("user") }))
      .then((res) => {
        toast(res?.payload?.message);
        setPyBank("");
        dispatch(fetchAllPyBank());
      });
  }, [dispatch, pybank]);

  const handleDelete = useCallback((id) => {
    dispatch(deletePyBank(id)).then((res) => {
      toast(res?.payload?.message);
      dispatch(fetchAllPyBank());
    });
  }, [dispatch]);

  const handleEdit = useCallback((id) => {
    setBankId(id);
    setBankOpenModel(true);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Dialog
        header="Update Bank"
        visible={bankOpenModel}
        onHide={() => setBankOpenModel(false)}
        className="w-96 mx-10"
      >
        <BankFormModel id={bankId} />
      </Dialog>

      <div className="flex justify-center pt-5">
        <div className="grid place-content-center mx-2 border bg-white w-auto p-5 shadow-gray-400 shadow-md rounded-lg">
          <div className="my-5 text uppercase font-bold">
            <label>Payment Bank</label>
          </div>
          <div className="grid">
            <label>Enter Payment Bank</label>
            <input
              className="w-full py-3 border my-2 px-3 rounded-lg shadow-gray-300 shadow-md"
              placeholder="Enter Payment Bank"
              value={pybank}
              onChange={(e) => setPyBank(e.target.value)}
            />
            <button
              className="bg-green-500 py-3 rounded-lg my-2 disabled:bg-green-700"
              onClick={saveBank}
              disabled={!pybank}
            >
              Save
            </button>
          </div>

          <table>
            <thead>
              <tr className="bg-gray-200 w-full">
                <th className="w-60 py-3 px-4 text-start">Bank</th>
                <th className="w-48 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {PyBank?.map((doc) => (
                <tr key={doc._id} className="py-2">
                  <td className="px-4">{doc.bank}</td>
                  <td className="flex items-center gap-3 py-2">
                    <button
                      className="bg-blue-500 rounded-full p-3 text-white"
                      onClick={() => handleEdit(doc._id)}
                    >
                      <BiEdit size={16} />
                    </button>
                    <button
                      className="bg-red-500 rounded-full p-3 text-white"
                      onClick={() => handleDelete(doc._id)}
                    >
                      <BiTrash size={16} />
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

const BankFormModel = ({ id }) => {
  const dispatch = useDispatch();
  const { PyBank, loading } = useSelector((state) => state.Bank);
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
      dispatch(fetchAllPyBank());
    });
  }, [dispatch, id, pyBank]);

  return (
    <div className="bg-white flex flex-col justify-center items-center relative">
      <input
        className="w-full border rounded-lg py-2 px-3 shadow-gray-300 shadow-md"
        value={pyBank}
        onChange={(e) => setPyBank(e.target.value)}
      />
      <button
        className="py-3 bg-blue-500 w-full rounded-lg my-3 uppercase text-white"
        onClick={updateBank}
      >
        Update
      </button>
    </div>
  );
};
