import {
  PiUserCircle,
  PiCopyright,
  PiHouseDuotone,
  PiPowerBold,
  PiListBold,
  PiCaretDownBold,
} from "react-icons/pi";
import { Sidebar } from "primereact/sidebar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/Slice/AuthSlice";
import { Avatar } from "primereact/avatar";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";

function NavBar() {
  const [open, setOpen] = useState(false);
  const { Company } = useSelector((state) => state.Company);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/crm/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (Company?.name) {
      document.title = Company.name.toUpperCase();
    }
  }, [Company, dispatch]);

  const logoutBtn = useCallback(() => {
    dispatch(logout());
    navigate("/crm/login");
  }, [dispatch, navigate]);

  const confirmLogout = useCallback(() => {
    confirmDialog({
      closable: false,
      message: "Are you sure you want to logout?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "bg-blue-500 px-6 py-3 text-white",
      rejectClassName: "py-3 px-6 mr-3 border",
      accept: logoutBtn,
    });
  }, [logoutBtn]);
  
  const customeHeader = () => {
    return (
      <div className="flex items-center gap-2 ">
        <Avatar image={Company?.logo} shape="circle" />
        <span className="font-bold">{Company?.name}</span>
      </div>
    );
  };

  const items = [
    {
      label: "Master",
      icon: "pi pi-file",
      items: [
        { label: "Company Info", command: () => { navigate("master/company"); setOpen(false); } },
        { label: "Customer", command: () => { navigate("master/createcustomer"); setOpen(false); } },
        { label: "Branch", command: () => { navigate("master/branch"); setOpen(false); } },
        { label: "Bank", command: () => { navigate("master/bank"); setOpen(false); } },
        { label: "Mode", command: () => { navigate("master/mode"); setOpen(false); } },
        { label: "Live Price", command: () => { navigate("master/liveprice"); setOpen(false); } },
      ],
    },
    {
      label: "Invoice",
      icon: "pi pi-cloud",
      items: [
        {
          label: "Invoice ( Non GST )",
          command: () => { navigate("invoice/invoice"); setOpen(false); },
        },
        {
          label: "Invoice ( GST )",
          command: () => { navigate("invoice/invoicegst"); setOpen(false); },
        },
      ],
    },
    {
      label: "Report",
      icon: "pi pi-cloud",
      items: [
        {
          label: "Quotation ( Non GST )",
          command: () => { navigate("report/quotationwithoutgst"); setOpen(false); },
        },
        {
          label: "Quotation ( GST )",
          command: () => { navigate("report/quotation"); setOpen(false); },
        },
      ],
    },
  ];
  

  return (
    <>
      <ConfirmDialog />
      <div className="bg-yellow-600 py-4 px-3 lg:px-24 lg:py-2  text-2xl flex justify-between items-center shadow-slate-600 shadow-md z-50">
        <div className="flex gap-3 items-center">
          <Button
            icon={<PiListBold size={30} />}
            onClick={() => setOpen(true)}
            className=" lg:hidden text-white"
          />
          <Avatar
            shape="circle"
            image={Company?.logo}
            alt="Company Logo"
            className="w-8 h-8 md:w-10 lg:w-14"
          />
          <label className="text-white uppercase font-bold text-xs md:text-lg lg:text-xl">
            {Company?.name}
          </label>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <Link to="/crm" className="text-white">
            <PiHouseDuotone />
          </Link>
          <Button
            icon={<PiPowerBold />}
            onClick={confirmLogout}
            className="text-white"
          />
        </div>

        <NavBarLinks
          user={localStorage.getItem("user")}
          confirmLogout={confirmLogout}
        />
      </div>

      <Sidebar
        visible={open}
        onHide={() => setOpen(false)}
        header={customeHeader}
        className=""
      >
        <PanelMenu model={items} />
        <div className="py-2 absolute bottom-0 left-0 right-0 flex justify-center items-center">
          <PiCopyright size={15} /> 2024
        </div>
      </Sidebar>
    </>
  );
}

const NavLinkList = ({ links, onClose }) => (
  <ul className="text-base grid">
    {links.map(({ to, label }) => (
      <Link
        key={to}
        to={to}
        onClick={onClose}
        className="text-base py-3 px-5 w-full hover:bg-blue-100 capitalize duration-300 cursor-pointer"
      >
        {label}
      </Link>
    ))}
  </ul>
);

const NavBarLinks = ({ user, confirmLogout }) => (
  <div className="hidden lg:block">
    <ul className="flex gap-10 items-center">
      <NavBarLink to="/crm" label="Home" />
      <NavBarDropdown label="Master" links={masterLinks} />
      <NavBarDropdown label="Invoice" links={invoiceLinks} />
      <NavBarDropdown label="Report" links={reportLinks} />
      <li className="relative">
        <div className="dropdownbtn text-white flex items-center gap-3 py-2">
          <Avatar size="normal" shape="circle" label={user?.substring(0, 1)} style={{ backgroundColor: '#caccd1', color: '#00205b' }} className=" uppercase bg-transparent border" />
          <span className="text-base italic truncate">{user}</span>
          <PiCaretDownBold size={16} />
        </div>
        <div className="dropdown-menu overflow-hidden w-48 bg-white rounded-md duration-300 shadow-md absolute top-9 right-0 z-50">
          <button
            type="button"
            className="w-full flex items-center gap-3 text-start px-4 py-2 text-lg hover:bg-blue-100 capitalize duration-300 cursor-pointer"
            onClick={confirmLogout}
          >
            <PiPowerBold /> Logout
          </button>
        </div>
      </li>
    </ul>
  </div>
);

const NavBarLink = ({ to, label }) => (
  <li>
    <Link to={to} className="dropdownbtn text-base font-semibold text-white">
      {label}
    </Link>
  </li>
);

const NavBarDropdown = ({ label, links }) => (
  <li>
    <div className="relative">
      <button className="dropdownbtn text-base font-semibold py-3 text-white">
        {label}
      </button>
      <div className="dropdown-menu overflow-hidden  w-64 bg-white rounded-md duration-300 shadow-md absolute -left-16 z-50">
        <NavLinkList links={links} />
      </div>
    </div>
  </li>
);

const masterLinks = [
  { to: "master/company", label: "Company Info" },
  { to: "master/createcustomer", label: "Customer Master" },
  { to: "master/branch", label: "Branch Master" },
  { to: "master/bank", label: "Bank" },
  { to: "master/mode", label: "Mode" },
  { to: "master/liveprice", label: "Live Price" },
];

const invoiceLinks = [
  { to: "invoice/invoice", label: "Entry Invoice (non GST)" },
  { to: "invoice/invoicegst", label: "Entry Invoice (GST)" },
];

const reportLinks = [
  { to: "report/quotation", label: "Get Quotation (GST)" },
  { to: "report/quotationwithoutgst", label: "Get Quotation (non GST)" },
];

export default NavBar;
