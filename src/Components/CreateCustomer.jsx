import { Eye, FilePenLine, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../Store/Slice/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import toast, { Toast, toastConfig } from "react-simple-toasts";
import moment from "moment";
import { fetchAllState } from "../Store/Slice/StateSlice";
function CreateCustomer() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openMode, setOpenMode] = useState("");
  const [openView, setOpenView] = useState(false);
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const { Customer, error, loading } = useSelector((state) => state.Customers);

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
      {openMenu && (
        <Form close={() => setOpenMenu(false)} Mode={openMode} id={id} />
      )}
      {openView && <View close={() => setOpenView(false)} id={id} />}

      {loading && <Loading />}

      <div className="lg:flex justify-center">
        <div className="">
          <button
            className="text-base font-semibold bg-blue-500 py-5 px-3 rounded-md m-3 ml-2 md:mx-5  uppercase text-white w-44 shadow-gray-400 shadow-md"
            onClick={CreateBtn}
          >
            Add customer
          </button>

          <div className="relative overflow-auto lg:overflow-x-hidden mx-2 md:mx-5 max-h-96 bg-white shadow-gray-400 shadow-md">
            <table className="table-fixed">
              <tr className="text-sm bg-gray-200 flex items-center border-gray-600 border">
                <th className="py-3 px-2 text-start w-48">Party Name</th>
                <th className="py-3 px-2 text-start w-48 truncate">Address</th>
                <th className="py-3 px-2 text-start w-36 ">Phone no.</th>
                <th className="py-3 px-2 text-start w-36 ">mobile no.</th>
                <th className="py-3 px-2 text-start w-36 ">Email</th>
                <th className="py-3 px-2 text-start w-36">Gst no.</th>
                <th className="py-3 px-2 text-start w-32">Date</th>
                <th className="py-3 px-2 text-start w-32">City</th>
                <th className="py-3 px-2 text-start w-48">Action</th>
              </tr>
              {Customer?.map((doc, index) => (
                <tr
                  key={index}
                  className="text-sm flex items-center border-gray-400 border"
                >
                  <td className="py-3 px-2 text-start w-48">{doc?.name}</td>
                  <td className="py-3 px-2 text-start w-48 truncate">
                    {doc?.address}
                  </td>
                  <td className="py-3 px-2 text-start w-36 ">{doc?.phone}</td>
                  <td className="py-3 px-2 text-start w-36 ">{doc?.mobile}</td>
                  <td className="py-3 px-2 text-start w-36 truncate">
                    {doc?.email}
                  </td>
                  <td className="py-3 px-2 text-start w-36 truncate">
                    {doc?.gst}
                  </td>
                  <td className="py-3 px-2 text-start w-32">
                    {moment(doc?.date).format("DD-MM-YYYY")}
                  </td>
                  <td className="py-3 px-2 text-start w-32">{doc?.city}</td>
                  <td className="flex gap-2 py-3 justify-start w-40">
                    <button
                      className="bg-blue-500 duration-300 text-white hover:bg-blue-600 w-10 h-10 rounded-full px-3"
                      onClick={() => {
                        setOpenMode("update");
                        setOpenMenu(true);
                        setId(doc?._id);
                      }}
                    >
                      <FilePenLine size={18} />
                    </button>
                    <button
                      className="bg-red-500 duration-300 text-white hover:bg-red-600 w-10 h-10 rounded-full px-3"
                      onClick={() => {
                        dispatch(deleteCustomer(doc?._id)).then((res) => {
                          console.log(res);
                          toast(res?.payload?.message);
                          dispatch(fetchAllCustomers());
                        });
                      }}
                    >
                      <Trash size={18} />
                    </button>
                    <button
                      className="bg-yellow-500 duration-300  hover:bg-yellow-600 w-10 h-10 rounded-full px-3"
                      onClick={() => {
                        setOpenView(true);
                        setId(doc?._id);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const Form = ({ close, Mode, id }) => {
  const [customerData, setCustomerData] = useState([]);
  const [dateBirth, setDateBirth] = useState();
  const [aB, setAB] = useState();
  const dispatch = useDispatch();
  const { Customer, loading } = useSelector((state) => state.Customers);
  const { State } = useSelector((state) => state.State);
  toastConfig({
    duration: 2000,
    zIndex: 1000,
    className:
      "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
  });
  const InputHandler = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    setCustomerData({
      ...customerData,
      dob: dateBirth,
      anndate: aB,
      date: moment().format("YYYY-MM-DD"),
      user: localStorage.getItem("user"),
    });
  }, [dateBirth, aB, customerData?.dob, customerData?.anndate]);
  useEffect(() => {
    if (id) {
      const single = Customer.filter((doc) => doc._id === id);
      setCustomerData(single[0]);
      setDateBirth(moment(single[0]?.dob).format("YYYY-MM-DD"));
      setAB(moment(single[0]?.anndate).format("YYYY-MM-DD"));
    }
    dispatch(fetchAllState());
  }, []);

  const save = () => {
    dispatch(createCustomer(customerData)).then((res) => {
      toast(res?.payload?.message);
      dispatch(fetchAllCustomers());
      close();
    });
  };

  const update = () => {
    dispatch(updateCustomer(customerData)).then((res) => {
      toast(res?.payload?.message);
      dispatch(fetchAllCustomers());
      close();
    });
  };

  return (
    <>
      <div
        className="absolute left-0 right-0 bottom-0 top-0 z-50"
        style={{ backgroundColor: "rgb(0,0,0,0.65)" }}
      />
      {loading && <Loading />}
      <div
        div
        className="absolute top-0 bottom-0 right-0 left-0 z-50 max-w-[800px] m-auto md:mt-16"
      >
        <div className="p-3 z-50 bg-white md:shadow-lg md:rounded-md relative overflow-hidden">
          <h1>{Mode === "save" ? "Create" : "Update"} Form</h1>
          <form className="mb-14 grid md:grid-cols-2 gap-3">
            <div className="grid grid-cols-1">
              <label className="py-1 ">Party Name</label>
              <input
                type="text"
                placeholder="Party  Name"
                name="name"
                value={customerData?.name}
                onChange={InputHandler}
                required
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter Address</label>
              <input
                type="text"
                name="address"
                value={customerData?.address}
                onChange={InputHandler}
                placeholder="Address"
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter State</label>
              <select
                className="outline outline-1 rounded-md px-2 py-3 text-sm"
                value={customerData?.state}
                name="state"
                onChange={InputHandler}
              >
                <option selected disabled>
                  --Select State--
                </option>
                {State.map((doc, index) => (
                  <option key={index} value={doc.state}>
                    {doc.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter City</label>
              <input
                type="text"
                placeholder="Enter City"
                name="city"
                value={customerData?.city}
                onChange={InputHandler}
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter Pin Code</label>
              <input
                type="tel"
                placeholder="Enter Pin Code"
                name="pincode"
                value={customerData?.pincode}
                onChange={InputHandler}
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter Mobile no.</label>
              <input
                type="tel"
                name="mobile"
                value={customerData?.mobile}
                onChange={InputHandler}
                placeholder="Enter Mobile no."
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter Phone no.</label>
              <input
                type="tel"
                placeholder="Party  Name"
                name="phone"
                value={customerData?.phone}
                onChange={InputHandler}
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter Email Id</label>
              <input
                type="email"
                placeholder="Party  Name"
                name="email"
                value={customerData?.email}
                onChange={InputHandler}
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter PAN No.</label>
              <input
                type="text"
                placeholder="Enter PAN Number"
                name="pan"
                value={customerData?.pan}
                onChange={InputHandler}
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter GST no.</label>
              <input
                type="text"
                placeholder="Party  Name"
                name="gst"
                value={customerData?.gst}
                onChange={InputHandler}
                className="text-sm py-3 px-3 outline outline-1 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1 ">Enter DOB</label>
              <input
                type="date"
                name="dob"
                value={dateBirth}
                onChange={(e) =>
                  setDateBirth(moment(e.target.value).format("YYYY-MM-DD"))
                }
                placeholder="Enter Date Of Birth"
                className="text-sm py-3 px-3 outline outline-1 rounded-md w-full"
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="py-1">Enter Anniversary Date</label>
              <input
                type="date"
                name="anndate"
                value={aB}
                onChange={(e) =>
                  setAB(moment(e.target.value).format("YYYY-MM-DD"))
                }
                placeholder="Enter Date Of Birth"
                className="text-sm py-3 px-3 outline outline-1 rounded-md w-full"
              />
            </div>
          </form>
          <div className="z-50 fixed md:absolute bottom-0 left-0 right-0 bg-white flex justify-end gap-4 py-3 px-5 border-t-2">
            {Mode === "save" ? (
              <button
                type="button"
                className="py-2 px-4 bg-green-500 font-semibold rounded-md uppercase text-sm"
                onClick={save}
              >
                save
              </button>
            ) : (
              <button
                type="button"
                className="py-2 px-4 bg-blue-500 font-semibold rounded-md uppercase text-sm"
                onClick={update}
              >
                Update
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="py-2 px-4 bg-red-500 font-semibold uppercase rounded-md  text-sm"
            >
              close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
const View = ({ close, id }) => {
  const [customerData, setCustomerData] = useState([]);
  const { Customer, error, loading } = useSelector((state) => state.Customers);
  useEffect(() => {
    if (id) {
      const single = Customer.filter((doc) => doc._id === id);
      setCustomerData(single[0]);
    }
  }, []);
  return (
    <>
      {loading && <Loading />}

      <div
        className="absolute top-0 bottom-0 left-0 right-0 z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
        onClick={close}
      />
      <div className="w-96 h-2/4 p-5 rounded-md shadow-lg absolute top-0 bottom-0 left-0 right-0 m-auto bg-white z-50 ">
        <X className="absolute right-0 top-0" onClick={close} size={48} />
        <div className="flex items-center gap-3">
          <label className="text-sm">Party Name : </label>
          <span className="text-xs">{customerData.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">Party Name : </label>
          <span className="text-xs">Amit</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">Party Name : </label>
          <span className="text-xs">Amit</span>
        </div>
        <div className="absolute bottom-5 ">
          <button className="bg-blue-500 px-10 py-3 uppercase text-white rounded-md">
            Export
          </button>
        </div>
      </div>
    </>
  );
};
export default CreateCustomer;
