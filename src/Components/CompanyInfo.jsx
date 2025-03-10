import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { Avatar } from "primereact/avatar";
import Loading  from "./Loading";
import {
  fetchByUser,
  createCompany,
  updateCompany,
} from "../Store/Slice/CompanySlice";
import { fetchAllState } from "../Store/Slice/StateSlice";
import toast, { toastConfig } from "react-simple-toasts";
import { Steps } from "primereact/steps";
import {
  PiCamera,
  PiFloppyDisk,
  PiUpload,
  PiBuildings,
  PiInfoBold,
  PiYoutubeLogoFill,
  PiFacebookLogoFill,
  PiInstagramLogoFill,
  PiWhatsappLogoFill,
  PiMapPinAreaFill,
  PiSlideshow,
  PiTrash,
  PiPlus,
} from "react-icons/pi";
import { Button } from "primereact/button";
import { BiInfoCircle } from "react-icons/bi";
import Compressor from "compressorjs";
import { state } from "./TextUtilits";
import { InputNumber } from "primereact/inputnumber";

function CompanyInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Company, loading,error,message } = useSelector((state) => state.Company);
  const User = localStorage.getItem("user");
  const [buttonName, setButtonName] = useState("s");
  const [formData, setformData] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [bannerList, setBannerList] = useState([]);

  toastConfig({
    duration: 2000,
    zIndex: 1000,
    className:
      "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
  });

  const itemRenderer = (item, itemIndex) => {
    const isActiveItem = activeIndex === itemIndex;
    const backgroundColor = isActiveItem ? '#0079c1' : '#caccd1';
    const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

    return (
        <div className="flex flex-col items-center gap-1">
            <span
                className="inline-flex w-8 h-8 items-center justify-center z-1 p-2 rounded-full cursor-pointer"
                style={{ backgroundColor: backgroundColor, color: textColor}}
                onClick={() => setActiveIndex(itemIndex)}
                >
                <i>{item.icon} </i>
            </span>
            <small className="text-[8pt]">{item.label}</small>
        </div>
    );
};

  const items = [
    {
      icon:<PiBuildings size={20}/>,
        label: 'Company Info',
        template : (item) => itemRenderer(item,0)
    },
    {icon:<PiInfoBold size={20}/>,
        label: 'Founder Info',
        template : (item) => itemRenderer(item,1)
    },
    // {icon:<PiSlideshow size={20}/>,
    //     label: 'Banner',
    //     template : (item) => itemRenderer(item,2)
    // }
];

