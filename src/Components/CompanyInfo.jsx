import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  fetchByUser,
  createCompany,
  updateCompany,
} from "../Store/Slice/CompanySlice";
import { fetchAllState } from "../Store/Slice/StateSlice";
import toast, { toastConfig } from "react-simple-toasts";
import {
  PiCamera,
  PiFloppyDisk,
  PiUpload,
  PiBuildings,
  PiInfoBold,
  PiCaretRight,
  PiCaretRightBold,
  PiYoutubeLogoFill,
  PiFacebookLogoFill,
  PiInstagramLogoFill,
  PiWhatsappLogoFill,
  PiMapPinAreaFill,
} from "react-icons/pi";
import { Button } from "primereact/button";
import { BiInfoCircle } from "react-icons/bi";
import Compressor from "compressorjs";
import { state } from "./TextUtilits";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
function CompanyInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const User = localStorage.getItem("user");
  const [buttonName, setButtonName] = useState("u");
  const [formData, setformData] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);

  const [modal2Open, setModal2Open] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);

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
        // setButtonName("s");
      } else {
        setformData(doc.payload);
        setSelectedImage(doc.payload.logo);
        setSelectedImage2(doc.payload.ownerimg)
        // setButtonName("u");
      }
    });
  }, [dispatch]);

  const formDataHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
      user: User,
    });
  };

  const onSubmit = () => {
    dispatch(createCompany({ ...formData, logo: selectedImage,ownerimg:selectedImage2 })).then(
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
    dispatch(updateCompany({ ...formData, logo: selectedImage,ownerimg:selectedImage2 })).then(
      (doc) => {
        if (!doc.error) {
          dispatch(fetchByUser());
          toast(doc.payload.message);
        }
      }
    );
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to save ?",
      header: "Confirmation",
      icon: <BiInfoCircle size={20} />,
      defaultFocus: "accept",
      acceptClassName: "bg-cyan-500 p-3 text-white",
      rejectClassName: "p-3 mr-3",
      accept: onSubmit,
    });
  };

  const confirm2 = () => {
    confirmDialog({
      message: "Are you sure you want to update ?",
      header: "Confirmation",
      icon: <BiInfoCircle size={20} />,
      defaultFocus: "accept",
      acceptClassName: "bg-cyan-500 p-3 text-white",
      rejectClassName: "p-3 mr-3",
      accept: onUpdate,
    });
  };

  const handleImageChange = async (event) => {
    const file = await handleImageUpload(event.target.files[0]);
    setSelectedImage(file);
  };

  const handleImageChange2 = async (event) => {
    const file = await handleImageUpload(event.target.files[0]);
    setSelectedImage2(file);
  };

  const handleImageUpload = (event) => {
    return new Promise((resolve, reject) => {
      const file = event; // Accessing the file from event

      try {
        new Compressor(file, {
          quality: 0.45,
          maxWidth: 500,
          resize: false,
          success: async (result) => {
            const base64String = await blobUrlToBase64(result);
            resolve(base64String);
            // You may set the base64 URL to state or perform other actions here
          },
          error(error) {
            console.error("Error compressing image:", error);
            reject(error);
          },
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        reject(error);
      }
    });
  };

  async function blobUrlToBase64(blob) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {/* <ConfirmDialog /> */}

      <div>
        <div className="w-full flex justify-center py-5">
          <div className="flex gap-5 justify-around items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveIndex(0)}
                className={`${
                  activeIndex === 0 ? "bg-cyan-500" : "bg-white"
                } border-2 border-cyan-500 w-14 h-14 rounded-full flex justify-center items-center`}
              >
                <PiBuildings
                  size={30}
                  color={activeIndex === 0 ? "#fff" : "#000"}
                />
              </button>
              <small>Company Info</small>
            </div>
            <hr className="w-36 border border-slate-400" />
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveIndex(1)}
                className={`${
                  activeIndex === 1 ? "bg-cyan-500" : "bg-white"
                } border-2 border-cyan-500 w-14 h-14 rounded-full flex justify-center items-center`}
              >
                <PiInfoBold
                  size={30}
                  color={activeIndex === 1 ? "#fff" : "#000"}
                />
              </button>
              <small>Owner Info</small>
            </div>
          </div>
        </div>
        {activeIndex === 0 && (
          <div className="w-full flex justify-center">
            <div
              className={`w-full md:w-[600px] px-8 m-3 rounded-md shadow-md shadow-slate-500 bg-white `}
            >
              <h1 className="text-lg font-bold text-center py-5">
                Company Info
              </h1>
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
                      className="w-24 h-24 rounded-full shadow-gray-500 shadow-md border"
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
                    <PiCamera size={20} />
                  </label>
                </div>
                <div className="flex flex-col my-1 w-full">
                  <label className="">Company Name</label>
                  <input
                    placeholder="Enter company name"
                    name="name"
                    value={formData?.name}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col my-1">
                <label className="">Address </label>
                <input
                  placeholder="Enter address"
                  name="address"
                  value={formData?.address}
                  onChange={formDataHandler}
                  className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-3 my-1">
                <div className="flex flex-col w-full">
                  <label className="">State </label>
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
                    {state.map((doc, index) => (
                      <option key={index} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="">City </label>
                  <input
                    placeholder="Enter address"
                    name="city"
                    value={formData?.city}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="">Pin code </label>
                  <input
                    placeholder="Enter address"
                    name="pincode"
                    value={formData?.pincode}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 my-1">
                <div className="flex flex-col w-full">
                  <label className="">Office Number </label>
                  <input
                    placeholder="Enter address"
                    name="office"
                    value={formData?.office}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="">Mobile Number </label>
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
                <label className="">Email </label>
                <input
                  type="email"
                  placeholder="Enter address"
                  name="email"
                  value={formData?.email}
                  onChange={formDataHandler}
                  className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3 my-1">
                <div className="flex flex-col w-full">
                  <label className="">PAN Number </label>
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
                  <label className="">GST Number </label>
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
              <div className="flex justify-end w-full py-5">
                <Button
                  onClick={() => setActiveIndex(1)}
                  label="Next"
                  className="btn flex items-center justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                ></Button>
              </div>
            </div>
          </div>
        )}
        {activeIndex === 1 && (
          <div className="flex justify-center">

          <div className="md:w-[600px] bg-white p-5 mx-3 rounded-md shadow-md shadow-slate-500">
            <div className="flex flex-col items-center w-full"> 
              <div className="relative w-24 h-24">
                <input
                  id="logoimg"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  name="logo"
                  onChange={handleImageChange2}
                  className="hidden"
                />
                {selectedImage2 ? (
                  <img
                    src={selectedImage2}
                    className="w-24 h-24 rounded-full shadow-gray-500 shadow-md border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full shadow-gray-500 shadow-md border flex justify-center items-center">
                    Logo
                  </div>
                )}
                <label
                  htmlFor="logoimg"
                  className="absolute bottom-0 right-0 border-slate-500 border rounded-full p-1 bg-white"
                >
                  <PiCamera size={20} strokeWidth={2} />
                </label>
              </div>
              <div className="flex flex-col my-1 w-full">
                <label className="">Owner Name</label>
                <input
                  placeholder="Enter name"
                  name="owner"
                  value={formData?.owner}
                  onChange={formDataHandler}
                  className="border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                />
              </div>
              <div className="flex items-center my-3 w-full gap-3">
                <label className="">
                  <PiYoutubeLogoFill color="red" size={40} />
                </label>
                <input
                  placeholder="Enter Link"
                  name="youtube"
                  value={formData?.youtube}
                  onChange={formDataHandler}
                  className="w-full border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                />
              </div>
              <div className="flex items-center gap-3 my-3 w-full">
                <label className="">
                  <PiFacebookLogoFill size={40} color="blue" />
                </label>
                <input
                  placeholder="Enter link"
                  name="facebook"
                  value={formData?.facebook}
                  onChange={formDataHandler}
                  className="w-full border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                />
              </div>
              <div className="flex items-center gap-3 my-3 w-full">
                <label className="">
                  <PiInstagramLogoFill size={40} className="text-orange-500" />
                </label>
                <input
                  type="url"
                  placeholder="Enter link"
                  name="insta"
                  value={formData?.insta}
                  onChange={formDataHandler}
                  className="w-full border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                />
              </div>
              <div className="flex items-center gap-3 my-3 w-full">
                <label className="">
                  <PiWhatsappLogoFill size={40} className="text-green-500" />
                </label>

                <InputNumber
                  type="url"
                  useGrouping={false}
                  placeholder="Enter number"
                  name="whatsapp"
                  value={formData?.whatsapp}
                  onChange={(e) => formDataHandler(e.originalEvent)}
                  inputClassName=" py-3 px-2 w-full "
                  className="w-full border shadow-slate-200 shadow-md  rounded-md"
                />
              </div>
              <div className="flex items-center gap-3 my-3 w-full">
                <label className="">
                  <PiMapPinAreaFill size={40} className="text-blue-800" />
                </label>

                <input
                  type="url"
                  useGrouping={false}
                  placeholder="Enter link"
                  name="map"
                  value={formData?.map}
                  onChange={formDataHandler}
                 className="w-full border shadow-slate-200 shadow-md py-3 px-2 rounded-md"
                />
              </div>
            </div>
            <div className="mt-10 ">
              {buttonName === "s" ? (
                <div className="flex justify-between px-3">
                  <Button
                    onClick={() => setActiveIndex(0)}
                    className="flex justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={confirm1}
                    className="flex justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                  >
                    <PiFloppyDisk />
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between px-3">
                  <Button
                    onClick={() => setActiveIndex(0)}
                    className="btn flex justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={confirm2}
                    className="btn flex justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                  >
                    <PiUpload />
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>
            </div>
        )}
      </div>
    </>
  );
}

export default CompanyInfo;
