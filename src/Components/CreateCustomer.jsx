import { useEffect, useRef, useState } from "react";
import {
  fetchAllCustomers,
  deleteCustomer,
  clearNotifications,
} from "../Store/Slice/CustomerSlice";
import CustomerForm from "../layout/CustomerForm";
import { PiTrash, PiPlusBold, PiPencilLine } from "react-icons/pi";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Button } from "primereact/button";
import Loading from "./Loading";
import { confirmDialog } from "primereact/confirmdialog";
import { BiInfoCircle } from "react-icons/bi";
import { Toast } from "primereact/toast";

function CreateCustomer() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openMode, setOpenMode] = useState("");
  const [id, setId] = useState();
  const toast = useRef();
  const dispatch = useDispatch();
  const { Customer, loading, message, error } = useSelector(
    (state) => state.Customers
  );

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.current.show({
        severity: "success",
        summary: message,
        life: 2000,
        closable: false,
        icon: null,
        className: "bg-black text-white z-50",
      });
      dispatch(clearNotifications());
    }
    if (error) {
      toast.current.show({
        severity: "error",
        summary: error,
        life: 2000,
        icon: null,
        closable: false,
        classNames: "z-50",
      });
      dispatch(clearNotifications());
    }
  }, [message, error]);

  const CreateBtn = () => {
    setOpenMode("save");
    setOpenMenu(true);
    setId();
  };

  const deleteAction = (newData) => {
    confirmDialog({
      message: `Are you sure you want to delete ?`,
      header: "Confirmation",
      icon: <BiInfoCircle size={20} />,
      defaultFocus: "accept",
      acceptClassName: "bg-red-500 p-3 text-white",
      rejectClassName: "p-3 mr-3",
      accept: () => dispatch(deleteCustomer(newData)),
    });
  };

  const actionBodyTemplate = (newData) => {
    return (
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setOpenMode("update");
            setOpenMenu(true);
            setId(newData?._id);
          }}
          icon={<PiPencilLine />}
          className="bg-blue-500 hover:bg-blue-700 duration-300 h-8 w-8 text-white rounded-full"
        />
        <Button
          onClick={() => deleteAction(newData?._id)}
          icon={<PiTrash />}
          className="bg-red-500 hover:bg-red-700 duration-300 h-8 w-8 text-white rounded-full"
        />
      </div>
    );
  };

  const footer = () => {
    return <div>Total Customer : {Customer.length}</div>;
  };

  return (
    <>
      <Toast ref={toast} position="bottom-center" />
      <Dialog
        maximized
        closable={false}
        header={openMode === "update" ? "Update Customer" : "Create Customer"}
        visible={openMenu}
        onHide={() => setOpenMenu(false)}
        className="w-full h-full z-auto"
      >
        <CustomerForm
          close={() => setOpenMenu(false)}
          Mode={openMode}
          id={id}
        />
      </Dialog>

      {loading && <Loading />}
      <div className="grid md:mx-5">
        <Button
          className="bg-blue-500 min-w-20 lg max-w-48 m-3 flex justify-center  hover:bg-blue-800 duration-300 font-normal text-white px-5 py-3 gap-3"
          onClick={CreateBtn}
        >
          <PiPlusBold />
          Create
        </Button>
        {/* 640 768 1024 */}
        <DataTable
          value={Customer}
          size="small"
          rows={10}
          paginator
          footer={footer}
          style={{ minWidth: "320px" }}
          className=""
        >
          <Column
            field="name"
            header="Party Name"
            className="min-w-48 max-w-48 truncate"
          />
          <Column
            field="address"
            header="Address"
            className="min-w-48 max-w-48 truncate "
          />
          <Column field="phone" header="Phone No." className="min-w-48" />
          <Column field="mobile" header="Mobile No." />
          <Column field="email" header="Email" />
          <Column field="gst" header="GST No." />
          <Column field="city" header="City" />
          <Column
            field="date"
            header="Date"
            body={(e) => <p>{moment(e?.date).format("DD/MM/YYYY")}</p>}
          />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>
    </>
  );
}

export default CreateCustomer;
