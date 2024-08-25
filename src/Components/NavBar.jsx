import {
  FaUserCircle,
  FaCopyright,
  FaHome,
  FaPowerOff,
  FaBars,
} from "react-icons/fa";
import { Avatar, Drawer, Collapse } from "antd";
import { confirmDialog ,ConfirmDialog} from "primereact/confirmdialog";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/Slice/AuthSlice";
import { fetchByUser } from "../Store/Slice/CompanySlice";
import { fetchOneInvoicesNumber } from "../Store/Slice/InvoiceIdSlice";
import { fetchOneInvoiceNumberGst } from "../Store/Slice/InvoiceNumbergstSlice";

function NavBar() {
  const [open, setOpen] = useState(false);
  const { Company } = useSelector((state) => state.Company);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchByUser(localStorage.getItem("user")));
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [dispatch, navigate]);
  
  useEffect(() => {
    if (Company?._id) {
      dispatch(fetchOneInvoicesNumber(Company._id));
      dispatch(fetchOneInvoiceNumberGst(Company._id));
      document.title =  Company?.name
    }
  }, [Company, dispatch]);

  const logoutBtn = () => {
    dispatch(logout());
    navigate("/login");
  };

  const confirmLogout = () => {
    confirmDialog({
      closable: false,
      message: "Are you sure you want to logout?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "bg-cyan-500 px-6 py-3 text-white",
      rejectClassName: "py-3 px-6 mr-3 border",
      accept: logoutBtn,
    });
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const isActive = (path) => location.pathname === path ? 'bg-yellow-200' : 'bg-white';

  const menuItems = [
    {
      key: "0",
      showArrow: false,
      label: (
        <div className="md:hidden h-auto p-3 flex flex-col items-center">
          <Avatar size={120} src={Company?.logo} icon={!Company?.logo && <FaUserCircle size={60} />} />
          <label className="font-bold uppercase italic py-3 text-2xl">
            {Company?.name}
          </label>
        </div>
      ),
    },
 
    {
      key: "2",
      label: "Master",
      children: (
        <ul className="text-base grid">
          {["/company", "/createcustomer", "/branch", "/bank", "/mode"].map((path, idx) => (
            <Link
              key={idx}
              to={path}
              onClick={onClose}
              className={`${isActive(path)} text-lg py-5 px-5 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer`}
            >
              {path.split('/').pop().replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
            </Link>
          ))}
        </ul>
      ),
    },
    {
      key: "3",
      label: "Enter Invoice",
      children: (
        <ul className="grid">
          {["/invoice", "/invoicegst"].map((path, idx) => (
            <Link
              key={idx}
              to={path}
              onClick={onClose}
              className={`${isActive(path)} text-lg px-5 py-5 hover:bg-gray-300 capitalize cursor-pointer`}
            >
              {path.split('/').pop().replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
            </Link>
          ))}
        </ul>
      ),
    },
    {
      key: "4",
      label: "Reports",
      children: (
        <ul className="grid">
          {["/quotation", "/quotationwithoutgst"].map((path, idx) => (
            <Link
              key={idx}
              to={path}
              onClick={onClose}
              className={`${isActive(path)} text-lg px-5 py-5 hover:bg-gray-300 capitalize cursor-pointer`}
            >
              {path.split('/').pop().replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
            </Link>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
    <ConfirmDialog/>
      <div className="bg-yellow-500 py-3 px-5 lg:px-24 text-2xl flex justify-between items-center shadow-slate-400 shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="flex gap-3 items-center">
          <FaBars size={32} onClick={showDrawer} className="lg:hidden" />
          <img
            src={Company?.logo}
            className="w-8 h-8 md:w-16 md:h-10 lg:w-10 lg:h-10 overflow-hidden rounded-lg bg-cover bg-center"
          />
          <label className="uppercase font-bold text-sm md:text-lg lg:text-xl">
            {Company?.name}
          </label>
        </div>
        <div className="lg:hidden flex gap-5">
          <Link to="/">
            <FaHome />
          </Link>
          <button onClick={confirmLogout}>
            <FaPowerOff />
          </button>
        </div>
        <div className="hidden lg:block">
          <ul className="flex gap-10 items-center">
          <li key={'1'}>

          <Link to={'/'} className="dropdownbtn text-lg font-semibold p-2 hover:bg-yellow-600 duration-300">
                  Home
                </Link>
          </li>
            {menuItems.map(({ key, label,url, children }) => (
              
              <li key={key} className="relative">
                <button className="dropdownbtn text-lg font-semibold p-2 hover:bg-yellow-600 duration-300">
                  {label}
                </button>
                <div className="dropdown-menu overflow-hidden w-56 bg-white rounded-md duration-300 shadow-md absolute -left-16 z-50">
                  {children}
                </div>
              </li>
            ))}
            <li className="relative">
              <div className="dropdownbtn flex items-center gap-3 py-2">
                <FaUserCircle />
                <span className="text-base italic truncate">
                  {localStorage.getItem("user")}
                </span>
              </div>
              <div className="dropdown-menu overflow-hidden w-48 bg-white rounded-md duration-300 shadow-md absolute top-9 right-0 z-50">
                <button
                  type="button"
                  className="w-full flex items-center gap-3 text-start px-4 py-2 text-lg hover:bg-red-100 capitalize duration-300 cursor-pointer"
                  onClick={logoutBtn}
                >
                  <FaPowerOff /> Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Drawer
        closable={false}
        onClose={onClose}
        open={open}
        placement="left"
        style={{ padding: 0 }}
      >
        <Collapse
          items={menuItems}
          accordion
          bordered={false}
          className="bg-yellow-100 rounded-none p-0"
        />
        <div className="py-2 absolute bottom-0 left-0 right-0 flex justify-center items-center">
          copyright &nbsp;
         <strong>©</strong> &nbsp; 2024  &nbsp;  v0.1
        </div>
      </Drawer>
    </>
  );
}

export default NavBar;
