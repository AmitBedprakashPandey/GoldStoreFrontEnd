import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createInvoice,
  fetchAllInvoices,
  fetchOneInvoices,
  updateInvoice,
} from "../Store/Slice/InvoiceWithoutGstSlice";
import { fetchAllBranch } from "../Store/Slice/BranchSlice";
import { fetchAllCustomers } from "../Store/Slice/CustomerSlice";
import { fetchAllPyBank } from "../Store/Slice/PayBankSlice";
import { fetchAllPyMode } from "../Store/Slice/PayModeSlice";
import {
  fetchOneInvoicesId,
  updateInvoicesId,
} from "../Store/Slice/InvoiceWithoutGstIdSlice";
import toast, { toastConfig } from "react-simple-toasts";
import moment from "moment";
import Loading from "./Loading";
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

  const disptch = useDispatch();
  const { Branch } = useSelector((state) => state.Branchs);
  const { Customer } = useSelector((state) => state.Customers);
  const { invoiceId } = useSelector((state) => state.InvoiceWithoutGstID);
  const { PyMode } = useSelector((state) => state.Mode);
  const { PyBank } = useSelector((state) => state.Bank);
  const { Invoice, error, loading, message } = useSelector(
    (state) => state.InvoicesWithoutGst
  );
  const [InvoiceId, setInvoiceId] = useState(invoiceId?.invoiceid);

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
    disptch(fetchOneInvoicesId());
    disptch(fetchAllPyBank());
    disptch(fetchAllPyMode());
    setInvoiceDate(moment().format("YYYY-MM-DD"));
  }, []);

  const quotionIdHandler = (e) => {
    disptch(fetchOneInvoices(InvoiceId)).then((req, res) => {
      if (req?.payload?.message) {
        toast(req?.payload?.message);
        return setButtonLable("");
      }
      setButtonLable("update");
      setFormData(req.payload.data);
      setInvoiceDate(moment(Invoice[0]?.quotdate).format("YYYY-MM-DD"));
      setInvoiceArray(req.payload.data?.invoice);
    });
  };
  useEffect(() => {
    setInvoiceId(Number(invoiceId.invoiceid));
  }, [invoiceId]);

  const updateInvoiceInpt = () => {
    const t =
      Number(invoiceData?.weight) *
      Number(invoiceData?.rate) *
      Number(invoiceData?.qty);
    setInvoiceData({
      ...invoiceData,
      total: t + (t * Number(invoiceData?.mcharg)) / 100 || 0,
      // total: Number(invoiceData?.weight) * Number(invoiceData?.rate) * Number(invoiceData?.qty) + (Number('0.'+invoiceData?.mcharg)) || "",
      nettotal:
        parseFloat(
          Number(invoiceData?.total) -
            (Number(invoiceData?.disc) * Number(invoiceData?.total)) / 100
        ).toFixed(2) || 0,
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
      gtotal: invoiceArray?.reduce(
        (accumulator, current) =>
          accumulator + parseFloat(Number(current.nettotal).toFixed(2)),
        0
      ),
      belamt: parseFloat(
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
    updateInvoiceInpt();
    setInvoiceArray(data);
  };

  useEffect(() => {
    updateInvoiceInpt();
  }, [
    invoiceArray,
    formData?.belamt,
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

  const save = () => {
    disptch(
      createInvoice({
        ...formData,
        invoice: invoiceArray,
        user: localStorage.getItem("user"),
        status: false,
      })
    ).then(() =>
      disptch(updateInvoicesId(InvoiceId)).then(() => {
        disptch(fetchOneInvoicesId());
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
          nettotal: "",
        });
        setInvoiceArray([]);
        setFormData({
          branch: "",
          customer: "",
          total: "",
          ttax: "",
          gtotal: "",
          mode: "",
          bank: "",
          pycheq: "",
          paidamt: "",
          belamt: "",
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

  const printWithoutGST = () => {
    navigate("/print", { state: { invoiceId: formData?._id } });
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div className="lg:mx-16 ">
      {loading && <Loading />}
      {error && error}
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
        <div className="grid lg:grid-cols-3">
          <div className="m-3">
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
                  className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
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
                  className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="">Weight (grams) </label>
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
                  className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
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
                  className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
              <div className="m-3 grid">
                <label className="text-sm">
                  Making Charges <strong>%</strong>{" "}
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
                  className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
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
                  className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
                />
              </div>
            </div>
            <div className="flex">
              <div className=" m-3 grid">
                <label className="">NET TOTAL </label>
                <input
                  type="tel"
                  placeholder="0000"
                  name="nettotal"
                  value={invoiceData?.nettotal}
                  onChange={invoiceDataHandler}
                  disabled
                  className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
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

        <div className="relative overflow-x-auto mx-0 py-3 flex justify-center ">
          <table className="overflow-x-scroll lg:overflow-x-hidden shadow-gray-400 shadow-md border-gray-300 border">
            <tr className="text-sm bg-gray-100 flex">
              <th className="w-36 py-3 px-2 flex ">Description</th>
              <th className=" w-20 flex py-3 px-2 ">Wight</th>
              <th className="w-10 flex py-3 px-2  ">Qty.</th>
              <th className="w-28 flex py-3 px-2  ">Making Charges %</th>
              <th className="w-16 flex py-3 px-2  ">Rate</th>
              <th className="w-16 flex py-3 px-2  ">Amt.</th>
              <th className="w-24 flex py-3 px-2  ">Discount %</th>
              <th className="w-28 flex py-3 px-2  ">Net Tot.</th>
              <th className="flex py-3 px-2  ">Action</th>
            </tr>

            <div className="max-h-48">
              {invoiceArray?.map((doc, index) => (
                <tr
                  key={index}
                  className="text-sm flex items-center border-gray-200 border"
                >
                  <td className="w-36 px-2 py-3 flex  truncate">{doc?.desc}</td>
                  <td className="w-20 flex px-2 py-3   truncate">
                    {parseFloat(doc?.weight).toFixed(2)}
                  </td>
                  <td className="w-10 flex px-2 py-3   truncate">{doc?.qty}</td>
                  <td className="w-28  flex px-10 py-3   truncate">
                    {parseFloat(doc?.mcharg).toFixed(2)}
                  </td>
                  <td className="w-16 flex px-2 py-3   truncate">
                    {doc?.rate}
                  </td>
                  <td className="w-16 flex px-2 py-3   truncate">
                    {doc?.total}
                  </td>

                  <td className="w-24 flex py-3 px-10">{doc?.disc}</td>
                  <td className="w-24 flex py-3 px-2  ">
                    {parseFloat(doc?.nettotal).toFixed(2)}
                  </td>

                  <td className="flex gap-2 py-3 pl-5  ">
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
        <div className="md:grid grid-cols-2">
          <div className="flex flex-wrap  gap-3 py-3">
            <div className=" grid">
              <label className="">Total Amt.</label>
              <input
                type="tel"
                placeholder="0000"
                disabled
                name="tamt"
                value={formData?.tamt}
                onChange={formDataHandler}
                className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
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
                className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
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
                className="w-24 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 py-3">
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
                value={
                  formData?.bank && formData?.mode === "Bank"
                    ? formData?.bank
                    : ""
                }
                onChange={formDataHandler}
                className="border-gray-300 border shadow-gray-400 shadow-sm py-3 px-3 w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <option selected aria-selected disabled value={""}>
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
                value={
                  formData?.bank && formData?.mode === "Bank"
                    ? formData?.pycheq
                    : 0
                }
                onChange={
                  formData?.bank && formData?.mode === "Bank"
                    ? formDataHandler
                    : ""
                }
                className="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </div>
            <div className=" grid">
              <label className="text-sm">Paid Amt. </label>
              <input
                type="tel"
                placeholder="0000"
                name="paidamt"
                value={formData?.paidamt || 0}
                onChange={formDataHandler}
                className="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
            <div className=" grid">
              <label className="text-sm">Bel. Amt. </label>
              <input
                type="tel"
                placeholder="0000"
                name="belamt"
                disabled
                value={formData?.belamt}
                onChange={formDataHandler}
                className="w-28 py-3 px-3 border-gray-300 border shadow-gray-400 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center fixed bottom-0 left-0 right-0 bg-white py-3 border-t">
        <button
          className="py-3 px-10 text-white bg-green-500 rounded-md hover:bg-green-600 uppercase disabled:bg-green-700 disabled:cursor-not-allowed"
          onClick={save}
          disabled={buttonLable === "save" ? false : true}
        >
          save
        </button>
        <button
          className="py-3 px-10 text-white bg-blue-500 rounded-md hover:bg-blue-600 uppercase disabled:bg-blue-700 disabled:cursor-not-allowed"
          onClick={update}
          disabled={buttonLable === "update" ? false : true}
        >
          update
        </button>
        <button
          className="py-3 px-10 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 uppercase"
          onClick={printWithoutGST}
        >
          Print
        </button>
      </div>
    </div>
  );
}
export default Invoice2;
