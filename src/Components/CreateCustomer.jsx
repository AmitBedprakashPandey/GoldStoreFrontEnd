import { FilePenLine, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchAllCustomers,
  deleteCustomer,
} from "../Store/Slice/CustomerSlice";
import CustomerForm from "../layout/CustomerForm";
import {
  PiPlugBold,
  PiNotePencilBold,
  PiTrash,
  PiPlusBold,
} from "react-icons/pi";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import toast from "react-simple-toasts";
import moment from "moment";
import RipppleButton from "./RippleButton";
import { Modal } from "antd";
import RippleButton from "./RippleButton";
import { Button } from "primereact/button";

function CreateCustomer() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openMode, setOpenMode] = useState("");
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const { Customer, loading } = useSelector((state) => state.Customers);
  const [modal2Open, setModal2Open] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, []);

  const CreateBtn = () => {
    setOpenMode("save");
    setOpenMenu(true);
    setId();
  };

  return (
    <>
      <Dialog
        maximized
        closable={false}
        header={openMode === "update" ? "Update Customer" : "Create Customer"}
        visible={openMenu}
        onHide={() => setOpenMenu(false)}
        className="w-full h-full z-auto"
      >
        <CustomerForm
          close={() => setOpenMenu(false)}
          Mode={openMode}
          id={id}
        />
      </Dialog>

      {loading && <Loading />}

      <div className="flex justify-center">
        <div className="">
          <Button
            label="Create Customer"
            icon={<PiPlusBold />}
            className="bg-blue-500 mx-5 my-3  hover:bg-blue-800 duration-300 font-normal text-white px-5 py-3 gap-3"
            onClick={CreateBtn}
          ></Button>

          <div className="relative w-auto overflow-auto lg:overflow-x-hidden mx-2 md:mx-5 bg-white shadow-gray-400 shadow-md">
            <table className="table-fixed">
              <tr className="text-sm bg-gray-200 flex items-center ">
                <th className="py-3 px-2 flex justify-center items-center w-10">
                  #
                </th>
                <th className="py-3 px-2 flex justify-center items-center w-48">
                  Party Name
                </th>
                <th className="hidden md:block py-3 px-2 flex justify-center items-center w-48 truncate">
                  Address
                </th>
                <th className="hidden md:block py-3 px-2 flex justify-center items-center w-36 ">
                  Phone no.
                </th>
                <th className="hidden md:block py-3 px-2 flex justify-center items-center w-36 ">
                  mobile no.
                </th>
                <th className="hidden md:block py-3 px-2 flex justify-center items-center w-36 ">
                  Email
                </th>
                <th className="hidden md:block py-3 px-2 flex justify-center items-center w-36">
                  Gst no.
                </th>
                <th className="hidden md:block py-3 px-2 flex justify-center items-center w-32">
                  City
                </th>
                <th className="py-3 px-2 flex justify-center items-center w-32">
                  Date
                </th>
                <th className="py-3 px-2 flex justify-center items-center w-44">
                  Action
                </th>
              </tr>
              <tbody>
                {Customer?.map((doc, index) => (
                  <tr key={index} className="text-sm flex items-center h-14">
                    <td className="py-3 px-2 flex justify-center items-center w-10 h-full">
                      {index + 1}
                    </td>
                    <td className="py-3 px-2 flex justify-center items-center w-48 h-full">
                      {doc?.name}
                    </td>
                    <td className="hidden md:block py-3 px-2 h-full flex justify-center items-center w-48 truncate">
                      {doc?.address}
                    </td>
                    <td className="hidden md:block py-3 px-2 h-full flex justify-center items-center w-36 ">
                      {doc?.phone}
                    </td>
                    <td className="hidden md:block py-3 px-2 h-full flex justify-center items-center w-36 ">
                      {doc?.mobile}
                    </td>
                    <td className="hidden md:block py-3 px-2 h-full flex justify-center items-center w-36 truncate">
                      {doc?.email}
                    </td>
                    <td className="hidden md:block py-3 px-2 h-full flex justify-center items-center w-36 truncate">
                      {doc?.gst}
                    </td>
                    <td className="hidden md:block py-3 px-2 h-full flex justify-center items-center w-32">
                      {doc?.city}
                    </td>
                    <td className="py-3 px-2 flex justify-center items-center h-full w-32">
                      {moment(doc?.date).format("DD-MM-YYYY")}
                    </td>
                    <td className="flex gap-2 py-2 px-3 justify-start h-full w-44">
                      <Button
                        className="bg-blue-500 duration-300 text-white hover:bg-blue-600 w-10 h-10 rounded-full px-3"
                        onClick={() => {
                          setOpenMode("update");
                          setOpenMenu(true);
                          setId(doc?._id);
                        }}
                      >
                        <PiNotePencilBold size={18} />
                      </Button>
                      <Button
                        className="bg-red-500 duration-300 text-white hover:bg-red-600 w-10 h-10 rounded-full px-3"
                        open={() => setModal2Open(true)}
                        icon={<PiTrash size={18} />}
                      />

                      <Modal
                        centered
                        open={modal2Open}
                        onOk={() => {
                          dispatch(deleteCustomer(doc?._id)).then((res) => {
                            toast(res?.payload?.message);
                            dispatch(fetchAllCustomers());
                          });
                          setModal2Open(false);
                        }}
                        closable={false}
                        onCancel={() => setModal2Open(false)}
                      >
                        <label className="text-3xl ">
                          Are you sure want to delete ?
                        </label>
                      </Modal>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCustomer;
