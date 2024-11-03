import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import {
  createInvoice,
  fetchAllInvoices,
  fetchOneInvoice,
  updateInvoice,
} from "../Store/Slice/InvoiceWithoutGstSlice";
import {
  PiFloppyDisk,
  PiPlusBold,
  PiTrash,
  PiUpload,
  PiMagnifyingGlass,
  PiPrinterDuotone,
  PiInfo,
} from "react-icons/pi";
import { Dialog } from "primereact/dialog";
import { fetchAllBranch } from "../Store/Slice/BranchSlice";
import { fetchAllCustomers } from "../Store/Slice/CustomerSlice";
import { fetchAllPyBank } from "../Store/Slice/PayBankSlice";
import { fetchAllPyMode } from "../Store/Slice/PayModeSlice";
import CustomerForm from "../layout/CustomerForm";
import {
  UpdateInvoicesNumber,
  fetchOneInvoicesNumber,
} from "../Store/Slice/InvoiceIdSlice";
import toast, { toastConfig } from "react-simple-toasts";
import moment from "moment";
import Loading from "./Loading";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
function Invoice2() {
  const [formData, setFormData] = useState();

  toastConfig({
    duration: 2000,
    zIndex: 1000,
    className:
      "bg-black w-72 h-16 rounded-full uppercase text-white py-5 text-center shadow-slate-800 shadow-md",
  });

  const [buttonLable, setButtonLable] = useState("save");
  const [invoiceArray, setInvoiceArray] = useState([]);
  const [invoiceData, setInvoiceData] = useState();
  const [invoiceDate, setInvoiceDate] = useState();

  const disptch = useDispatch();
  const { Branch } = useSelector((state) => state.Branchs);
  const { Customer } = useSelector((state) => state.Customers);
  const { PyMode } = useSelector((state) => state.Mode);
  const { PyBank } = useSelector((state) => state.Bank);

  const [modal3Open, setModal3Open] = useState(false);
  const { Invoices, error, loading } = useSelector(
    (state) => state.InvoicesWithoutGst
  );
  const { Company } = useSelector((state) => state.Company);
  const [InvoiceId, setInvoiceId] = useState();

  const formDataHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      quot: InvoiceId,
      quotdate: invoiceDate,
    });
  };

  const invoiceDataHandler = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  useLayoutEffect(() => {
    disptch(fetchOneInvoicesNumber()).then((doc) => {
      setInvoiceId(Number(doc.payload?.number));
    });
    disptch(fetchAllBranch());
    disptch(fetchAllCustomers());
    disptch(fetchAllPyBank());
    disptch(fetchAllPyMode());
    setInvoiceDate(moment().format("YYYY-MM-DD"));
  }, [disptch]);

  const quotionIdHandler = () => {
    disptch(fetchOneInvoice(InvoiceId)).then((req) => {
      if (req?.payload?.message) {
        toast(req?.payload?.message);
        return setButtonLable("");
      }
      setButtonLable("update");
      setFormData(req.payload);
      setInvoiceDate(moment(Invoices[0]?.quotdate).format("YYYY-MM-DD"));
      setInvoiceArray(req.payload?.invoice);
    });
  };

  useEffect(() => {
    const multi = invoiceData?.weight * invoiceData?.rate * invoiceData?.qty;
    const total = multi + (multi * invoiceData?.mcharg || 0) / 100
    const nettotal = total - (total * invoiceData?.disc || 0)  / 100  || 0;  
    setInvoiceData({ ...invoiceData, total,nettotal });
  }, [invoiceData?.weight,invoiceData?.rate,invoiceData?.qty,invoiceData?.mcharg,invoiceData?.disc]);

  useEffect(()=>{
    const tamt = invoiceArray?.reduce((accumulator, current) => accumulator + current.total,0);
    const tdisc = invoiceArray?.reduce((accumulator, current) => accumulator + current.disc,0);
    const gtotal = invoiceArray?.reduce((accumulator, current) =>accumulator + current.nettotal,0);
    const balamt = formData?.gtotal - formData?.paidamt || gtotal;
    
    setFormData({...formData,tamt,tdisc,gtotal,balamt});
  },[invoiceArray,formData?.paidamt]);

  const AddBtn = () => {
    setInvoiceArray([...invoiceArray, invoiceData]);
    setInvoiceData({
      ...invoiceData,
      desc: "",
      hsn: "",
      purity: 0,
      weight: 0,
      rate: 0,
      qty: 0,
      mcharg: 0,
      total: 0,
      disc: 0,
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
        tdisc: 0,
        total: 0,
        tamt: 0,
        paidamt: 0
      });
    }
    setInvoiceArray(data);
  };

  const printWithoutGST = () => {
    const data = {
      company: Company,
      customer: Customer.filter((doc) => doc?.name === formData?.customer),
      formData: formData,
      invoice: invoiceArray,
    };
    sessionStorage.setItem("printData", JSON.stringify(data));
    window.open("/print", "_blank");
  };

  const save = () => {
    disptch(
      createInvoice({
        ...formData,
        invoice: invoiceArray,
        user: localStorage.getItem("user"),
        status: false,
      })
    ).then(() =>
      disptch(UpdateInvoicesNumber(Company._id)).then(() => {
        disptch(fetchOneInvoicesNumber(Company._id));
        printWithoutGST();
        setInvoiceData({
          ...invoiceData,
          desc: "",
          hsn: 0,
          purity: 0,
          weight: 0,
          rate: 0,
          qty: 0,
          mcharg: 0,
          total: 0,
          disc: 0,
          nettotal: 0,
        });
        setInvoiceArray([]);
        setFormData({
          ...formData,
          branch: null,
          customer: null,
          total: 0,
          ttax: 0,
          gtotal: 0,
          mode: "",
          bank: "",
          pycheq: "",
          paidamt: 0,
          balamt: 0,
        });
        setButtonLable("save");
      })
    );
  };

  const update = () => {
    disptch(updateInvoice({ ...formData, invoice: invoiceArray })).then(() => {
      toast("update");
      disptch(fetchAllInvoices());
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const confirm1 = () => {
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
  return (
    <div className="lg:mx-16 h-screen bg-white">
      {loading && <Loading />}
      {error && error}
      <Dialog
        maximized={true}
        closable={false}
        header="Create Customer"
        visible={modal3Open}
        className="w-full"
        onHide={() => setModal3Open(false)}
      >
        <CustomerForm close={() => setModal3Open(false)} Mode={"save"} />
      </Dialog>
      <div className=" mt- p-3 bg-white overflow-hidden">
        <div className="grid lg:grid-cols-3">
          <div className="m-3">
            <label className="">Branch Name : </label>
            <select
              className="border-gray-300 border shadow-gray-400 shadow-sm py-3 px-3 w-full"
              name="branch"
              value={formData?.branch}
              onChange={formDataHandler}
            >
              <option selected disabled>
                --Select Branch--
              </option>
              {Branch.map((doc, index) => (
                <option key={index} value={doc.branch}>
                  {doc.branch}
                </option>
              ))}
            </select>
          </div>
          <div className="m-3">
            <label className="">Quotation No. : </label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="0000"
                name="quotion"
                value={InvoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
              <button
                className="flex items-center  gap-2 py-2 px-5 bg-blue-500 rounded-lg text-white font-bold "
                onClick={quotionIdHandler}
              >
                <PiMagnifyingGlass /> Find
              </button>
            </div>
          </div>
          <div className="m-3">
            <label className="">Quotation Date : </label>
            <input
              type="Date"
              placeholder="0000"
              name="quotdate"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
        </div>
        <hr className="my-2 border-black" />
        <div className="flex items-center relative">
          <div className="m-3 max-w-96">
            <label className="">Customer Name : </label>
            <Dropdown
              options={Customer}
              optionLabel="name"
              optionValue="name"
              placeholder="Select Customer"
              filterPlaceholder="Enter name"
              filterInputAutoFocus={true}
              filter
              className="border-gray-300 border shadow-gray-400 shadow-sm w-full"
              name="customer"
              value={formData?.customer}
              onChange={formDataHandler}
            />
          </div>
          <Button
            icon={<PiPlusBold color="#fff" />}
            className="bg-blue-700 h-12 mt-6"
            onClick={() => setModal3Open(true)}
          />
        </div>
        <hr className="my-2 border-black" />
        <div className="relative">
          <div className="m-3">
            <label className="">Description</label>
            <input
              type="text"
              className="border-gray-300 border shadow-gray-400 shadow-sm w-full  p-3"
              name="desc"
              value={invoiceData?.desc}
              onChange={invoiceDataHandler}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6 lg:grid-cols-9 relative">
            <div className="grid">
              <label className="">HSN Code </label>
              <InputText
                type="text"
                placeholder="xxxx"
                name="hsn"
                value={invoiceData?.hsn}
                onChange={invoiceDataHandler}
                className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="">Purity </label>
              <InputNumber
                placeholder={0}
                name="purity"
                value={invoiceData?.purity}
                useGrouping={false}

                // onChange={(e)=>console.log(e.originalEvent.target.value)}
                onChange={(e) => invoiceDataHandler(e.originalEvent)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="">Weight (g) </label>
              <InputNumber
                placeholder="0000"
                defaultValue={0}
                name="weight"
                minFractionDigits={2}
                useGrouping={false}
                value={invoiceData?.weight || 0}
                onChange={(e) => invoiceDataHandler(e.originalEvent)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="">Rate </label>
              <InputNumber
                placeholder="0000"
                name="rate"
                useGrouping={false}
                minFractionDigits={2}
                value={invoiceData?.rate || 0}
                onChange={(e) => invoiceDataHandler(e.originalEvent)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="">Qty. </label>
              <InputNumber
                placeholder="0000"
                name="qty"
                useGrouping={false}
                value={invoiceData?.qty || 0}
                onChange={(e) => invoiceDataHandler(e.originalEvent)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="text-sm">
              Make Chrg.<strong>%</strong>
              </label>
              <InputNumber
                placeholder="0000"
                name="mcharg"
                useGrouping={false}
                minFractionDigits={2}
                value={invoiceData?.mcharg || 0}
                onChange={(e) => invoiceDataHandler(e.originalEvent)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="">Total </label>
              <InputNumber
                disabled
                placeholder="0000"
                name="total"
                minFractionDigits={2}
                useGrouping={true}
                value={invoiceData?.total || 0}
                onChange={(e) => invoiceDataHandler(e.originalEvent)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="">
                Disc. <strong>%</strong>
              </label>
              <InputNumber
                placeholder="0000"
                name="disc"
                useGrouping={false}
                value={invoiceData?.disc || 0}
                onChange={(e) => invoiceDataHandler(e.originalEvent)}
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className="grid">
              <label className="">Net total</label>
              <InputNumber
                useGrouping={true}
                placeholder="0000"
                name="nettotal"
                minFractionDigits={2}
                value={invoiceData?.nettotal}
                // onChange={(e) => invoiceDataHandler(e.originalEvent)}
                onChange={(e) => console.log(e)}
                disabled
                inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
          </div>
          <Button
            className="border p-3 rounded-full bg-blue-500 text-white absolute right-3 top-0 cursor-pointer"
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
                // invoiceData?.disc &&                 
                invoiceData?.nettotal
              )
            }
          >
            <PiPlusBold />
          </Button>
        </div>
        <div className="relative overflow-x-auto mx-0 py-3 flex md:justify-center ">
          <table className="overflow-x-scroll lg:overflow-x-hidden ">
            <tr className="h-10 overflow-hidden text-sm bg-gray-100 flex">
              <th className="w-48 py-3 justify-center flex ">Description</th>
              <th className="w-24 flex py-3 justify-center ">Wight (g)</th>
              <th className="w-10 flex py-3 justify-center  ">Qty.</th>
              <th className="w-32 flex py-3 justify-center  ">Make Charg.%</th>
              <th className="w-20 flex py-3 justify-center  ">Rate</th>
              <th className="w-20 flex py-3 justify-center  ">Amt.</th>
              <th className="w-16 flex py-3 justify-center  ">Dis. %</th>
              <th className="w-28 flex py-3 justify-center  ">Net Tot.</th>
              <th className="w-16 flex py-3 justify-center  ">Action</th>
            </tr>

            <div className="max-h-48">
              {invoiceArray?.map((doc, index) => (
                <tr key={index} className="text-sm h-14 flex items-center">
                  <td className="w-48 h-full justify-center  flex items-center ">
                    {doc?.desc}
                  </td>
                  <td className="justify-center h-full flex items-center  w-24  ">
                    {parseFloat(doc?.weight || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center   w-10  ">
                    {doc?.qty || 0}
                  </td>
                  <td className="flex h-full items-center w-32 px-10  ">
                    {parseFloat(doc?.mcharg || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center   w-20  ">
                    {parseFloat(doc?.rate || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full justify-center items-center  w-20  ">
                    {parseFloat(doc?.total || 0).toFixed(2)}
                  </td>

                  <td className="w-16 flex h-full items-center justify-center  ">
                    {parseFloat(doc?.disc || 0).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center  justify-center  w-28 ">
                    {parseFloat(doc?.nettotal).toFixed(2)}
                  </td>
                  <td className="flex h-full items-center justify-center gap-2 w-16 ">
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

        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 lg:grid-cols-8">
          <div className=" grid">
            <label className="">Total Amt.</label>
            <InputNumber
              placeholder="0000"
              disabled
              name="tamt"
              useGrouping={false}
              maxFractionDigits={2}
              value={formData?.tamt}
              onChange={(e) => formDataHandler(e.originalEvent)}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm rounded-md"
            />
          </div>
          <div className=" grid">
            <label className="">Total Disc.</label>
            <InputNumber
              disabled
              placeholder="0000"
              name="tdisc"
              useGrouping={false}
              value={formData?.tdisc}
              onChange={(e) => formDataHandler(e.originalEvent)}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Grand Amt. </label>
            <InputNumber
              placeholder="0000"
              disabled
              name="gtotal"
              maxFractionDigits={2}
              value={formData?.gtotal}
              onChange={(e) => formDataHandler(e.originalEvent)}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Mode </label>
            <Dropdown options={PyMode} 
              value={formData?.mode}
              placeholder="Select"
              name="mode"
              onChange={formDataHandler}
              optionLabel="mode"
              optionValue="mode"
              className="border-gray-300 border shadow-gray-400 shadow-sm  py-0 px-0 w-full"            
            />
          </div>
          <div className=" grid">
            <label className="">Bank </label>
            <Dropdown 
              options={PyBank} 
              disabled={formData?.mode === "Bank" ? false : true}
              value={formData?.bank}
              placeholder="Select"
              name="bank"
              onChange={formDataHandler}
              optionLabel="bank"
              optionValue="bank"
              className="border-gray-300 border shadow-gray-400 shadow-sm  py-0 px-0 w-full"
            
            />
            
          </div>
          <div className=" grid">
            <label className="text-sm">Cheque no. </label>
            <InputNumber
            disabled={formData?.bank && formData?.mode === "Bank" ? false : true}
            placeholder="0000"
              name="pycheq"
              useGrouping={false}
              maxLength={14}
              value={formData?.bank && formData?.mode === "Bank"? formData?.pycheq: 0}
              onChange={(e)=>formDataHandler(e.originalEvent)}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm disabled:cursor-not-allowed disabled:bg-slate-200"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Paid Amt. </label>
            <InputNumber
              placeholder="0000"
              name="paidamt"
              maxFractionDigits={2}
              value={formData?.paidamt || 0}
              onChange={(e)=>setFormData({...formData,paidamt:e.value})}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Bal. Amt. </label>
            <InputNumber
              placeholder="0000"
              name="balamt"
              disabled
              value={formData?.balamt}
              onChange={(e)=>setFormData(e.value)}
              inputClassName="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex  justify-center py-3 gap-2  bg-white border-t-2">
        <button
          className=" flex items-center gap-2 py-3 px-4 text-white bg-green-500 rounded-md hover:bg-green-600 uppercase disabled:bg-green-700 disabled:cursor-not-allowed"
          onClick={confirmSave}
          disabled={
            buttonLable === "save" &&
            formData?.branch &&
            formData?.quot &&
            formData?.quotdate &&
            formData?.customer &&
            invoiceArray.length !== 0
              ? false
              : true
          }
        >
          <PiFloppyDisk />
          save
        </button>
        <button
          className="flex items-center gap-2 py-3 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 uppercase disabled:bg-blue-700 disabled:cursor-not-allowed"
          onClick={confirm1}
          disabled={buttonLable === "update" ? false : true}
        >
          <PiUpload />
          update
        </button>
        <button
          disabled={buttonLable === "update" ? false : true}
          className="flex items-center gap-2 py-3 px-4 text-white disabled:bg-yellow-700 disabled:cursor-not-allowed bg-yellow-500 rounded-md hover:bg-yellow-600 uppercase"
          onClick={printWithoutGST}
        >
          <PiPrinterDuotone />
          Print
        </button>
      </div>
    </div>
  );
}
export default Invoice2;
