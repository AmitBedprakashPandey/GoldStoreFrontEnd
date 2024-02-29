import {
  CircleUserRound,
  Home,
  LogOut,
  Menu,
  UserCircle,
  X,
} from "lucide-react";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "antd";
import { fetchByUser } from "../Store/Slice/CompanySlice";
import useSelection from "antd/es/table/hooks/useSelection";
import { useDispatch, useSelector } from "react-redux";
function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <>
      {openMenu && <SideMenu close={() => setOpenMenu(false)} />}
      <div className="bg-yellow-500 py-3 px-5 lg:px-24 text-2xl flex justify-between items-center shadow-slate-400 shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="flex gap-3 items-center">
          <Menu
            size={32}
            onClick={() => setOpenMenu(!openMenu)}
            className=" lg:hidden"
          />
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
            title="Vertically centered modal dialog"
            centered
            open={modal2Open}
            onOk={() => {
              logout();
              setModal2Open(false);
            }}
            onCancel={() => setModal2Open(false)}
          >
            <p>some contents...</p>
            <p>some contents...</p>
            <p>some contents...</p>
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
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

const SideMenu = ({ close }) => {
  const items = [
    {
      key: "1",
      label: "Master",
      children: (
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
          <Link className="py-2 px-3 w-full hover:bg-red-100 capitalize duration-300 cursor-pointer">
            Inventory Master
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
      ),
    },
    {
      key: "2",
      label: "Enter Invoice",
      children: (
        <ul className="grid">
          <Link
            to={"/invoice"}
            className="px-5 py-2 hover:bg-gray-300 capitalize cursor-pointer"
          >
            Entery Invice Without GST
          </Link>
          <Link
            to={"/invoicegst"}
            className="px-5 py-2 hover:bg-gray-300 capitalize cursor-pointer"
          >
            Entery Invice With GST
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
            className="px-5 py-2 hover:bg-gray-300 capitalize cursor-pointer"
          >
            Quotation
          </Link>
        </ul>
      ),
    },
  ];

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => (document.body.style.overflowY = "scroll");
  }, []);
  return (
    <>
      <div
        onClick={close}
        className="p-3 z-50 fixed top-0 bottom-0 left-0 right-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      />
      <div className=" w-[80%] duration-700 bg-white z-50 fixed top-0 bottom-0">
        <X
          size={48}
          className="absolute -right-11 text-white"
          onClick={close}
        />

        <div className="flex items-center  gap-5 bg-blue-500 py-5 px-3 text-white">
          <CircleUserRound strokeWidth={0.75} size={60} />
          <label className="italic font-semibold text-sm">
            {localStorage.getItem("user")}
          </label>
        </div>

        <Collapse
          items={items}
          accordion
          bordered={false}
          className="bg-blue-50 rounded-none"
        />

        <div className="fixed bottom-0 left-0 px-5 py-3">
          <label>Copyrigh</label>
        </div>
      </div>
    </>
  );
};

export default NavBar;
