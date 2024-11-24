import { useEffect, useRef, useState } from "react";
import { fetchAllInvoices } from "../Store/Slice/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import moment from "moment";
import { PiCheck, PiEye, PiX, PiMagnifyingGlassDuotone, PiFilePdf, PiFileXls } from "react-icons/pi";
import "./print.css";
import { fetchAllCustomers } from "../Store/Slice/CustomerSlice";
import GstBillPrint from "./GstBillPrint";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";


function Invoices() {
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [id, setId] = useState();
  const [Model, setModel] = useState(false);
  const [to, setTo] = useState();
  const [invoiceArray, setInvoiceArray] = useState([]);
  const { Company } = useSelector((state) => state.Company);
  const { Customer } = useSelector((state) => state.Customers);

  const DataTableRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllInvoices());
  }, [Model]);

  const { Invoices, loading } = useSelector((state) => state.Invoices);

  useEffect(() => {
    setInvoiceArray(Invoices);
  }, [Invoices]);

  const filteredArray = Invoices
    ? Invoices.filter((bill) => {
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

  const printWithGST = (data) => {
    console.log(Company?.name);
    
    const datas = {
      company: Company,
      customer: Customer.filter((doc) => doc.name === data.customer),      
     invoice: data?._id,
    };        
    sessionStorage.setItem("printData", JSON.stringify(datas));
    window.open("/printgst", "_blank");
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
          parseFloat(invoice.ttax || 0).toFixed(0),
          parseFloat(invoice.balamt || 0).toFixed(0), // Balance Amount
          parseFloat(invoice.gtotal || 0).toFixed(0), // Grand Total
          invoice.mode,
          invoice.status ? "Paid" : "Pending", // Status
        ]);
  
        const tableHead = [
          "Bill No.",
          "Customer",
          "Description",
          "Weight (g)",
          "Rate",
          "Tax",
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
        "Tax": parseFloat(invoice.ttax || 0).toFixed(0),
        "Bal. Amt": parseFloat(invoice.balamt || 0).toFixed(0),
        "Grnd. Amt": parseFloat(invoice.gtotal || 0).toFixed(0),
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
    <div className="p-3 h-screen bg-white">
      {loading && <Loading />}
      {/* {Model && <GstBillPrint id={id} close={() => setModel(false)} />} */}
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
            <label className="font-medium text-sm">To : </label>
            <input
              type="date"
              className="w-full border border-black/30 px-3 rounded-lg"
              value={moment(to).format("YYYY-MM-DD")}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="">
          <button
            className="flex gap-3 h-8 text-xs text-white font-bold items-center justify-center bg-blue-500  px-5 rounded-xl w-full mt-4"
            onClick={findData}
          >
            <PiMagnifyingGlassDuotone />Find
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
<Column headerClassName="p-0" bodyClassName="p-0 text-center" header="Tax" field="ttax"  />
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

export default Invoices;