useLayoutEffect(()=>{
  dispatch(fetchAllState());
  dispatch(fetchByUser(User));  
},[dispatch])

  useEffect(() => {       
     if(!Company){
      setButtonName("s");
     }    
     else{
      setformData(Company);
      setSelectedImage(Company?.logo);
      setSelectedImage2(Company?.ownerimg);
      setBannerList(Company?.banner);
      setButtonName("u");
     }
    
  }, [Company]);

  const formDataHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
      user: User,
    });
  };

  const onSubmit = () => {
    dispatch(
      createCompany({
        ...formData,
        logo: selectedImage,
        ownerimg: selectedImage2,
        banner: bannerList,
      })
    ).then((doc) => {
      if (!doc.error) {
        setTimeout(() => {
          navigate("/crm");
        }, 2000);
      }
    });
  };

  const onUpdate = () => {
    dispatch(
      updateCompany({
        ...formData,
        logo: selectedImage,
        ownerimg: selectedImage2,
        banner: bannerList,
      })
    ).then((doc) => {
      if (!doc.error) {
        // dispatch(fetchByUser());
        toast(doc.payload.message);
      }
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

  const handleBannerImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let validFiles = [];

    selectedFiles.forEach((file) => {
      // Check if file size is under 500KB
      if (file.size <= 500 * 1024) {
        validFiles.push(file);
      } else {
        alert(
          `The file ${file.name} is larger than 500KB and will not be uploaded.`
        );
      }
    });

    if (validFiles.length + bannerList.length > 4) {
      alert("You can only upload up to 4 images in total.");
      return;
    }

    const compressAndConvertImages = async (files) => {
      const newImages = [];

      for (const file of files) {
        // Compress the image
        await new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.6, // Adjust the quality as needed
            success: async (compressedResult) => {
              // Convert the compressed image to Base64
              const base64Image = await blobUrlToBase64(compressedResult);

              newImages.push(base64Image);
              resolve();
            },
            error: (err) => {
              console.error(err);
              reject(err);
            },
          });
        });
      }

      setBannerList([...newImages]);
    };

    compressAndConvertImages(validFiles);
  };

  const deleteBanner = (indexBanner) => {
    const newArray = bannerList.filter((_, index) => index !== indexBanner);
    setBannerList(newArray);
  };
  

  return (
    <div className="h-screen bg-white">
      {/* <ConfirmDialog /> */}
      {loading && <Loading /> }

      <div className="flex flex-col items-center relative ">
        
        <div className="max-w-xl pt-3 w-full">
            <Steps model={items} activeIndex={activeIndex} readOnly={false} className="w-full" />
        </div>

        {activeIndex === 0 && (
          <div className="w-full flex justify-center">
            <div className={`max-w-lg w-full px-3`}>
              <h1 className="text-md uppercase font-semibold text-center py-5">
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
                      className="w-20 h-20 rounded-full shadow-gray-500 shadow border"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full shadow-gray-500 shadow-md border flex justify-center items-center">
                      Logo
                    </div>
                  )}
                  <label
                    htmlFor="logoimg"
                    className="absolute bottom-0 right-0 border-black/30 border rounded-full p-0.5 bg-white"
                  >
                    <PiCamera size={20} color="#52565e" />
                  </label>
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs">Company Name</label>
                  <input
                    placeholder="Enter company name"
                    name="name"
                    value={formData?.name}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 text-sm shadow py-2 px-2 rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col my-1">
                <label className="text-xs">Address </label>
                <input
                  placeholder="Enter address"
                  name="address"
                  value={formData?.address}
                  onChange={formDataHandler}
                  className="border shadow-slate-200 text-sm shadow py-2 px-2 rounded-md"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-3 my-1">
                <div className="flex flex-col w-full">
                  <label className="text-xs">State </label>
                  
                  <select
                    placeholder="Enter address"
                    name="state"
                    value={formData?.state}
                    onChange={formDataHandler}
                    className="w-full border shadow-slate-200 shadow py-1.5 px-2 rounded-md"
                  >
                    <option selected disabled>
                      --select State--
                    </option>
                    {state.map((doc, index) => (
                      <option key={index} value={doc}>
                        <small>{doc}</small>
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs">City </label>
                  <input
                    placeholder="Enter address"
                    name="city"
                    value={formData?.city}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 text-sm shadow py-1.5 px-2 rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs">Pin code </label>
                  <input
                    placeholder="Enter address"
                    name="pincode"
                    value={formData?.pincode}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 text-sm shadow py-1.5 px-2 rounded-md"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 my-1">
                <div className="flex flex-col w-full">
                  <label className="text-xs">Office Number </label>
                  <input
                    placeholder="Enter address"
                    name="office"
                    value={formData?.office}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 text-sm shadow py-1.5 px-2 rounded-md"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs">Mobile Number </label>
                  <input
                    placeholder="Enter address"
                    name="mobile"
                    value={formData?.mobile}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 text-sm shadow py-1.5 px-2 rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-xs">Email </label>
                <input
                  type="email"
                  placeholder="Enter address"
                  name="email"
                  value={formData?.email}
                  onChange={formDataHandler}
                  className="border shadow-slate-200 text-sm shadow py-1.5 px-2 rounded-md"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3 my-1">
                <div className="flex flex-col w-full">
                  <label className="text-xs">PAN Number </label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    name="pan"
                    value={formData?.pan}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 text-sm shadow py-1.5 px-2 rounded-md"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs">GST Number </label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    name="gst"
                    value={formData?.gst}
                    onChange={formDataHandler}
                    className="border shadow-slate-200 text-sm shadow py-1.5 px-2 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end w-full py-5">
                <Button
                  onClick={() => setActiveIndex(1)}
                  label="Next"
                  className="flex items-center justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-1.5 rounded-lg shadow-gray-400 shadow-md text-white font-semibold"
                ></Button>
              </div>
            </div>
          </div>
        )}

        {activeIndex === 1 && (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[600px] p-3 bg-white rounded-md">
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
                    <Avatar
                    shape="circle"
                      image={selectedImage2}                      
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
                    className="border shadow-slate-200 text-sm shadow py-2 px-2 rounded-md"
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
                    <PiInstagramLogoFill
                      size={40}
                      className="text-orange-500"
                    />
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
              <div className="flex justify-between w-full py-5">
                <Button
                  onClick={() => setActiveIndex(0)}
                  label="Back"
                  className="btn flex items-center justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                ></Button>
                {buttonName === "s" ? 
                <Button
                  // onClick={() => setActiveIndex(2)}
                  onClick={confirm1}
                  // label="Next"
                  label="SAVE"
                  className="btn flex items-center justify-center gap-3 capitalize hover:bg-green-800 duration-300 bg-green-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                ></Button> : 
                <Button
                  // onClick={() => setActiveIndex(2)}
                  onClick={confirm2}
                  // label="Next"
                  label="upload"
                  className="btn flex items-center justify-center gap-3 capitalize hover:bg-blue-800 duration-300 bg-blue-500 px-10 py-3 rounded-lg shadow-gray-400 shadow-md text-white font-bold"
                ></Button>              
              }
              </div>
            </div>
          </div>
        )}

        {/* {activeIndex === 2 && (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[600px] p-3 bg-white rounded-md shadow-md shadow-slate-500">
              <div className="w-full">
                <div className="w-full flex items-center relative">
                  <div className="grid">
                    <input
                      id="logoimg"
                      type="file"
                      accept=""
                      name="logo"
                      multiple
                      onChange={handleBannerImageChange}
                      disabled={bannerList.length >= 4}
                      className="hidden"
                    />
                    <label
                      htmlFor="logoimg"
                      className="flex justify-between px-4   items-center gap-2 bg-blue-500 hover:bg-blue-600 duration-300 text-white w-32 py-3 rounded-xl "
                    >
                      <PiPlus size={20} /> <p>Choose</p>
                    </label>
                    <small className="text-red-500 font-semibold py-3">
                      Select image max size 5000x2500px and max 4 images only
                      less then 500kb
                    </small>
                  </div>
                </div>

                <div
                  style={{ display: "grid", gap: "10px", marginTop: "20px" }}
                >
                  {bannerList.map((image, index) => (
                    <div key={index} className="relative">
                      <Button
                        onClick={() => deleteBanner(index)}
                        icon={<PiTrash />}
                        className="w-10 h-10 absolute top-0 right-0 text-white bg-red-500 rounded-full"
                      />
                      <img
                        key={index}
                        src={image}
                        alt={`uploaded-${index}`}
                        // width={100}
                        // height={100}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
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
        )} */}
      </div>
    </div>
  );
}

export default CompanyInfo;
