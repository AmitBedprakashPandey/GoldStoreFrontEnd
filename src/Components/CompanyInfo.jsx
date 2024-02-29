import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchByUser,
  createCompany,
  updateCompany,
} from "../Store/Slice/CompanySlice";
import { fetchAllState } from "../Store/Slice/StateSlice";
import toast, { toastConfig } from "react-simple-toasts";
import { Camera } from "lucide-react";
function CompanyInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const User = localStorage.getItem("user");
  const [buttonName, setButtonName] = useState("s");
  const [formData, setformData] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const { State } = useSelector((state) => state.State);
  toastConfig({
    duration: 2000,
    zIndex: 1000,
    className:
      "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
  });

  useEffect(() => {
    dispatch(fetchAllState());
    dispatch(fetchByUser(User)).then((doc) => {
      if (doc.payload.message) {
        setButtonName("s");
      } else {
        setformData(doc.payload);
        setSelectedImage(doc.payload.logo);
        setButtonName("u");
      }
    });
  }, []);

  const formDataHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
      user: User,
    });
  };

  const onSubmit = () => {
    dispatch(createCompany({ ...formData, logo: selectedImage })).then(
      (doc) => {
        if (!doc.error) {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      }
    );
  };

  const onUpdate = () => {
    dispatch(updateCompany({ ...formData, logo: selectedImage })).then(
      (doc) => {
        if (!doc.error) {
          toast(doc.payload.message);
        }
      }
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div
        className={`bg-sky-50 ${
          buttonName === "u"
            ? ""
            : "absolute top-0 bottom-0 right-0 left-0 z-50"
        } flex justify-center`}
      >
        {/* <div className="flex gap-28 relative mt-16">
          <div className="flex flex-col items-center z-50">
            <div className="bg-gray-500 w-16 h-16 rounded-full flex justify-center items-center text-2xl text-white font-bold shadow-gray-400 shadow-md">
              1
            </div>
            <label className="py-1 font-semibold">Logo</label>
           
          </div>
          <div className="flex flex-col items-center z-50">
            <div className="bg-gray-500 w-16 h-16 rounded-full flex justify-center items-center text-2xl text-white font-bold shadow-gray-400 shadow-md">
              1
            </div>
            <label className="py-1 font-semibold capitalize">Company Info</label>
          </div>
          <div className="flex flex-col items-center z-50">
            <div className="bg-gray-500 w-16 h-16 rounded-full flex justify-center items-center text-2xl text-white font-bold shadow-gray-400 shadow-md">
              1
            </div>
            <label className="py-1 font-semibold capitalize">signature</label>
          </div>
        </div> */}
        <div
          className={`w-[380px] md:w-[600px] border-gray-300 border absolute top-15 shadow-gray-400 shadow-lg rounded-lg  p-5 bg-white h-auto `}
        >
          <h1 className="text-3xl font-bold text-center py-5">Company Info</h1>
          <div className="flex flex-col gap-5 items-center">
            <div className="relative">
              <input
                id="logoimg"
                type="file"
                accept=".png, .jpg, .jpeg"
                name="logo"
                onChange={handleImageChange}
                className="hidden"
              />
              {selectedImage ? (
                <img
                  src={selectedImage}
                  width={150}
                  className="rounded-full shadow-gray-500 shadow-md border"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full shadow-gray-500 shadow-md border flex justify-center items-center">
                  Logo
                </div>
              )}
              <label
                htmlFor="logoimg"
                className="absolute bottom-0 right-0 border-black border rounded-full p-2 bg-white"
              >
                <Camera size={20} />
              </label>
            </div>
            <div className="flex flex-col my-2 w-full">
              <label className="py-1">Company Name</label>
              <input
                placeholder="Enter company name"
                name="name"
                value={formData?.name}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col my-2">
            <label className="py-1">Address </label>
            <input
              placeholder="Enter address"
              name="address"
              value={formData?.address}
              onChange={formDataHandler}
              className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-3 my-2">
            <div className="flex flex-col w-full">
              <label className="py-1">State </label>
              <select
                placeholder="Enter address"
                name="state"
                value={formData?.state}
                onChange={formDataHandler}
                className="w-full border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              >
                <option selected disabled>
                  --select State--
                </option>
                {State.map((doc, index) => (
                  <option key={index} value={doc.state}>
                    {doc.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="py-1">City </label>
              <input
                placeholder="Enter address"
                name="city"
                value={formData?.city}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="py-1">Pin code </label>
              <input
                placeholder="Enter address"
                name="pincode"
                value={formData?.pincode}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 my-2">
            <div className="flex flex-col w-full">
              <label className="py-1">Office Number </label>
              <input
                placeholder="Enter address"
                name="office"
                value={formData?.office}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="py-1">Mobile Number </label>
              <input
                placeholder="Enter address"
                name="mobile"
                value={formData?.mobile}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="py-1">Email </label>
            <input
              type="email"
              placeholder="Enter address"
              name="email"
              value={formData?.email}
              onChange={formDataHandler}
              className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3 my-2">
            <div className="flex flex-col w-full">
              <label className="py-1">PAN Number </label>
              <input
                type="text"
                placeholder="Enter address"
                name="pan"
                value={formData?.pan}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="py-1">GST Number </label>
              <input
                type="text"
                placeholder="Enter address"
                name="gst"
                value={formData?.gst}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
          </div>
          {/* <div className="flex gap-3 my-2">
            <div className="flex flex-col w-full">
              <label className="py-1">Signature </label>
              <input
                type="file"
                accept=".png"
                placeholder="Enter address"
                name="signa"
                value={formData?.signa}
                onChange={formDataHandler}
                className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
              />
            </div>
          </div> */}
          <div className="mt-10 ">
            {buttonName === "s" ? (
              <button
                onClick={onSubmit}
                className="w-full capitalize bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
              >
                Save
              </button>
            ) : (
              <button
                onClick={onUpdate}
                className="w-full capitalize bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
              >
                update
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyInfo;
