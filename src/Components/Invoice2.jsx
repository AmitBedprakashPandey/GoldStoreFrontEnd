import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
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
import { PiPlusBold } from "react-icons/pi";
import { Button } from "primereact/button";
function Invoice2({}) {
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
  const [modal2Open, setModal2Open] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);
  const disptch = useDispatch();
  const { Branch } = useSelector((state) => state.Branchs);
  const { Customer } = useSelector((state) => state.Customers);
  const { invoiceId } = useSelector((state) => state.InvoiceID);
  const { PyMode } = useSelector((state) => state.Mode);
  const { PyBank } = useSelector((state) => state.Bank);
  const { Invoice, error, loading, message } = useSelector(
    (state) => state.Invoices
  );
  const [InvoiceId, setInvoiceId] = useState();
  const { InvoiceNumberGst } = useSelector((state) => state.InvoiceNumberGst);
  const { Company } = useSelector((state) => state.Company);

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

  useEffect(() => {
    disptch(fetchAllBranch());
    disptch(fetchAllCustomers());
    disptch(fetchOneInvoiceNumberGst(Company._id));
    disptch(fetchAllPyBank());
    disptch(fetchAllPyMode());
    setInvoiceDate(moment().format("YYYY-MM-DD"));
  }, [disptch]);

  const quotionIdHandler = (e) => {
    disptch(fetchOneInvoice(InvoiceId)).then((req, res) => {
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

  useEffect(() => {
    setInvoiceId(Number(InvoiceNumberGst?.number));
  }, [InvoiceNumberGst]);

  const calculateNetTotal = () => {
    const net =
      Number(invoiceData?.total) -
      (Number(invoiceData?.total) * Number(invoiceData?.disc)) / 100;
    const sgsts = (net * Number(invoiceData?.sgst)) / 100;
    const cgsts = (Number(net) * Number(invoiceData?.cgst)) / 100;
    const igsts = (Number(net) * Number(invoiceData?.igst)) / 100;
    return net + sgsts + cgsts + igsts || 0;
  };

  const updateInvoiceInpt = () => {
    const t =
      Number(invoiceData?.weight) *
      Number(invoiceData?.rate) *
      Number(invoiceData?.qty);
    setInvoiceData({
      ...invoiceData,
      total: t + (t * Number(invoiceData?.mcharg)) / 100 || 0,
      // total: Number(invoiceData?.weight) * Number(invoiceData?.rate) * Number(invoiceData?.qty) + (Number('0.'+invoiceData?.mcharg)) || "",
      nettotal: parseFloat(calculateNetTotal()).toFixed(2) || 0,
    });
    setFormData({
      ...formData,
      tamt: invoiceArray?.reduce(
        (accumulator, current) => accumulator + current.total,
        0
      ),
      tdisc: invoiceArray?.reduce(
        (accumulator, current) =>
          accumulator + (Number(current.total) * Number(current.disc)) / 100,
        0
      ),
      ttax: invoiceArray?.reduce(
        (accumulator, current) =>
          accumulator +
          ((Number(current?.total) -
            (Number(current.total) * Number(current.disc)) / 100) *
            (Number(current?.sgst) +
              Number(current.cgst) +
              Number(current.igst))) /
            100,
        0
      ),
      gtotal: invoiceArray?.reduce(
        (accumulator, current) =>
          accumulator + parseFloat(Number(current.nettotal).toFixed(2)),
        0
      ),
      balamt: parseFloat(
        Number(formData?.gtotal) - Number(formData?.paidamt) ||
          Number(formData?.gtotal)
      ).toFixed(2),
    });
  };

  const AddBtn = () => {
    setInvoiceArray([...invoiceArray, invoiceData]);
    setInvoiceData({
      ...invoiceData,
      desc: "",
      hsn: "",
      purity: "",
      weight: "",
      rate: "",
      qty: "",
      mcharg: "",
      total: "",
      disc: "",
      sgst: "",
      cgst: "",
      igst: "",
      nettotal: "",
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
    updateInvoiceInpt();
  };

  useEffect(() => {
    updateInvoiceInpt();
  }, [
    invoiceArray,
    formData?.balamt,
    formData?.gtotal,
    formData?.ttax,
    formData?.total,
    formData?.paidamt,
    invoiceData?.weight,
    invoiceData?.desc,
    invoiceData?.rate,
    invoiceData?.qty,
    invoiceData?.mcharg,
    invoiceData?.disc,
    invoiceData?.sgst,
    invoiceData?.cgst,
    invoiceData?.igst,
  ]);

  const printWithGST = () => {
    navigate("/printgst", {
      state: {
        company: Company,
        customer: Customer.filter((doc) => doc?.name === formData?.customer),
        formData: formData,
        invoice: invoiceArray,
      },
    });
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
      console.table(formData);
      
      disptch(fetchAllInvoices());
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);
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
      <div className="mb-20 mt-10 p-3 bg-white shadow-gray-400 shadow-md rounded-lg overflow-hidden">
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
                className="py-2 px-5 bg-blue-500 rounded-lg text-white font-bold "
                onClick={quotionIdHandler}
              >
                Find
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
        <div className="flex items-center">
          <div className="m-3 max-w-96">
            <label className="">Customer Name : </label>
            <select
              className="border-gray-300 border shadow-gray-400 shadow-sm py-3 px-3 w-full"
              name="customer"
              value={formData?.customer}
              onChange={formDataHandler}
            >
              <option selected disabled>
                --Select Customer--
              </option>
              {Customer.map((doc, index) => (
                <option key={index} value={doc.branch}>
                  {doc.name}
                </option>
              ))}
            </select>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex">
              <div className="m-3 grid">
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
              <div className="m-3 grid">
                <label className="">Purity </label>
                <input
                  type="number"
                  placeholder="0000"
                  name="purity"
                  value={invoiceData?.purity}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="">Weight (g) </label>
                <input
                  type="number"
                  placeholder="0000"
                  name="weight"
                  value={invoiceData?.weight}
                  onChange={invoiceDataHandler}
                  className="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
            </div>
            <div className="flex">
              <div className="m-3 grid">
                <label className="">Rate </label>
                <input
                  type="number"
                  placeholder="0000"
                  name="rate"
                  value={invoiceData?.rate}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="">Qty. </label>
                <input
                  type="number"
                  placeholder="0000"
                  name="qty"
                  value={invoiceData?.qty}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="text-sm">
                  Making Chrg. <strong>%</strong>{" "}
                </label>
                <input
                  type="tel"
                  placeholder="0000"
                  name="mcharg"
                  value={invoiceData?.mcharg}
                  onChange={invoiceDataHandler}
                  className="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
            </div>
            <div className="flex">
              <div className="m-3 grid">
                <label className="">Total </label>
                <input
                  type="tel"
                  disabled
                  placeholder="0000"
                  name="total"
                  value={invoiceData?.total}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="">
                  Disc. <strong>%</strong>
                </label>
                <input
                  type="tel"
                  placeholder="0000"
                  name="disc"
                  value={invoiceData?.disc}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="">
                  SGST <strong>%</strong>
                </label>
                <input
                  type="tel"
                  placeholder="0000"
                  name="sgst"
                  value={invoiceData?.sgst}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
            </div>
            <div className="flex">
              <div className="m-3 grid">
                <label className="">
                  CGST <strong>%</strong>
                </label>
                <input
                  type="tel"
                  placeholder="0000"
                  name="cgst"
                  value={invoiceData?.cgst}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="">
                  IGST <strong>%</strong>
                </label>
                <input
                  type="tel"
                  placeholder="0000"
                  name="igst"
                  value={invoiceData?.igst}
                  onChange={invoiceDataHandler}
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className=" m-3 grid">
                <label className="">NET TOTAL </label>
                <input
                  type="tel"
                  placeholder="0000"
                  name="nettotal"
                  value={invoiceData?.nettotal}
                  onChange={invoiceDataHandler}
                  disabled
                  className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
            </div>
          </div>
          <button
            className="border p-3 rounded-full bg-blue-500 text-white absolute right-3 top-0 cursor-pointer"
            onClick={AddBtn}
          >
            <Plus />
          </button>
        </div>

        <div className="relative overflow-x-auto mx-0 py-3 flex md:justify-center ">
          <table
            border={1}
            className="overflow-x-scroll lg:overflow-x-hidden shadow-gray-400 shadow-md border-gray-300 border"
          >
            <tr className="text-sm bg-gray-100 flex">
              <th className="w-48 py-3 px-2 flex ">Description</th>
              <th className="w-20 flex py-3 px-2 ">Wight</th>
              <th className="w-10 flex py-3 px-2  ">Qty.</th>
              <th className="w-32 flex py-3 px-2  ">Make Charg.%</th>
              <th className="w-16 flex py-3 px-2  ">Rate</th>
              <th className="w-16 flex py-3 px-2  ">Amt.</th>
              <th className="w-28 flex py-3 px-2  ">Discount %</th>
              <th className="w-28 flex py-3 px-2  ">Net Tot.</th>
              <th className="flex py-3 px-2  ">Action</th>
            </tr>

            <div className="max-h-48">
              {invoiceArray?.map((doc, index) => (
                <tr key={index} className="text-sm flex items-center py-1.5">
                  <td className="w-48 px-2  flex  truncate">{doc?.desc}</td>
                  <td className="px-2   w-20  truncate">
                    {parseFloat(doc?.weight || 0).toFixed(2)}
                  </td>
                  <td className="flex px-2   w-10  truncate">{doc?.qty || 0}</td>
                  <td className="flex  w-32 px-10  truncate">
                    {parseFloat(doc?.mcharg || 0).toFixed(2)}
                  </td>
                  <td className="flex px-2   w-16  truncate">{parseFloat(doc?.rate || 0).toFixed(2)}</td>
                  <td className="flex px-2  w-16  truncate">{parseFloat(doc?.total || 0).toFixed(2)}</td>
                  <td className="flex px-2   w-16  truncate">{parseFloat(doc?.sgst || 0).toFixed(2)}</td>
                  <td className="flex px-2   w-16  truncate">{parseFloat(doc?.cgst || 0).toFixed(2)}</td>
                  <td className="flex px-2   w-16  truncate">{parseFloat(doc?.igst || 0).toFixed(2)}</td>
                  <td className="flex  px-2  w-24 ">
                    {parseFloat(doc?.nettotal).toFixed(2)}
                  </td>
                  <td className="flex gap-2   w-16 ">
                    <button
                      className="bg-red-500 duration-300 text-white hover:bg-red-600 p-1.5 rounded-full"
                      onClick={() => RemoveBtn(index)}
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </div>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 lg:grid-cols-9">
          <div className=" grid">
            <label className="">Total Amt.</label>
            <input
              type="tel"
              placeholder="0000"
              disabled
              name="tamt"
              value={formData?.tamt}
              onChange={formDataHandler}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Total Disc.</label>
            <input
              type="tel"
              disabled
              placeholder="0000"
              name="tdisc"
              value={formData?.tdisc}
              onChange={formDataHandler}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Total tax</label>
            <input
              type="tel"
              placeholder="0000"
              name="tottax"
              disabled
              value={parseFloat(formData?.ttax).toFixed(2)}
              onChange={formDataHandler}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Grand Amt. </label>
            <input
              type="tel"
              placeholder="0000"
              disabled
              name="gtotal"
              value={parseFloat(formData?.gtotal).toFixed(2)}
              onChange={formDataHandler}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="">Mode </label>
            <select
              value={formData?.mode}
              onChange={formDataHandler}
              className="border-gray-300 border shadow-gray-400 shadow-sm  py-3 px-3 w-full"
              name="mode"
            >
              <option selected disabled>
                --Select Mode--
              </option>
              {PyMode?.map((doc, index) => (
                <option value={doc?.mode}>{doc?.mode}</option>
              ))}
            </select>
          </div>
          <div className=" grid">
            <label className="">Bank </label>
            <select
              disabled={formData?.mode === "Bank" ? false : true}
              name="bank"
              value={formData?.bank}
              onChange={formDataHandler}
              className="border-gray-300 border shadow-gray-400 shadow-sm py-3 px-3 w-full disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <option selected disabled>
                -- Select Bank --
              </option>
              {PyBank?.map((doc, index) => (
                <option value={doc.Bank}>{doc.bank}</option>
              ))}
            </select>
          </div>
          <div className=" grid">
            <label className="text-sm">Cheque no. </label>
            <input
              disabled={
                formData?.bank && formData?.mode === "Bank" ? false : true
              }
              type="tel"
              placeholder="0000"
              name="pycheq"
              value={formData?.pycheq}
              onChange={formDataHandler}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Paid Amt. </label>
            <input
              type="tel"
              placeholder="0000"
              name="paidamt"
              value={formData?.paidamt}
              onChange={formDataHandler}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
          <div className=" grid">
            <label className="text-sm">Bal. Amt. </label>
            <input
              type="tel"
              placeholder="0000"
              name="balamt"
              disabled
              value={formData?.balamt}
              onChange={formDataHandler}
              className="w-full py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center fixed bottom-0 left-0 right-0 bg-white py-3 border-t">
        <button
          className="py-3 px-10 text-white bg-green-500 rounded-md hover:bg-green-600 uppercase disabled:bg-green-700 disabled:cursor-not-allowed"
          onClick={() => setModal1Open(true)}
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
          save
        </button>
        <button
          className="py-3 px-10 text-white bg-blue-500 rounded-md hover:bg-blue-600 uppercase disabled:bg-blue-700 disabled:cursor-not-allowed"
          onClick={() => setModal2Open(true)}
          disabled={buttonLable === "update" ? false : true}
        >
          update
        </button>

        <button
          disabled={buttonLable === "update" ? false : true}
          className="py-3 px-10 text-white disabled:bg-red-700 bg-red-500 rounded-md hover:bg-red-600 uppercase"
          onClick={printWithGST}
        >
          Print
        </button>
      </div>
      <Modal
        centered
        open={modal1Open}
        onOk={() => {
          save();
          setModal1Open(false);
        }}
        closable={false}
        onCancel={() => setModal1Open(false)}
      >
        <label className="text-3xl ">Are you sure want to save ?</label>
      </Modal>

      <Modal
        centered
        open={modal2Open}
        onOk={() => {
          update();
          setModal2Open(false);
        }}
        closable={false}
        onCancel={() => setModal2Open(false)}
      >
        <label className="text-2xl capitalize">
          Are you sure want to update ?
        </label>
      </Modal>
    </div>
  );
}
export default Invoice2;
