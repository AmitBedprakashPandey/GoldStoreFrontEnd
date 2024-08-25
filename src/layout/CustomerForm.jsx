import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCustomers,
  createCustomer,
  updateCustomer,
} from "../Store/Slice/CustomerSlice";
import { BiInfoCircle } from "react-icons/bi";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import Loading from "../Components/Loading";
import toast, { toastConfig } from "react-simple-toasts";
import moment from "moment";
import { fetchAllState } from "../Store/Slice/StateSlice";
import RippleButton from "../Components/RippleButton";
import { state } from "../Components/TextUtilits";

export default function Form({ close, Mode, id }) {
  const [customerData, setCustomerData] = useState({});
  const [dateBirth, setDateBirth] = useState("");
  const [aB, setAB] = useState("");
  const dispatch = useDispatch();
  const { Customer, loading } = useSelector((state) => state.Customers);

  useEffect(() => {
    if (id) {
      const singleCustomer = Customer.find((doc) => doc._id === id);
      if (singleCustomer) {
        setCustomerData(singleCustomer);
        setDateBirth(moment(singleCustomer.dob).format("YYYY-MM-DD"));
        setAB(moment(singleCustomer.anndate).format("YYYY-MM-DD"));
      }
    }
    dispatch(fetchAllState());
  }, [id, Customer, dispatch]);

  useEffect(() => {
    setCustomerData((prevData) => ({
      ...prevData,
      dob: dateBirth,
      anndate: aB,
      date: moment().format("YYYY-MM-DD"),
      user: localStorage.getItem("user"),
    }));
  }, [dateBirth, aB]);

  const handleAction = async (action) => {
    const actionDispatch =
      action === "save" ? createCustomer(customerData) : updateCustomer(customerData);

    try {
      const result = await dispatch(actionDispatch).unwrap();
      toast(result.message);
      dispatch(fetchAllCustomers());
    } catch (error) {
      toast("An error occurred");
    }
  };

  const confirmAction = (action) => {
    confirmDialog({
      message: `Are you sure you want to ${action}?`,
      header: "Confirmation",
      icon: <BiInfoCircle size={20} />,
      defaultFocus: "accept",
      acceptClassName: "bg-cyan-500 p-3 text-white",
      rejectClassName: "p-3 mr-3",
      accept: () => handleAction(action),
    });
  };

  return (
    <>
      {loading && <Loading />}
      <ConfirmDialog />
      <div className="p-3 z-40 bg-white relative overflow-hidden">
        <form className="mb-14 grid md:grid-cols-2 gap-3">
          {[
            { label: "Party Name", name: "name", type: "text", required: true },
            { label: "Enter Address", name: "address", type: "text" },
            { label: "Enter State", name: "state", type: "select", options: state },
            { label: "Enter City", name: "city", type: "text" },
            { label: "Enter Pin Code", name: "pincode", type: "tel",required: true  },
            { label: "Enter Mobile no.", name: "mobile", type: "tel", required: true },
            { label: "Enter Phone no.", name: "phone", type: "tel" },
            { label: "Enter Email Id", name: "email", type: "email" },
            { label: "Enter PAN No.", name: "pan", type: "text" },
            { label: "Enter GST no.", name: "gst", type: "text" },
            { label: "Enter DOB", name: "dob", type: "date", value: dateBirth, onChange: setDateBirth },
            { label: "Enter Anniversary Date", name: "anndate", type: "date", value: aB, onChange: setAB },
          ].map((field, index) => (
            <div key={index} className="grid grid-cols-1">
              <label className="py-1">
                {field.label}
                {field.required && <span className="text-red-500 text-3x1">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={customerData[field.name] || ""}
                  onChange={(e) => setCustomerData({ ...customerData, [e.target.name]: e.target.value })}
                  className="outline outline-1 rounded-md px-2 py-3 text-sm"
                >
                  <option value="" disabled>
                    --Select State--
                  </option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value || customerData[field.name] || ""}
                  onChange={(e) => (field.onChange ? field.onChange(e.target.value) : setCustomerData({ ...customerData, [e.target.name]: e.target.value }))}
                  placeholder={field.label}
                  className="text-sm py-3 px-3 outline outline-1 rounded-md"
                  required={field.required}
                />
              )}
            </div>
          ))}
        </form>
        <div className="z-50 fixed md:absolute bottom-0 left-0 right-0 bg-white flex justify-end gap-4 py-3 px-5 border-t-2">
          {Mode === "save" ? (
            <RippleButton
              type="button"
              disabled={!customerData.name || !customerData.address || !customerData.state || !customerData.city || !customerData.mobile || !customerData.pincode}
              className="py-2 px-4 bg-green-500 font-semibold rounded-md uppercase text-sm disabled:cursor-not-allowed disabled:bg-green-700 text-white"
              open={() => confirmAction("save")}
              name="save"
            />
          ) : (
            <RippleButton
              type="button"
              className="py-2 px-4 bg-blue-500 font-semibold rounded-md uppercase text-sm text-white"
              open={() => confirmAction("update")}
              name="update"
            />
          )}
          <button
            type="button"
            onClick={close}
            className="py-2 px-4 bg-red-500 font-semibold uppercase rounded-md text-sm text-white"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
