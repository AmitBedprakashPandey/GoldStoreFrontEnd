import {
  CircleUserRound,
  Copyright,
  Home,
  LogOut,
  Menu,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { Avatar, Button, Drawer, Radio, Space } from "antd";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "antd";
import { fetchByUser } from "../Store/Slice/CompanySlice";
import useSelection from "antd/es/table/hooks/useSelection";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/Slice/AuthSlice";
function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);

  const [open, setOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const { Company } = useSelector((state) => state.Company);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchByUser(localStorage.getItem("user")));
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const logoutBtn = () => {
    dispatch(logout());
    navigate("/login");
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const items = [
    {
      key: "0",
      showArrow: false,
      label: (
        <div className="h-auto p-3 flex flex-col items-center">
          {Company?.logo ? (
            <Avatar size={120} src={Company.logo} />
          ) : (
            <Avatar size={100} icon={<User size={60} />} />
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
      children: (
        <ul className="text-base grid">
          <Link
            to={"/company"}
            onClick={onClose}
            className="text-lg py-5 px-5 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
          >
            CompanyInfo
          </Link>
          <Link
            to={"/createcustomer"}
            onClick={onClose}
            className="text-lg py-5 px-5 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
          >
            customer master
          </Link>
          <Link
            to={"/branch"}
            onClick={onClose}
            className="text-lg py-5 px-5 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
          >
            Branch master
          </Link>
          <Link
            to={"/bank"}
            onClick={onClose}
            className="text-lg py-5 px-5 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
          >
            Bank
          </Link>
        </ul>
      ),
    },
    {
      key: "2",
      label: "Enter Invoice",
      children: (
        <ul className="grid">
          <Link
            to={"/invoice"}
            onClick={onClose}
            className="text-lg px-5 py-5 hover:bg-gray-300 capitalize cursor-pointer"
          >
            Entry invoice Without GST
          </Link>
          <Link
            to={"/invoicegst"}
            onClick={onClose}
            className="text-lg px-5 py-5 hover:bg-gray-300 capitalize cursor-pointer"
          >
            Entry invoice With GST
          </Link>
        </ul>
      ),
    },
    {
      key: "3",
      label: "Reports",

      children: (
        <ul className="grid">
          <Link
            to={"/quotation"}
            onClick={onClose}
            className="text-lg px-5 py-5 hover:bg-gray-300 capitalize cursor-pointer"
          >
            get Quotation with gst
          </Link>
          <Link
            to={"/quotationwithoutgst"}
            onClick={onClose}
            className="text-lg px-5 py-5 hover:bg-gray-300 capitalize cursor-pointer"
          >
            get Quotation without gst
          </Link>
        </ul>
      ),
    },
  ];
  return (
    <>
      <div className="bg-yellow-500 py-3 px-5 lg:px-24 text-2xl flex justify-between items-center shadow-slate-400 shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="flex gap-3 items-center">
          <Menu size={32} onClick={showDrawer} className=" lg:hidden" />
          <img
            src={Company?.logo}
            className="w-10 h-10 md:w-16 md:h-16 lg:w-16 lg:h-16 overflow-hidden rounded-full bg-cover bg-center"
          />
          <label className="uppercase font-bold text-sm md:text-lg lg:text-xl">
            {Company?.name}
          </label>
        </div>
        <div className="lg:hidden flex gap-5">
          <Link to={"/"}>
            <Home />
          </Link>
          <LogOut onClick={() => setModal2Open(true)} />
          <Modal
            centered
            open={modal2Open}
            onOk={() => {
              setModal2Open(false);
              logoutBtn()
            }}
            closable={false}
            onCancel={() => setModal2Open(false)}
          >
            <label className="text-3xl">Are you sure want to logout</label>
          </Modal>
        </div>
        <div className="hidden lg:block">
          <ul className=" flex gap-10 items-center">
            <li>
              <Link to={"/"} className="dropdownbtn text-lg font-semibold">
                Home
              </Link>
            </li>
            <li>
              <div className="relative">
                <button className="dropdownbtn text-lg font-semibold">
                  Master
                </button>
                <div className="dropdown-menu overflow-hidden w-48 bg-white rounded-md duration-300 shadow-md absolute -left-16 mx-auto z-50">
                  <ul className="text-base grid">
                    <Link
                      to={"/company"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      CompanyInfo
                    </Link>
                    <Link
                      to={"/createcustomer"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      customer master
                    </Link>
                    <Link
                      to={"/branch"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      Branch master
                    </Link>
                    <Link
                      to={"/bank"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      Bank
                    </Link>
                    <Link
                      to={"/mode"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      Mode
                    </Link>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="relative">
                <button className="dropdownbtn text-lg font-semibold">
                  Invoice
                </button>
                <div className=" dropdown-menu overflow-hidden w-48 bg-white rounded-md duration-300 shadow-md absolute -left-16 z-50">
                  <ul className="text-base grid">
                    <Link
                      to={"invoice"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      Get Invoice Without GST
                    </Link>
                    <Link
                      to={"/invoicegst"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      Get Invoice With GST
                    </Link>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="relative">
                <button className="dropdownbtn text-lg font-semibold">
                  Report
                </button>
                <div className=" dropdown-menu overflow-hidden w-48 bg-white rounded-md duration-300 shadow-md absolute -left-16 z-50">
                  <ul className="text-base grid">
                    <Link
                      to={"/quotation"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      Quotation
                    </Link>
                    <Link
                      to={"/quotationwithoutgst"}
                      className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer"
                    >
                      Quotation without gst
                    </Link>
                  </ul>
                </div>
              </div>
            </li>
            <li className=" relative">
              <div className="dropdownbtn flex items-center gap-3 py-2">
                <UserCircle />{" "}
                <span className="text-base italic truncate">
                  {localStorage.getItem("user")}
                </span>
              </div>
              <div className="dropdown-menu overflow-hidden w-48 bg-white rounded-md duration-300 shadow-md absolute  top-9 right-0 z-50">
                <button
                  type="button"
                  className="w-full text-start px-4 py-2 text-lg hover:bg-red-100 capitalize duration-300 cursor-pointer"
                  onClick={logoutBtn}
                >
                  Logout
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
          items={items}
          accordion
          bordered={false}
          className="bg-yellow-100 rounded-none p-0 "
        />
        <div className="py-2 absolute bottom-0 left-0 right-0 flex justify-center items-center">
          copyright
          <Copyright size={15} /> 2024
        </div>
      </Drawer>
    </>
  );
}

export default NavBar;
