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
                <th className="py-3 px-2 flex justify-center items-center w-10">#</th>
                <th className="py-3 px-2 flex justify-center items-center w-48">Party Name</th>
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
                <th className="py-3 px-2 flex justify-center items-center w-32">Date</th>
                <th className="py-3 px-2 flex justify-center items-center w-44">Action</th>
              </tr>
              <tbody>

              {Customer?.map((doc, index) => (
                <tr
                  key={index}
                  className="text-sm flex items-center h-14"
                  >
                  <td className="py-3 px-2 flex justify-center items-center w-10 h-full">{index + 1}</td>
                  <td className="py-3 px-2 flex justify-center items-center w-48 h-full">{doc?.name}</td>
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

// const Form = ({ close, Mode, id }) => {
//   const [customerData, setCustomerData] = useState([]);
//   const [dateBirth, setDateBirth] = useState();
//   const [aB, setAB] = useState();
//   const dispatch = useDispatch();
//   const { Customer, loading } = useSelector((state) => state.Customers);
//   // const { State } = useSelector((state) => state.State);
//   const [modal4Open, setModal4Open] = useState(false);
//   const [modal3Open, setModal3Open] = useState(false);
//   toastConfig({
//     duration: 2000,
//     zIndex: 2080,
//     className:
//       "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
//   });
//   const InputHandler = (e) => {
//     setCustomerData({
//       ...customerData,
//       [e.target.name]: e.target.value,
//     });
//   };
//   useEffect(() => {
//     setCustomerData({
//       ...customerData,
//       dob: dateBirth,
//       anndate: aB,
//       date: moment().format("YYYY-MM-DD"),
//       user: localStorage.getItem("user"),
//     });
//   }, [dateBirth, aB, customerData?.dob, customerData?.anndate]);
//   useEffect(() => {
//     if (id) {
//       const single = Customer.filter((doc) => doc._id === id);
//       setCustomerData(single[0]);
//       setDateBirth(moment(single[0]?.dob).format("YYYY-MM-DD"));
//       setAB(moment(single[0]?.anndate).format("YYYY-MM-DD"));
//     }
//     dispatch(fetchAllState());
//   }, []);

//   const save = () => {
//     dispatch(createCustomer(customerData)).then((res) => {
//       toast(res?.payload?.message);
//       dispatch(fetchAllCustomers());
//       close();
//     });
//   };

//   const update = () => {
//     dispatch(updateCustomer(customerData)).then((res) => {
//       toast(res?.payload?.message);
//       dispatch(fetchAllCustomers());
//       close();
//     });
//   };

//   const confirm1 = () => {
//     confirmDialog({
//       message: "Are you sure you want to save ?",
//       header: "Confirmation",
//       icon: <BiInfoCircle size={20} />,
//       defaultFocus: "accept",
//       acceptClassName: "bg-cyan-500 p-3 text-white",
//       rejectClassName: "p-3 mr-3",
//       accept: save,
//     });
//   };

//   const confirm2 = () => {
//     confirmDialog({
//       message: "Are you sure you want to update ?",
//       header: "Confirmation",
//       icon: <BiInfoCircle size={20} />,
//       defaultFocus: "accept",
//       acceptClassName: "bg-cyan-500 p-3 text-white",
//       rejectClassName: "p-3 mr-3",
//       accept: update,
//     });
//   };

//   return (
//     <>
//       {loading && <Loading />}
//       <ConfirmDialog />
//       <div className="p-3 z-50 bg-white relative overflow-hidden">
//         <form className="mb-14 grid md:grid-cols-2 gap-3">
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">
//               Party Name<span className="text-red-500 text-3x1">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Party  Name"
//               name="name"
//               value={customerData?.name}
//               onChange={InputHandler}
//               required
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">
//               Enter Address<span className="text-red-500 text-3x1">*</span>
//             </label>
//             <input
//               type="text"
//               name="address"
//               value={customerData?.address}
//               onChange={InputHandler}
//               placeholder="Address"
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">
//               Enter State<span className="text-red-500 text-3x1">*</span>
//             </label>
//             <select
//               className="outline outline-1 rounded-md px-2 py-3 text-sm"
//               value={customerData?.state}
//               name="state"
//               onChange={InputHandler}
//             >
//               <option selected disabled>
//                 --Select State--
//               </option>
//               {state.map((doc, index) => (
//                 <option key={index} value={doc}>
//                   {doc}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">
//               Enter City<span className="text-red-500 text-3x1">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter City"
//               name="city"
//               value={customerData?.city}
//               onChange={InputHandler}
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">
//               Enter Pin Code<span className="text-red-500 text-3x1">*</span>
//             </label>
//             <input
//               type="tel"
//               placeholder="Enter Pin Code"
//               name="pincode"
//               value={customerData?.pincode}
//               onChange={InputHandler}
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">
//               Enter Mobile no. <span className="text-red-500 text-3x1">*</span>
//             </label>
//             <input
//               type="tel"
//               name="mobile"
//               value={customerData?.mobile}
//               onChange={InputHandler}
//               placeholder="Enter Mobile no."
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">Enter Phone no.</label>
//             <input
//               type="tel"
//               placeholder="Party  Name"
//               name="phone"
//               value={customerData?.phone}
//               onChange={InputHandler}
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">Enter Email Id</label>
//             <input
//               type="email"
//               placeholder="Party  Name"
//               name="email"
//               value={customerData?.email}
//               onChange={InputHandler}
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">Enter PAN No.</label>
//             <input
//               type="text"
//               placeholder="Enter PAN Number"
//               name="pan"
//               value={customerData?.pan}
//               onChange={InputHandler}
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">Enter GST no.</label>
//             <input
//               type="text"
//               placeholder="Party  Name"
//               name="gst"
//               value={customerData?.gst}
//               onChange={InputHandler}
//               className="text-sm py-3 px-3 outline outline-1 rounded-md"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1 ">Enter DOB</label>
//             <input
//               type="date"
//               name="dob"
//               value={dateBirth}
//               onChange={(e) =>
//                 setDateBirth(moment(e.target.value).format("YYYY-MM-DD"))
//               }
//               placeholder="Enter Date Of Birth"
//               className="text-sm py-3 px-3 outline outline-1 rounded-md w-full"
//             />
//           </div>
//           <div className="grid grid-cols-1">
//             <label className="py-1">Enter Anniversary Date</label>
//             <input
//               type="date"
//               name="anndate"
//               value={aB}
//               onChange={(e) =>
//                 setAB(moment(e.target.value).format("YYYY-MM-DD"))
//               }
//               placeholder="Enter Date Of Birth"
//               className="text-sm py-3 px-3 outline outline-1 rounded-md w-full"
//             />
//           </div>
//         </form>
//         <div className="z-50 fixed md:absolute bottom-0 left-0 right-0 bg-white flex justify-end gap-4 py-3 px-5 border-t-2">
//           {Mode === "save" ? (
//             <>
//               <RippleButton
//                 type="button"
//                 disabled={
//                   customerData?.name &&
//                   customerData?.address &&
//                   customerData?.state &&
//                   customerData?.city &&
//                   customerData?.mobile &&
//                   customerData?.pincode
//                     ? false
//                     : true
//                 }
//                 className="py-2 px-4 bg-green-500  font-semibold rounded-md uppercase text-sm disabled:cursor-not-allowed disabled:bg-green-700 text-white"
//                 open={confirm1}
//                 name={"save"}
//               />
//             </>
//           ) : (
//             <>
//               <RippleButton
//                 type="button"
//                 className="py-2 px-4 bg-blue-500 font-semibold rounded-md uppercase text-sm text-white"
//                 open={confirm2}
//                 name={"update"}
//               />
//             </>
//           )}
//           <button
//             type="button"
//             onClick={close}
//             className="py-2 px-4 bg-red-500 font-semibold uppercase rounded-md  text-sm text-white"
//           >
//             close
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

export default CreateCustomer;

// export const  = {Form}:
