import { useEffect, useRef, useState } from "react";
import {
  fetchAllInvoices,
  updateInvoice,
} from "../Store/Slice/InvoiceWithoutGstSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import Cancel from "../asstes/cancel.png";
import moment from "moment";
import { PiCheck, PiEye, PiX, PiMagnifyingGlassDuotone, PiFilePdf, PiFileXls } from "react-icons/pi";
import "./print.css";
import Holmark from "../asstes/download-removebg-preview.png";
import ReactToPrint from "react-to-print";
import { fetchOnePrint } from "../Store/Slice/PrintWithoutGstSlice";
import { fetchByUser } from "../Store/Slice/CompanySlice";
import { fetchAllCustomers } from "../Store/Slice/CustomerSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

function QuotationWithoutGst(params) {
  const dispatch = useDispatch();
  const DataTableRef = useRef(null);
  const [from, setFrom] = useState();
  const [id, setId] = useState();
  const [Model, setModel] = useState(false);
  const [to, setTo] = useState();
  const { Company } = useSelector((state) => state.Company);
  const { Customer } = useSelector((state) => state.Customers);

  const { Invoices, loading } = useSelector(
    (state) => state.InvoicesWithoutGst
  );
  const [invoiceArray, setInvoiceArray] = useState([]);

  useEffect(() => {
    dispatch(fetchAllInvoices());
    dispatch(fetchAllCustomers());
  }, [Model]);

  useEffect(() => {
    setInvoiceArray(Invoices);
  }, [Invoices]);

  const filteredArray = Invoices?.filter((bill) => {
    const billDate = new Date(bill.quotdate);
    const fromDateObj = from ? new Date(from) : null;
    const toDateObj = to ? new Date(to) : null;

    const isDateInRange =
      (!fromDateObj || billDate >= fromDateObj) &&
      (!toDateObj || billDate <= toDateObj);

    return isDateInRange;
  });

  const findData = () => {
    setInvoiceArray(filteredArray);
  };

  const printWithGST = (data) => {
    const datas = {
      company: Company,
      customer: Customer.filter((doc) => doc.name === data.customer),      
     invoice: data?._id,
    };        
    console.log(datas);
    
    sessionStorage.setItem("printData", JSON.stringify(datas));
    window.open("/printwithoutgst", "_blank");
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();

         // Add header
      doc.setFontSize(16);
      doc.text("Quotation Report", 105, 10, { align: "center" }); // Centered header
      doc.text(Company?.name, 105, 16, { align: "center" }); // Centered header
      doc.setFontSize(8);
      doc.text(`Generated on: ${moment().format("DD-MM-YYYY HH:mm:ss")}`, 105, 20, { align: "center" });

  
        const tableBody = invoiceArray.map((invoice) => [
          invoice.quot,
          invoice.customer,
          invoice.invoice.map((doc) => doc.desc).join(", "), // Description
          invoice.invoice.map((doc) => doc.weight).join("/"), // Weight
          invoice.invoice.map((doc) => doc.rate).join("/"), // Rate
          parseFloat(invoice.balamt).toFixed(0), // Balance Amount
          parseFloat(invoice.gtotal).toFixed(0), // Grand Total
          invoice.mode,
          invoice.status ? "Paid" : "Pending", // Status
        ]);
  
        const tableHead = [
          "Bill No.",
          "Customer",
          "Description",
          "Weight (g)",
          "Rate",
          "Bal. Amt",
          "Grnd. Amt",
          "Mode",
          "Status",
        ];
  
        doc.autoTable({
          head: [tableHead],
          body: tableBody,
          startY:25,
          theme: "grid",
        });
  
        doc.save("invoices.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      // Prepare data for the Excel sheet
      const data = invoiceArray.map((invoice) => ({
        "Bill No.": invoice.quot,
        Customer: invoice.customer,
        Description: invoice.invoice.map((doc) => doc.desc).join(", "),
        "Weight (g)": invoice.invoice.map((doc) => doc.weight).join("/"),
        Rate: invoice.invoice.map((doc) => doc.rate).join("/"),
        "Bal. Amt": parseFloat(invoice.balamt).toFixed(0),
        "Grnd. Amt": parseFloat(invoice.gtotal).toFixed(0),
        Mode: invoice.mode,
        Status: invoice.status ? "Paid" : "Pending",
      }));
  
      // Create a worksheet and workbook
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Invoices");
  
      // Export the Excel file
      xlsx.writeFile(workbook, "invoices.xlsx");
    });
  };

  const discriptionBody=(rowData)=>{
    return(
      <div>
        {rowData?.invoice.map((doc)=>(doc?.desc + ","))}
      </div>
    )
    
    
    }
    const weightBody=(rowData)=>{
      return(
        <div>
          {rowData?.invoice.map((doc)=>(doc?.weight + "/"))}
        </div>
      )
      
    }
    const rateBody=(rowData)=>{
        console.log(rowData);
        return(
          <div>
    
            {rowData?.invoice.map((doc)=>(doc?.rate + "/"))}
          </div>
        )
        
    }
    const balAmtBody=(rowData)=>{
      console.log(rowData);
      return(
        <div>
          {parseFloat(rowData?.balamt).toFixed(0)}
        </div>
      )
      
    }
    
    const header = (
      <div className="flex justify-between items-center gap-2">      
          <label>Quotaion List</label>
          <div className="flex gap-3">
          <Button type="button" icon={<PiFileXls color="#fff" size={30} />}  severity="success" onClick={exportExcel} className="bg-blue-500" rounded  data-pr-tooltip="XLS" />
          <Button type="button" icon={<PiFilePdf color="#fff" size={30} />} severity="warning" onClick={exportPdf} className="bg-green-500" rounded data-pr-tooltip="PDF" />
          </div>
      </div>
    );

  return (
    <div className="pt-5 bg-white h-screen">
      {loading && <Loading />}
      {Model && <ViewPrint id={id} close={() => setModel(false)} />}
      <div className=" mx-auto w-12/12 md:w-9/12 lg:w-4/12    ">
        <div className="flex gap-3">
          <div className="grid">
            <label className="font-medium text-xs">From : </label>
            <input
              type="date"
              value={moment(from).format("YYYY-MM-DD")}
              onChange={(e) => setFrom(e.target.value)}
                 className="w-full border border-black/30 px-3 rounded-lg"
            />
          </div>
          <div className="grid">
            <label className="font-medium text-xs">To : </label>
            <input
              type="date"
                 className="w-full border border-black/30 px-3 rounded-lg"
              value={moment(to).format("YYYY-MM-DD")}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="">
            <button
              className="flex gap-3 text-lg text-white font-bold items-center justify-center bg-blue-500  px-5 rounded-xl w-full mt-4"
              onClick={findData}
            >
              <PiMagnifyingGlassDuotone />
              Find
            </button>
          </div>
        </div>
      </div>
 <div className="mx-auto w-12/12 h-9/12 md:w-9/12 lg:12/12">
      <DataTable
      value={invoiceArray}
      showGridlines={true}     
      header={header} 
      ref={DataTableRef}
      tableStyle={{minWidth:"500px"}}
      >
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="Bill No."  field="quot"  />
<Column headerClassName="p-0" bodyClassName="p-0 " header="Customer" field="customer"  />
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="Discription"  body={discriptionBody} />
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="weight (g)" field="customer" body={weightBody}  />
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="Rate" field="customer" body={rateBody}  />
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header=" Bal. Amit" field="balamt" body={balAmtBody} />
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header=" Grnd. Amt" field="customer" body={(rowData)=>parseFloat(rowData?.gtotal).toFixed(0)}  />
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="Mode" field="customer"  body={(rowData)=>rowData?.mode}/>
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="Status" field="customer" body={(rowData)=>rowData?.status ? <PiX size={20} /> : <PiCheck size={20} />} />
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="Action" body={(rowData) => <Button icon={<PiEye size={20} />} onClick={()=>printWithGST(rowData)} />}  />

      </DataTable>
    </div>
    </div>
  );
}

