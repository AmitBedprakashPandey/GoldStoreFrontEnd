import { useEffect, useRef, useState } from "react";
import { fetchAllInvoices, updateInvoice } from "../Store/Slice/QuatationSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import Cancel from "../asstes/cancel.png";
import moment from "moment";
import { Check, Eye, X } from "lucide-react";

import "./print.css";
import Holmark from "../asstes/download-removebg-preview.png";
import ReactToPrint from "react-to-print";
import { fetchOnePrint } from "../Store/Slice/PrintSlice";
import { fetchByUser } from "../Store/Slice/CompanySlice";
function Quotation(params) {
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [id, setId] = useState();
  const [Model, setModel] = useState(false);
  const [to, setTo] = useState();
  const [invoiceArray, setInvoiceArray] = useState([]);
  
  useEffect(() => {
    dispatch(fetchAllInvoices());
  }, []);
  
  const { Quotation, loading } = useSelector((state) => state.Quotation
  );
    
  useEffect(() => {
    dispatch(fetchAllInvoices());
  }, []);

  useEffect(() => {
    setInvoiceArray(Quotation);
  }, [Quotation]);

  const filteredArray = Quotation
  ? Quotation.filter((bill) => {
      const billDate = new Date(bill.quotdate);
      const fromDateObj = from ? new Date(from) : null;
      const toDateObj = to ? new Date(to) : null;

      const isDateInRange =
        (!fromDateObj || billDate >= fromDateObj) &&
        (!toDateObj || billDate <= toDateObj);

      return isDateInRange;
    })
  : [];

  const findData = () => {
    setInvoiceArray(filteredArray);
  };

  return (
    <div className="pt-5">
      {loading && <Loading />}
      {Model && <ViewPrint id={id} close={() => setModel(false)} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 m-3 max-w-[600px] mx-3 lg:mx-auto bg-white p-3 shadow-gray-400 shadow-md border-gray-300 border rounded-md">
        <div className="grid md:grid-cols-1">
          <label className="font-semibold">From : </label>
          <input
            type="date"
            value={moment(from).format("YYYY-MM-DD")}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full py-3 border px-3"
          />
        </div>
        <div className="grid md:grid-cols-1">
          <label className="font-semibold">To : </label>
          <input
            type="date"
            className="w-full py-3 border px-3"
            value={moment(to).format("YYYY-MM-DD")}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="">
          <button
            className="bg-blue-500 py-5 px-10 rounded-xl w-full lg:mt-8"
            onClick={findData}
          >
            Find
          </button>
        </div>
      </div>
      <div className="relative overflow-x-scroll mx-auto  max-w-[600px] bg-white shadow-gray-400 shadow-md border-gray-300 border rounded-md">
        <table className="overflow-x-scroll">
          <thead>
            <tr className="text-sm bg-gray-200">
              <th className="py-3 px-2 w-20 text-start">#</th>
              <th className="py-3 px-2 w-56 text-start">Decription</th>
              <th className="py-3 px-2 w-16 text-start">weight.</th>

              <th className="py-3 px-2 w-16 text-start">RATE</th>
              <th className="py-3 px-2 w-16 text-start">Grand Amt</th>
              <th className="py-3 px-2 w-16 text-start">Status</th>
              <th className="py-3 px-2 w-16 text-start">Action</th>
            </tr>
          </thead>
          <tbody className="overflow-hidden overflow-y-scroll ">
            {invoiceArray?.map((doc, index) => (
              <tr key={index} className="text-sm bg-gray-50">
                <td className="py-3 px-2 w-20 text-start">{doc.quot}</td>
                <td className="py-3 px-2 w-56 text-start">
                  {doc?.invoice.map((doc, index) => (
                    <span key={index}>{doc.desc + " ,"}</span>
                  ))}
                </td>

                <td className="py-3 px-2 w-28 text-start">
                  {doc?.invoice.map((doc, index) => (
                    <span key={index}>{doc.weight + ","}</span>
                  ))}
                </td>
                <td className="py-3 px-2 w-16 text-start">
                  {doc?.invoice.map((doc, index) => (
                    <span key={index}>{doc.rate + ","}</span>
                  ))}
                </td>
                <td className="py-3 px-2 w-16 text-start">{doc.gtotal}</td>
                <td className="py-3 px-2 w-16 text-start">
                  {doc.status === false ? (
                    <Check
                      size={36}
                      strokeWidth={5}
                      absoluteStrokeWidth
                      color="green"
                    />
                  ) : (
                    <X
                      size={36}
                      strokeWidth={5}
                      absoluteStrokeWidth
                      color="red"
                    />
                  )}
                </td>
                <td className="py-3 px-2 w-16 text-start">
                  <button
                    className="bg-blue-500 p-3 rounded-full text-white"
                    onClick={() => {
                      setId(doc._id);
                      setModel(true);
                    }}
                  >
                    <Eye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ViewPrint = ({ close, id }) => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const { Print } = useSelector((state) => state.print);
  const { Company } = useSelector((state) => state.Company);

  useEffect(() => {
    dispatch(fetchOnePrint(id));
    dispatch(fetchByUser(localStorage.getItem("user")));
  }, []);

  const onCancel = () => {
    dispatch(updateInvoice({ ...Print._doc, status: true })).then(() => {
      dispatch(fetchOnePrint(id));
    });
  };
  const onUnDoCancel = () => {
    dispatch(updateInvoice({ ...Print._doc, status: false })).then(() => {
      dispatch(fetchOnePrint(id));
    });
  };
  return (
    <>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 z-50 overflow-y-auto overflow-x-hidden"
        style={{ backgroundColor: "rgb(0,0,0,0.65)" }}
      >
        <div className="md:fixed flex items-center top-0 z-50 m-3">
          <ReactToPrint
            trigger={() => (
              <button className="rounded-md text-white hover:bg-blue-600 duration-300 bg-blue-500 px-10 py-3 uppercase">
                Print
              </button>
            )}
            content={() => componentRef.current}
          />
         <button
            className="ml-3 rounded-md text-xs md:text-sm text-white hover:bg-red-600 duration-300 bg-red-500 px-10 py-3 uppercase"
            onClick={Print._doc?.status === true ? onUnDoCancel : onCancel}
          >
            {Print._doc?.status === true ? "undo cancel" : "cancel"}
          </button>

        <button
          type="button"
          onClick={close}
           className="ml-3   rounded-md text-white hover:bg-red-600 duration-300 bg-red-500 px-10 py-2.5 uppercase"
          >
         Close
        </button>
          </div>
        <div className="A4Page p-3 relative" ref={componentRef}>
        {Print._doc?.status === true ? (
            <img
              src={Cancel}
              alt="cancel logo"
              className="absolute left-52 bottom-80 w-96"
            />
          ) : (
            ""
          )}
          <div className="border-black border-2">
            <div className="flex justify-between items-center p-2">
            <div className="w-28 h-24 ">
              <img src={Company.logo} className="w-full h-full" alt="holmart" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">JAI MATA DI</h3>
                <h1 className="font-bold text-3xl uppercase">
                  {Company?.name}
                </h1>
                <h3 className="text-lg font-semibold">TAX INVOICE</h3>
              </div>
              <div className="w-28 h-24">
                <img src={Holmark} width={100} alt="holmart" />
              </div>
            </div>
            <div className="border-black border border-l-0 border-r-0 px-3 py-2 flex justify-between">
              <div className="flex flex-col">
                <label className="text-lg">
                Invoice No : <span>{Print._doc?.quot}</span>
                </label>
                <label className="text-lg">
                  Date :{" "}
                  <span>
                    {moment(Print._doc?.quotdate).format("DD-MM-YYYY")}
                  </span>
                </label>
                <label className="text-lg">
                  State Code : <span></span>
                </label>
              </div>
              <div className="flex flex-col w-72">
                <label className="text-lg">
                  Payment Mode : {Print._doc?.mode}
                </label>
                <label className="text-lg">
                  Delivery Mode : <span></span>
                </label>
                <label className="text-lg">
                  Place of Supply : <span></span>
                </label>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-full">
                <div className="px-3 h-7 border-black border border-t-0 border-r-0 border-l-0">
                  <label className="text-lg">
                    <span></span>
                  </label>
                </div>
              </div>
              <div className="w-full">
                <div className="px-3 border-black border border-t-0 border-r-0">
                  <label className="text-lg">
                    Customer Details <span></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
            <div className="w-full border-black border border-t-0 border-l-0 border-r-0 border-b-0">
                <div className="px-3 py-2 h-32 ">
                  <label className="flex">
                    <label className="w-[120px] font-bold">Billed to :</label>
                    <ul className="">
                      <li className="text-md text-blue-700 font-bold mt-1 capitalize">{Print.company?.name}</li>
                      <li className="text-sm text-blue-700 font-normal">{Print.company?.address}</li>
                    </ul>
                  </label>
                </div>
                <div className="w-full px-3 flex flex-col">
                  <label className="text-sm font-bold">
                    Party PAN : <span className="font-normal">{Print.company?.pan}</span>
                  </label>
                  <label className="text-sm font-bold">
                    Party Mobile No. : <span className="font-normal">{Print.company?.mobile}</span>
                  </label>
                  <label className="text-sm font-bold">
                    GSTIN / UIN : <span className="font-normal">{Print.company?.gst}</span>
                  </label>
                </div>
              </div>
              <div className="w-full border-black border border-t-0 border-b-0 border-r-0">
                <div className="px-3 py-2 h-32 ">
                  <label className="flex text-lg">
                    <label className="w-[120px] text-sm font-bold">Shipped to :</label>
                    <ul className="text-sm capitalize">
                      <li className="font-bold text-md">{Print.customer?.name}</li>
                      <li>{Print.customer?.address}</li>
                    </ul>
                  </label>
                </div>
                <div className="w-full px-3 flex flex-col">
                  <label className="text-sm font-bold">
                    Party PAN : <span className="font-normal">{Print?.customer?.pan}</span>
                  </label>
                  <label className="text-sm font-bold">
                    Party Mobile No. : <span className="font-normal">{Print?.customer?.mobile}</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <table>
                <thead>
                  <tr className="text-xs">
                    <th className="border-black border border-l-0 border-r-0  text-center  w-5 py-4">
                      SN.
                    </th>
                    <th className=" border-black text-center  border w-40">
                      Description Goods
                    </th>
                    <th className=" border-black text-center  border w-10">
                      HSN
                    </th>
                    <th className=" border-black text-center  border w-16">
                      PURITY
                    </th>
                    <th className=" border-black text-center  border w-16">
                      WEIGHT IN (grams)
                    </th>
                    <th className=" border-black text-center  border w-16">
                      MAKING CHARGES
                    </th>
                    <th className=" border-black text-center  border w-16">
                      QTY.
                    </th>
                    <th className=" border-black text-center  border w-16">
                      RATE
                    </th>
                    <th className=" border-black text-center  border w-16">
                      SGST
                    </th>
                    <th className=" border-black text-center  border w-16">
                      CGST
                    </th>
                    <th className=" border-black text-center  border w-16">
                      IGST
                    </th>
                    <th className=" border-black text-center  border border-r-0 w-28">
                      TOTAL
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Print._doc?.invoice?.map((doc, index) => (
                    <tr className="text-xs">
                      <td className="border-black  text-center border border-l-0 w-5 py-2">
                        1
                      </td>
                      <td className=" border-black text-start pl-3  border w-40">
                        {doc?.desc}
                      </td>
                      <td className=" border-black text-center  border w-10">
                        {doc?.hsn}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.purity}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.weight}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.mcharg}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.qty}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.rate}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.sgst}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.cgst}
                      </td>
                      <td className=" border-black text-center  border w-16">
                        {doc?.igst}
                      </td>
                      <td className=" border-black text-center  border border-r-0 w-28">
                        {doc?.nettotal}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <th
                      colSpan={11}
                      className="text-xs border-black border border-l-0 w-5 text-end pr-3"
                    >
                      Total Discount
                    </th>

                    <th
                      colSpan={4}
                      className=" text-xs border-black border border-r-0 w-16"
                    >
                      {Print?._doc?.tdisc}
                    </th>
                  </tr>
                  <tr className="text-xs">
                    <th
                      colSpan={11}
                      className="border-black text-end pr-3 border border-l-0 w-5"
                    >
                      Total Tax
                    </th>

                    <th
                      colSpan={4}
                      className=" border-black border border-r-0 w-16"
                    >
                      {Print?._doc?.ttax}
                    </th>
                  </tr>
                  <tr className="text-xs">
                    <th
                      colSpan={11}
                      className="border-black border border-l-0 border-r-0 w-5 text-end pr-3"
                    >
                      Grand Total
                    </th>
                    <th
                      colSpan={4}
                      className=" border-black border border-r-0 text-center w-16 pl-3"
                    >
                      {Print?._doc?.gtotal}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="text-xs p-3">
              <p>Terms & Condition</p>
              <p>Ε.&.Ο.Ε.</p>
              <br />
              <p>1. Goods once sold will not be taken back.</p>
              <p>
                2. Ourresponsibility ceases after delivery or dispatch of goods.
              </p>
              <p>
                3. Please note that, the net amount includes Metal Value, Cost
                of Stones (Precious, Non- Precious and other material Charges),
                Product Making Charges?Wastage Charges, GST and othertaxes (as
                applicable). Upon specficrequest detailed statement will be
                provided.
              </p>
              <p>4. Weight verified and Received product in good condition.</p>
              <p>
                5. The Consumer can get the purity of hallmarked
                jewllery/artifacts verified from any of the BIS recognised A & H
                centre.
              </p>
              <p>
                6. Hallmarking charges is Rs. 45.00/- perpiece. 7. All dispute
                Subject to Faridabad Jurisdiction.
              </p>
            </div>
            <div className="flex justify-around">
              <div className="w-32 h-32 flex flex-col items-center">
                <div className="h-28 w-28 border-black border-b"></div>
                <p className="text-xs py-2 ">Auth Signatory</p>
              </div>
              <div className="w-32 h-32 flex flex-col items-center">
                <div className="h-28 w-28 border-black border-b"></div>
                <p className="text-xs py-2">Customer's Signature</p>
              </div>
            </div>

            <div className="flex justify-around text-xs py-5 px-4">
              <label>
                BANK : <span>HDFC BANK</span>
              </label>
              <label>
                ACCOUNT NO : <span>50200077514572</span>
              </label>
              <label>
                IFSC CODE :<span>HDFC0001733</span>
              </label>
              <label>
                BRANCH : <span>SECTOR -35, FARIDABAD-121003</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Quotation;
