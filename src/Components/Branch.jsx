import {
  fetchAllBranch,
  createBranch,
  deleteBranch,
  updateBranch,
} from "../Store/Slice/BranchSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { BiEdit, BiInfoCircle, BiTrash, BiX } from "react-icons/bi";
import toast, { Toast, toastConfig } from "react-simple-toasts";
import Loading from "./Loading";
import { Dialog } from "primereact/dialog";
import {confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { PiUpload } from "react-icons/pi";

toastConfig({
  duration: 2000,
  zIndex: 2080,
  className:
    "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
});
export default function Branch(params) {
  const [openModel, setOpenModel] = useState(false);
  const [branch, setBranch] = useState();
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const { Branch, loading } = useSelector((state) => state.Branchs);

  useEffect(() => {
    dispatch(fetchAllBranch());
  }, []);

  const save = () => {
    dispatch(
      createBranch({ branch: branch, user: localStorage.getItem("user") })
    ).then((res) => {
      toast(res?.payload?.message);
      dispatch(fetchAllBranch());
    });
  };

  const deleteData = (id) => {
    dispatch(deleteBranch(id)).then((res) => {
      toast(res?.payload?.message);
    });
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to save ?",
      header: "Confirmation",
      icon: <BiInfoCircle size={20} />,
      defaultFocus: "accept",
      acceptClassName: "bg-cyan-500 p-3 text-white",
      rejectClassName: "p-3 mr-3",
      accept: save,
    });
  };

  return (
    <>
      {/* <ConfirmDialog /> */}

      <Dialog
        header="Update"
        maximizable={false}
        visible={openModel}

        draggable={false}
        onHide={() => setOpenModel(!openModel)}
        className="max-w-96 mx-10"
      >
        <FormModel close={() => setOpenModel(!openModel)} id={id} />
      </Dialog>

      {loading && <Loading />}

      <div className="flex justify-center  pt-5">
        <div className="grid place-content-center mx-2 w-auto p-5 bg-white ">
          <div className="grid">
            <label>Enter Branch</label>
            <input
              className="w-full py-3 border my-2 px-3 rounded-lg shadow-gray-300 shadow-md"
              placeholder="Enter Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
            <Button
              label="save"
              className="bg-green-500 hover:bg-green-800 duration-300 text-white uppercase py-3 rounded-lg my-2 disabled:bg-green-600"
              onClick={confirm1}
              disabled={branch ? false : true}
            ></Button>
          </div>

          <table>
            <thead>
              <tr className="bg-gray-50 w-full">
                <th className="w-60 py-3 px-4 text-start">Branch</th>
                <th className="w-48 px-4 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {Branch.map((doc, index) => (
                <tr className="py-2 h-16">
                  <td className="px-4 h-full">{doc.branch}</td>
                  <td className="h-full px-4">
                    <Button
                      className="bg-blue-500 hover:bg-blue-800 duration-300 rounded-full p-3 text-white"
                      onClick={() => {
                        setId(doc._id);
                        setOpenModel(true);
                      }}
                    >
                      <BiEdit size={16} />
                    </Button>
                    <Button
                      className="bg-red-500 ml-3 hover:bg-red-800 duration-300 rounded-full p-3 text-white "
                      onClick={() =>
                        confirmDialog({
                          message: "Are you sure you want to delete ?",
                          header: "Confirmation",
                          icon: <BiInfoCircle size={20} />,
                          defaultFocus: "accept",
                          acceptClassName: "bg-red-500 p-3 text-white",
                          rejectClassName: "p-3 mr-3",
                          accept: () => deleteData(doc._id),
                        })
                      }
                    >
                      <BiTrash size={16} />
                    </Button>
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

const FormModel = ({ close, id }) => {
  const { Branch } = useSelector((state) => state.Branchs);
  const [branch, setBranch] = useState();
  const [model1Open, setModel1open] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      const single = Branch.filter((doc) => doc._id === id);
      setBranch(single[0].branch);
    }
  }, []);
  const update = () => {
    dispatch(updateBranch({ _id: id, branch: branch }))
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "bg-cyan-500 p-3 text-white",
      rejectClassName: "p-3 mr-3",
      accept: update,
    });
  };
  return (
    <>
      <div className="bg-white w-full h-full flex flex-col justify-center items-center relative">
        <input
          className="w-full border rounded-lg py-2 px-3 shadow-gray-300 shadow-md"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
        <button
          className="flex justify-center items-center gap-3 py-3 bg-blue-500 hover:bg-blue-800 duration-300 w-full rounded-lg my-3 uppercase text-white"
          onClick={confirm1}
        >
          <PiUpload/>
          Update
        </button>
      </div>
    </>
  );
};