const ViewPrint = ({ close, id }) => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const [print, setPrint] = useState();
  const [refresh, setRefresh] = useState();
  const { Company } = useSelector((state) => state.Company);
  const { Invoices, loading } = useSelector(
    (state) => state.InvoicesWithoutGst
  );
  const { Customer } = useSelector((state) => state.Customers);

  useEffect(() => {
    const invoice = Invoices.filter((doc) => doc._id === id);
    const customer = Customer.filter((doc) => doc.name === invoice[0].customer);
    setPrint({ ...invoice[0], customer });
  }, [id]);

  const onCancel = () => {
    dispatch(updateInvoice({ ...print, status: true })).then(() => close());
  };
  const onUnDoCancel = () => {
    dispatch(updateInvoice({ ...print, status: false })).then(() => close());
  };
  return (
    <>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 z-50"
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
            onClick={print?.status === true ? onUnDoCancel : onCancel}
          >
            {print?.status === true ? "undo cancel" : "cancel"}
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
          {print?.status === true ? (
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
                <img
                  src={Company.logo}
                  className="w-full h-full"
                  alt="holmart"
                />
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
                  Invoice No : <span>{print?.quot}</span>
                </label>
                <label className="text-lg">
                  Date :{" "}
                  <span>{moment(print?.quotdate).format("DD-MM-YYYY")}</span>
                </label>
                {/* <label className="text-lg">
                State Code : <span></span>
              </label> */}
              </div>
              <div className="flex flex-col w-72">
                <label className="text-lg">
                  Payment Mode :{print?.mode} <span></span>
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
              <div className="w-full border-black border border-t-0 border-l-0 border-r-0 border-b-0">
                <div className="px-3 py-2 h-32 ">
                  <label className="flex">
                    <label className="w-[120px] font-bold">Billed to :</label>
                    <ul className="">
                      <li className="text-md text-blue-700 font-bold mt-1 capitalize">
                        {Company?.name}
                      </li>
                      <li className="text-sm text-blue-700 font-normal">
                        {Company?.address}
                      </li>
                    </ul>
                  </label>
                </div>
                <div className="w-full px-3 flex flex-col">
                  <label className="text-sm font-bold">
                    Party PAN :{" "}
                    <span className="font-normal">{Company?.pan}</span>
                  </label>
                  <label className="text-sm font-bold">
                    Party Mobile No. :{" "}
                    <span className="font-normal">{Company?.mobile}</span>
                  </label>
                  <label className="text-sm font-bold">
                    GSTIN / UIN :{" "}
                    <span className="font-normal">{Company?.gst}</span>
                  </label>
                </div>
              </div>
              <div className="w-full border-black border border-t-0 border-b-0 border-r-0">
                <div className="px-3 py-2 h-32 ">
                  <label className="flex text-lg">
                    <label className="w-[120px] text-sm font-bold">
                      Shipped to :
                    </label>
                    <ul className="text-sm capitalize">
                      <li className="font-bold text-md">
                        {print?.customer[0]?.name}
                      </li>
                      <li>{print?.customer[0]?.address}</li>
                    </ul>
                  </label>
                </div>
                <div className="w-full px-3 flex flex-col">
                  <label className="text-sm font-bold">
                    Party PAN :{" "}
                    <span className="font-normal">
                      {print?.customer[0]?.pan}
                    </span>
                  </label>
                  <label className="text-sm font-bold">
                    Party Mobile No. :{" "}
                    <span className="font-normal">
                      {print?.customer[0]?.mobile}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <table>
                <thead>
                  <tr className="text-xs">
                    <th className="border-black border border-l-0 border-r-0  text-center  w-8">
                      SN.
                    </th>
                    <th className=" border-black text-center  border w-72">
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
                    <th className=" border-black text-center  border border-r-0 w-28">
                      TOTAL
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {print?.invoice?.map((doc, index) => (
                    <tr key={index} className="text-xs">
                      <td className="border-black  text-center border border-l-0 w-5 py-2">
                        {index + 1}
                      </td>
                      <td className=" border-black text-start border w-40 pl-3">
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
                      <td className=" border-black text-center  border border-r-0 w-28">
                        {doc?.total}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="text-xs">
                    <th
                      colSpan={8}
                      className="border-black border border-l-0 border-r-0 w-5 text-end pr-3"
                    >
                      Total Discount
                    </th>
                    <th
                      colSpan={4}
                      className=" border-black border border-r-0 text-center w-16  pl-3"
                    >
                      {parseFloat(print?.tdisc).toFixed(2)}
                    </th>
                  </tr>
                  <tr className="text-xs">
                    <th
                      colSpan={8}
                      className="border-black border border-l-0 border-r-0 w-5 text-end pr-3"
                    >
                      Grand Total
                    </th>
                    <th
                      colSpan={4}
                      className=" border-black border border-r-0 text-center w-16 pl-3"
                    >
                      {parseFloat(
                        Number(print?.tamt) - Number(print?.tdisc)
                      ).toFixed(2)}
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
              <div className="w-28 h-28 flex flex-col items-center">
                <div className="h-24 w-24 border-black border-b"></div>
                <p className="text-xs py-2 ">Auth Signatory</p>
              </div>
              <div className="w-32 h-28 flex flex-col items-center">
                <div className="h-24 w-24 border-black border-b"></div>
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
export default QuotationWithoutGst;
