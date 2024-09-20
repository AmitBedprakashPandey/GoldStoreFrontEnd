import {
  PiUserCircle,
  PiCopyright,
  PiHouseDuotone,
  PiPowerBold,
  PiListBold,
  PiCaretDownBold,
  PiGear,
} from "react-icons/pi";
import { Avatar, Drawer, Collapse } from "antd";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/Slice/AuthSlice";
import { fetchByUser } from "../Store/Slice/CompanySlice";
import { fetchOneInvoicesNumber } from "../Store/Slice/InvoiceIdSlice";
import { fetchOneInvoiceNumberGst } from "../Store/Slice/InvoiceNumbergstSlice";

function NavBar() {
  const [open, setOpen] = useState(false);
  const { Company } = useSelector((state) => state.Company);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!localStorage.getItem("token")) {
      navigate("/crm/login");
    } else {
      dispatch(fetchByUser(user));
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (Company?._id) {
      dispatch(fetchOneInvoicesNumber(Company._id));
      dispatch(fetchOneInvoiceNumberGst(Company._id));
    }
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
      acceptClassName: "bg-cyan-500 px-6 py-3 text-white",
      rejectClassName: "py-3 px-6 mr-3 border",
      accept: logoutBtn,
    });
  }, [logoutBtn]);

  const toggleDrawer = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const items = useMemo(() => [
    {
      key: "0",
      showArrow: false,
      label: (
        <div className="h-auto p-3 flex flex-col items-center">
          {Company?.logo ? (
            <Avatar size={120} src={Company.logo} />
          ) : (
            <Avatar size={100} icon={<PiUserCircle size={60} />} />
          )}
          <label className="font-bold uppercase italic py-3 text-3xl">
            {Company?.name}
          </label>
        </div>
      ),
    },
    {
      key: "1",
      label: "Master",
      children: <NavLinkList onClose={toggleDrawer} links={masterLinks} />,
    },
    {
      key: "2",
      label: "Enter Invoice",
      children: <NavLinkList onClose={toggleDrawer} links={invoiceLinks} />,
    },
    {
      key: "3",
      label: "Reports",
      children: <NavLinkList onClose={toggleDrawer} links={reportLinks} />,
    },
  ], [Company, toggleDrawer]);

  return (
    <>
      <ConfirmDialog />
      <div className="bg-yellow-500 py-3 px-5 lg:px-24 text-2xl flex justify-between items-center shadow-slate-400 shadow-md  top-0 left-0 right-0 z-40">
        <div className="flex gap-3 items-center">
          <PiListBold size={32} onClick={toggleDrawer} className=" lg:hidden" />
          <img
            src={Company?.logo}
            alt="Company Logo"
            className="w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 overflow-hidden rounded-lg bg-cover bg-center"
          />
          <label className="uppercase font-bold text-sm md:text-lg lg:text-xl">
            {Company?.name}
          </label>
        </div>
        <div className="lg:hidden flex gap-5">
          <Link to="/crm">
            <PiHouseDuotone />
          </Link>
          <button onClick={confirmLogout}>
            <PiPowerBold />
          </button>
        </div>
        <NavBarLinks user={localStorage.getItem("user")} confirmLogout={confirmLogout} />
      </div>
      <Drawer closable={false} onClose={toggleDrawer} open={open} placement="left">
        <Collapse items={items} accordion bordered={false} className="bg-yellow-100 rounded-none p-0 " />
        <div className="py-2 absolute bottom-0 left-0 right-0 flex justify-center items-center">
          <PiCopyright size={15} /> 2024
        </div>
      </Drawer>
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
        className="text-base py-3 px-5 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
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
        <div className="dropdownbtn flex items-center gap-3 py-2">
          <PiUserCircle color="#000" />
          <span className="text-base italic truncate">{user}</span>
          <PiCaretDownBold size={16} />
        </div>
        <div className="dropdown-menu overflow-hidden w-48 bg-white rounded-md duration-300 shadow-md absolute top-9 right-0 z-50">
          {/* <Link
            to="setting"
            className="w-full flex items-center gap-3 text-start px-4 py-2 text-lg hover:bg-red-100 capitalize duration-300 cursor-pointer"
          >
            <PiGear /> Settings
          </Link> */}
          <button
            type="button"
            className="w-full flex items-center gap-3 text-start px-4 py-2 text-lg hover:bg-red-100 capitalize duration-300 cursor-pointer"
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
    <Link to={to} className="dropdownbtn text-base font-semibold">
      {label}
    </Link>
  </li>
);

const NavBarDropdown = ({ label, links }) => (
  <li>
    <div className="relative">
      <button className="dropdownbtn text-base font-semibold py-3">{label}</button>
      <div className="dropdown-menu overflow-hidden w-56 bg-white rounded-md duration-300 shadow-md absolute -left-16 z-50">
        <NavLinkList links={links} onClose={() => {}} />
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
