import { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "../Components/NavBar";
import { Outlet } from "react-router-dom";
import { fetchByUser } from "../Store/Slice/CompanySlice";
import { fetchAllCustomers } from "../Store/Slice/CustomerSlice";
import { fetchAllPyBank } from "../Store/Slice/PayBankSlice";
import { fetchAllBranch } from "../Store/Slice/BranchSlice";
import { fetchAllPyMode } from "../Store/Slice/PayModeSlice";
import { useDispatch } from "react-redux";
function HomePage(params) {
  const dispatch = useDispatch();

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
    <div className="relative bg-slate-200 w-full h-screen">
      <Navbar />
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}
export default HomePage;
