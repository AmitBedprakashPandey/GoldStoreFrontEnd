import { useLayoutEffect } from "react";
import Navbar from "../Components/NavBar";
import BgCover from "../asstes/jewellery-background-4608-x-2592-0kq8mwdpc8xkyqna.webp";
import { Outlet, useLocation } from "react-router-dom";
import { fetchByUser } from "../Store/Slice/CompanySlice";
import { fetchAllCustomers } from "../Store/Slice/CustomerSlice";
import { fetchAllPyBank } from "../Store/Slice/PayBankSlice";
import { fetchAllBranch } from "../Store/Slice/BranchSlice";
import { fetchAllPyMode } from "../Store/Slice/PayModeSlice";
import { useDispatch } from "react-redux";
function HomePage() {
  const dispatch = useDispatch();
  const params = useLocation();
  const handleFetchData = () => {
    const user = localStorage.getItem("user");
    dispatch(fetchByUser(user));
    dispatch(fetchAllCustomers());
    dispatch(fetchAllPyBank());
    dispatch(fetchAllBranch());
    dispatch(fetchAllPyMode());
  };

  useLayoutEffect(() => {
    handleFetchData(); // Dispatch the actions on layout effect, if needed
  }, []);


  return (
    <div
      className="relative bg-slate-200 w-screen overflow-x-hidden h-screen bg-center bg bg-cover"
      style={{ backgroundImage: `url(${BgCover})` }}
    >
      <Navbar />

      <div
        className={`w-full h-full ${
          params?.pathname === "/crm" ? "" : "bg-white"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
export default HomePage;
