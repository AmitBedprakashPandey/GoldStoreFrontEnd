import {
  PiPlusBold,
  PiTrash,
  PiPrinterDuotone,
  PiFloppyDisk,
  PiUpload,
  PiMagnifyingGlass,
  PiInfo,
} from "react-icons/pi";
import { useEffect, useLayoutEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createInvoice,
  fetchAllInvoices,
  fetchOneInvoice,
  updateInvoice,
} from "../Store/Slice/InvoiceSlice";
import { fetchAllBranch } from "../Store/Slice/BranchSlice";
import CustomerForm from "../layout/CustomerForm";
import { fetchAllCustomers } from "../Store/Slice/CustomerSlice";
import { fetchAllPyBank } from "../Store/Slice/PayBankSlice";
import { fetchAllPyMode } from "../Store/Slice/PayModeSlice";
import {
  fetchOneInvoiceNumberGst,
  UpdateInvoiceNumberGst,
} from "../Store/Slice/InvoiceNumbergstSlice";
import toast, { toastConfig } from "react-simple-toasts";
import moment from "moment";
import Loading from "./Loading";
import { Modal } from "antd";
import { Dialog } from "primereact/dialog";

import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { InputNumber } from "primereact/inputnumber";
function Invoice2({}) {
  const [formData, setFormData] = useState();
  toastConfig({
    duration: 2000,
    zIndex: 1000,
    className:
      "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
  });

  const [buttonLable, setButtonLable] = useState("save");

  const [ invoiceArray, setInvoiceArray] = useState([]);
  const [invoiceData, setInvoiceData] = useState();
  const [invoiceDate, setInvoiceDate] = useState();
  const [modal2Open, setModal2Open] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);
  const disptch = useDispatch();
  const { Branch } = useSelector((state) => state.Branchs);
  const { Customer } = useSelector((state) => state.Customers);
  const { PyMode } = useSelector((state) => state.Mode);
  const { PyBank } = useSelector((state) => state.Bank);
  const { Invoice, error, loading, message } = useSelector(
    (state) => state.Invoices
  );
  const [invoiceId, setInvoiceId] = useState();
  const { Company } = useSelector((state) => state.Company);

  const formDataHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      quot: invoiceId,
      quotdate: invoiceDate,
    });
  };

  const invoiceDataHandler = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    disptch(fetchAllBranch());
    disptch(fetchAllCustomers());
    disptch(fetchOneInvoiceNumberGst(Company._id)).then((doc) => {
      setInvoiceId(Number(doc.payload?.number));
    });
    disptch(fetchAllPyBank());
    disptch(fetchAllPyMode());
    setInvoiceDate(moment().format("YYYY-MM-DD"));
  }, [disptch]);

  const quotionIdHandler = (e) => {
    disptch(fetchOneInvoice(invoiceId)).then((req, res) => {
      if (req?.payload?.message) {
        toast(req?.payload?.message);
        return setButtonLable("");
      }
      setButtonLable("update");
      setFormData(req.payload);
      setInvoiceDate(moment(req.payload?.quotdate).format("YYYY-MM-DD"));
      setInvoiceArray(req.payload?.invoice);
    });
  };
  
  const AddBtn = () => {
    setInvoiceArray([...invoiceArray , invoiceData]);
    setInvoiceData({
      ...invoiceData,
      desc: "",
      hsn: "",
      purity: 0,
      weight:0,
      rate: 0,
      qty: 0,
      mcharg: 0,
      total: 0,
      disc: 0,
      sgst: 0,
      cgst: 0,
      igst: 0,
      nettotal: 0,
    });
  };

  const RemoveBtn = (index) => {
    const data = [...invoiceArray];
    data.splice(index, 1);
    if (data.length === 0) {
      setFormData({
        ...formData,
        gtotal: 0,
        ttax: 0,
        tdisc: 0,
        total: 0,
        tamt: 0,
      });
    }
    setInvoiceArray(data);
  };

  useEffect(() => {
    const multi = invoiceData?.weight * invoiceData?.rate * invoiceData?.qty;
    const total = multi + (multi * invoiceData?.mcharg || 0 ) / 100;

    const sgst = Number(invoiceData?.sgst) || 0; 
    const cgst = Number(invoiceData?.cgst) || 0; 
    const igst = Number(invoiceData?.igst) || 0; 
    
    const discountedTotal = total -  (total * invoiceData?.disc || 0) / 100;
    const totalGST = (discountedTotal * sgst) / 100 + (discountedTotal * cgst) / 100 + (discountedTotal * igst) / 100;


    const nettotal = discountedTotal + totalGST 
    setInvoiceData({ ...invoiceData, total,nettotal });
  }, [invoiceData?.weight,invoiceData?.rate,invoiceData?.qty,invoiceData?.mcharg,invoiceData?.disc,invoiceData?.sgst,invoiceData?.cgst,invoiceData?.igst]);

  useEffect(()=>{
    const tamt = invoiceArray?.reduce((accumulator, current) => accumulator + current.total,0);
    const gtotal = invoiceArray?.reduce((accumulator, current) =>accumulator + Number(current.nettotal),0);
    const tdisc = invoiceArray?.reduce((accumulator, current) => accumulator + Number(current.disc) ,0);
    const ttax = invoiceArray?.reduce((accumulator, current) =>accumulator + (Number(current.igst) + Number(current.cgst) + Number(current.sgst) ),0);
    const balamt = formData?.gtotal - formData?.paidamt || gtotal;
    
    setFormData({...formData,tamt,gtotal,tdisc,ttax,balamt});
  },[invoiceArray,formData?.paidamt]);

  const printWithGST = () => {
    const data = {
      company: Company,
      customer: Customer.filter((doc) => doc?.name === formData?.customer),
      formData: formData,
      invoice: invoiceArray,
    };
    sessionStorage.setItem("printData", JSON.stringify(data));
    window.open("/printgst", "_blank");
  };
  const save = () => {
    disptch(
      createInvoice({
        ...formData,
        invoice: invoiceArray,
        user: localStorage.getItem("user"),
        status: false,
      })
    ).then(() => {
      disptch(UpdateInvoiceNumberGst(Company._id)).then(() => {
        disptch(fetchOneInvoiceNumberGst(Company._id));
        printWithGST();
      });
    });
  };

  const update = () => {
    disptch(updateInvoice({ ...formData, invoice: invoiceArray })).then(() => {
      toast("update");

      disptch(fetchAllInvoices());
    });
  };

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const confirmSave = () => {
    confirmDialog({
      message: "Are you sure you want to save ?",
      header: "Confirmation",
      icon: <PiInfo />,
      defaultFocus: "accept",
      acceptClassName:
        "bg-blue-500 hover:bg-blue-600 px-4 py-3 text-white ml-3",
      rejectClassName: "px-4 py-3 ml-3",
      accept: () => save(),
      // reject
    });
  };

  const confirmUpdate = () => {
    confirmDialog({
      message: "Are you sure you want to update ?",
      header: "Confirmation",
      icon: <PiInfo />,
      defaultFocus: "accept",
      acceptClassName:
        "bg-blue-500 hover:bg-blue-600 px-4 py-3 text-white ml-3",
      rejectClassName: "px-4 py-3 ml-3",
      accept: () => update(),
      // reject
    });
  };

  return (
    <div className="lg:mx-16 ">
      {loading && <Loading />}
      {error && error}
      <Dialog
        header="Create Customer"
        visible={modal3Open}
        onHide={() => setModal3Open(false)}
      >
        <CustomerForm close={() => setModal3Open(false)} Mode={"save"} />
      </Dialog>
      <div className="mt-0 p-3 bg-white overflow-hidden">
        <div className="grid lg:grid-cols-3 ">
          <div className="m-3">
            <label className="">Branch Name : </label>
            <Dropdown
              options={Branch}
              value={formData?.branch}
              optionLabel="branch"
              optionValue="branch"
              name="branch"
              placeholder="Select branch"
              onChange={formDataHandler}
              // onChange={(e) => formDataHandler(e.originalEvent)}
              className="border-gray-300 border shadow-gray-400 shadow-sm w-full"
            />
          </div>
          <div className="m-3 w-full">
            <label className="">Quotation No. : </label>
            <div className="flex gap-3 w-full">
              <InputNumber
                useGrouping={false}
                placeholder="0000"
                name="quotion"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.value)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
              <button
                className="flex items-center gap-3 py-2 px-5 bg-blue-500 rounded-lg text-white font-bold "
                onClick={quotionIdHandler}
              >
                <PiMagnifyingGlass />
                Find
              </button>
            </div>
          </div>
          <div className="m-3">
            <label className="">Quotation Date : </label>
            <input
              type="Date"
              placeholder="dd/mm/yy"
              name="quotdate"
              dateFormat="dd/mm/yy"
              showIcon
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.value)}
              className="w-full py-3 px-3 border-gray-300 rounded-lg  border shadow-gray-400 shadow-sm"
            />
          </div>
        </div>
        <hr className="my-2 border-black" />
        <div className="flex items-center">
          <div className="m-3 max-w-96">
            <label className="">Customer Name : </label>
            <Dropdown
              className="border-gray-300 border shadow-gray-400 shadow-sm w-full"
              name="customer"
              filterPlaceholder="Enter name"
              placeholder="Select Customer"
              filterInputAutoFocus
              value={formData?.customer}
              onChange={formDataHandler}
              options={Customer}
              optionLabel="name"
              optionValue="name"
              filter
            />
          </div>
          <Button
            icon={<PiPlusBold color="#fff" />}
            className="bg-blue-700 h-12 mt-6"
            onClick={() => setModal3Open(true)}
          />
        </div>
        <hr className="my-2 border-black" />
        {/* Invoice Form */}
        <div className="relative">
        <Button
            className="z-50 border p-3 rounded-full bg-blue-500 text-white absolute right-3 top-0 cursor-pointer"
            onClick={AddBtn}
            disabled={
              !(
                invoiceData?.desc &&
                invoiceData?.hsn &&
                invoiceData?.purity &&
                invoiceData?.weight &&
                invoiceData?.rate &&
                invoiceData?.qty &&
                invoiceData?.mcharg &&
                invoiceData?.total &&
                invoiceData?.disc &&
                invoiceData?.sgst &&
                invoiceData?.igst &&
                invoiceData?.cgst &&
                invoiceData?.nettotal
              )
            }
          >
            <PiPlusBold />
          </Button>
          <div className="m-3">
            <label className="">Description</label>
            <input
              type="text"
              className="border-gray-300 border shadow-gray-400 shadow-sm w-full rounded-md p-3"
              name="desc"
              value={invoiceData?.desc}
              onChange={invoiceDataHandler}
            />
          </div>
          <div className="grid gap-3 grid-cols-3 md:grid-cols-6 lg:grid-cols-12 ">
            
              <div className=" grid">
                <label className="">HSN Code </label>
                <input
                  type="text"
                  placeholder="0000"
                  name="hsn"
                  value={invoiceData?.hsn}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="">Purity </label>
                <InputNumber
                  useGrouping={false}
                  placeholder="0000"
                  name="purity"
                  value={invoiceData?.purity}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="">Weight (g) </label>
                <InputNumber
                  useGrouping={false}
                  minFractionDigits={2}
                  placeholder="0000"
                  name="weight"
                  value={invoiceData?.weight || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
            
              </div>
              <div className=" grid">
                <label className="">Rate </label>
                <InputNumber
                  useGrouping={false}
                  minFractionDigits={2}
                  placeholder="0000"
                  name="rate"
                  value={invoiceData?.rate || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-32 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />  
              </div>
              <div className=" grid">
                <label className="">Qty. </label>
                <InputNumber
                  useGrouping={false}
                  placeholder="0000"
                  name="qty"
                  value={invoiceData?.qty || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-32 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="text-sm">
                  Make Chrg.<strong>%</strong>
                </label>
                <InputNumber
                  useGrouping={false}
                  minFractionDigits={2}
                  placeholder="0000"
                  name="mcharg"
                  value={invoiceData?.mcharg || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="">Total </label>
                <InputNumber
                  useGrouping={true}
                  minFractionDigits={2}
                  disabled
                  placeholder="0000"
                  name="total"
                  value={invoiceData?.total || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="">
                  Disc. <strong>%</strong>
                </label>
                <InputNumber
                  useGrouping={false}
                  minFractionDigits={2}
                  placeholder="0000"
                  name="disc"
                  value={invoiceData?.disc || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="">
                  SGST <strong>%</strong>
                </label>
                <InputNumber
                  useGrouping={false}
                  minFractionDigits={2}
                  placeholder="0000"
                  name="sgst"
                  value={invoiceData?.sgst || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="">
                  CGST <strong>%</strong>
                </label>
                <InputNumber
                  useGrouping={false}
                  minFractionDigits={2}
                  placeholder="0000"
                  name="cgst"
                  value={invoiceData?.cgst || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="grid">
                <label className="">
                  IGST <strong>%</strong>
                </label>
                <InputNumber
                  useGrouping={false}
                  minFractionDigits={2}
                  placeholder="0000"
                  name="igst"
                  value={invoiceData?.igst || 0}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  inputClassName="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" grid">
                <label className="">NET TOTAL</label>
                <InputNumber
                  useGrouping={true}
                  minFractionDigits={2} 
                  placeholder="0000"
                  name="nettotal"
                  value={invoiceData?.nettotal}
                  onChange={(e) => invoiceDataHandler(e.originalEvent)}
                  disabled
                  inputClassName="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
          
          </div>
        </div>
         {/* Invoice Form end*/}

        <div className="relative overflow-x-auto mx-0 py-3 flex md:justify-center ">
          <table className="overflow-x-scroll lg:overflow-x-hidden ">
            <tr className="text-sm bg-gray-100 flex">
              <th className="w-48 py-3 justify-center flex ">Description</th>
              <th className="w-20 flex py-3 justify-center ">Wight</th>
              <th className="w-10 flex py-3 justify-center  ">Qty.</th>
              <th className="w-32 flex py-3 justify-center  ">Make Charg.%</th>
              <th className="w-16 flex py-3 justify-center  ">Rate</th>
              <th className="w-16 flex py-3 justify-center  ">Amt.</th>
              <th className="w-16 flex py-3 justify-center  ">SGST</th>
              <th className="w-16 flex py-3 justify-center  ">CGST</th>
              <th className="w-16 flex py-3 justify-center  ">IGST</th>
              <th className="w-28 flex py-3 justify-center  ">Discount %</th>
              <th className="w-28 flex py-3 justify-center  ">Net Tot.</th>
              <th className="flex w-16 py-3 justify-center  ">Action</th>
            </tr>

            <div className="max-h-48">
              {invoiceArray?.map((doc, index) => (
                <tr key={index} className="text-sm h-14 flex items-center">
                  <td className="w-48 h-full justify-center  flex items-center ">
                    {doc?.desc}
                  </td>
                  <td className="justify-center h-full flex items-center  w-20  ">
                    {parseFloat(doc?.weight || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center   w-10  ">
                    {doc?.qty || 0}
                  </td>
                  <td className="flex h-full items-center w-32 px-10  ">
                    {parseFloat(doc?.mcharg || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center   w-16  ">
                    {parseFloat(doc?.rate || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center  w-16  ">
                    {parseFloat(doc?.total || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center   w-16  ">
                    {parseFloat(doc?.sgst || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center   w-16  ">
                    {parseFloat(doc?.cgst || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center   w-16  ">
                    {parseFloat(doc?.igst || 0).toFixed(2)}
                  </td>
                  <td className="w-28 flex h-full items-center justify-center  ">
                    {parseFloat(doc?.disc || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center  justify-center  w-28 ">
                    {parseFloat(doc?.nettotal).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center gap-2 justify-center  w-16 ">
                    <button
                      className="bg-red-500 duration-300 text-white hover:bg-red-600 p-1.5 rounded-full"
                      onClick={() => RemoveBtn(index)}
                    >
                      <PiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </div>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 lg:grid -cols-9 relative">
          <div className=" grid">
            <label className="">Total Amt.</label>
            <InputNumber
              placeholder="0000"
              disabled
              name="tamt"
              useGrouping={false}
              minFractionDigits={2}
              value={formData?.tamt || 0}
              onChange={formDataHandler}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Total Disc.</label>
            <InputNumber
              disabled
              placeholder="0000"
              name="tdisc"
              useGrouping={false}
              minFractionDigits={2}
              value={formData?.tdisc || 0}
              onChange={formDataHandler}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Total tax</label>
            <InputNumber
              useGrouping={false}
              minFractionDigits={2}
              placeholder="0000"
              name="tottax"
              disabled
              value={formData?.ttax || 0}
              onChange={formDataHandler}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Grand Amt. </label>
            <InputNumber
              useGrouping={false}
              minFractionDigits={2}
              placeholder="0000"
              disabled
              name="gtotal"
              value={formData?.gtotal || 0}
              onChange={formDataHandler}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Mode </label>
            <Dropdown
              options={PyMode}
              value={formData?.mode}
              optionLabel="mode"
              placeholder="Select"
              optionValue="mode"
              name="mode"
              onChange={formDataHandler}
              className="border-gray-300 border shadow-gray-400 shadow-sm  py-0 px-0 w-full"
            />
          </div>
          <div className="grid">
            <label className="">Bank </label>
            <Dropdown
              placeholder="Select"
              options={PyBank}
              value={formData?.bank}
              optionLabel="bank"
              optionValue="bank"
              name="bank"
              onChange={formDataHandler}
              disabled={formData?.mode === "Bank" ? false : true}
              className="border-gray-300 border shadow-gray-400 shadow-sm  w-full"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Cheque no. </label>
            <InputNumber
              useGrouping={false}
              minFractionDigits={2}
              disabled={
                formData?.bank && formData?.mode === "Bank" ? false : true
              }
              placeholder="0000"
              name="pycheq"
              value={formData?.pycheq}
              onChange={formDataHandler}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Paid Amt. </label>
            <InputNumber
              useGrouping={false}
              minFractionDigits={2}
              placeholder="0000"
              name="paidamt"
              value={formData?.paidamt}
              onChange={(e)=>setFormData({...formData,paidamt:e.value})}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Bal. Amt. </label>
            <InputNumber
              useGrouping={false}
              minFractionDigits={2}
              placeholder="0000"
              name="balamt"
              disabled
              value={formData?.balamt}
              onChange={formDataHandler}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center  bg-white py-3 border-t">
        <button
          className="flex gap-2 items-center py-3 px-4 text-white bg-green-500 rounded-md hover:bg-green-600 uppercase disabled:bg-green-700 disabled:cursor-not-allowed"
          onClick={confirmSave}
          disabled={
            buttonLable === "save" &&
            formData?.branch &&
            formData?.quot &&
            formData?.quotdate &&
            formData?.customer &&
            invoiceArray.length != 0
              ? false
              : true
          }
        >
          <PiFloppyDisk />
          save
        </button>
        <button
          className="flex gap-2 items-center  py-3 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 uppercase disabled:bg-blue-700 disabled:cursor-not-allowed"
          onClick={confirmUpdate}
          disabled={buttonLable === "update" ? false : true}
        >
          <PiUpload />
          update
        </button>

        <button
          disabled={buttonLable === "update" ? false : true}
          className="flex gap-2 items-center  py-3 px-4 text-white disabled:bg-red-700 bg-red-500 rounded-md hover:bg-red-600 uppercase"
          onClick={printWithGST}
        >
          <PiPrinterDuotone />
          Print
        </button>
      </div>
  
    </div>
  );
}
export default Invoice2;
