import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInvoice,fetchAllInvoices } from "../Store/Slice/InvoiceSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Loading from "./Loading";
import ReactToPrint from "react-to-print";
import { PiPrinterDuotone } from "react-icons/pi";
import { BiDownload, BiShareAlt } from "react-icons/bi";
import Cancel from "../asstes/cancel.png";
import Holmark from "../asstes/download-removebg-preview.png";
import moment from "moment";

const GstBillPrint = ({ close}) => {
    const dispatch = useDispatch();
    const componentRef = useRef();
    const [paramdata, setParamData] = useState();    

    const { Invoices, loading } = useSelector((state) => state.Invoices);
    
    const [invoice,SetInvoice]=useState([]);
    
    const [isLoading, setIsLoading] = useState(false);

    useLayoutEffect(()=>{
        const storedData = sessionStorage.getItem("printData");
        if (storedData) {
          try {
            setParamData(JSON.parse(storedData));          
            dispatch(fetchAllInvoices(paramdata?.invoice))
          } catch (error) {
            console.error("Error parsing stored data:", error);
          }
        }
    },[dispatch]);    
    
    useEffect(()=>{
        SetInvoice(Invoices.filter(doc => doc._id === paramdata?.invoice));
    },[Invoices])

  
    const onCancel = () => {
      dispatch(updateInvoice({ ...invoice[0], status: true })).then((doc) => document.location.reload());
    };

    const onUnDoCancel = () => {
      dispatch(updateInvoice({ ...invoice[0], status: false })).then((doc) => document.location.reload());
    };
  
    const handleShareImg = async () => {
      setIsLoading(true);
      try {
  
        if (!componentRef.current) {
          console.error("Component reference is null or undefined.");
          return;
        }
  
  
        const element = componentRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
  
         // Convert the Base64 image to a Blob
      const response = await fetch(imgData);
      const blob = await response.blob();
  
       // Check if navigator.share is supported
       if (navigator.share) {
        const file = new File([blob], "invoice.png", { type: "image/png" });
  
        await navigator.share({
          files: [file],
          title: "Invoice",
          text: "Here is your invoice.",
        });
      } else {
        // Fallback: Download the image if sharing is not supported
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "invoice.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  
   // Create a link element for downloading the image
        // const link = document.createElement("a");
        // link.href = imgData;
        // link.download = "invoice.png"; // Set the filename
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link); // Clean up the DOM
  
        // const pdf = new jsPDF({
        //   orientation: "portrait",
        //   unit: "px",
        //   format: "a4",
        // });
  
        // const width = pdf.internal.pageSize.getWidth();
        // const height = (canvas.height * width ) / canvas.width;
  
        // pdf.addImage(imgData, "PNG", 0, 0, width, height);
  
        // pdf.save("invoice.pdf");
  
        // const pdfBlob = pdf.output("blob");
  
        // Check if navigator.share is supported
      //   if (navigator.share) {
      //     const file = new File([pdfBlob], "invoice.pdf", {
      //       type: "application/pdf",
      //     });
      //     await navigator.share({
      //       files: [file],
      //       title: "Invoice",
      //       text: "Here is your invoice.",
      //     });
      //   } else {
      //     alert("Sharing is not supported on this device.");
      //   }
  
    } catch (error) {
        console.error("Error sharing PDF:", error);
      }finally{
        setIsLoading(false)
      }
    };
  
    const handleDownloadPDF = async () => {
      setIsLoading(true);
      try {
        if (!componentRef.current) {
          console.error("Component reference is null or undefined.");
          return;
        }
    
        const element = componentRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
    
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
    
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("invoice.pdf"); // Save the PDF locally with the filename "invoice.pdf"
    
      } catch (error) {
        console.error("Error downloading PDF:", error);
      } finally {
        setIsLoading(false);
      }
    };
    


    return (
      <>
      {isLoading && <Loading />}
        <div
          className="fixed top-0 bottom-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden flex justify-center"
          style={{ backgroundColor: "rgb(0,0,0,0.65)" }}
        >
  
          <div className="absolute top-5 left-5 w-full z-50 flex gap-3">
            <ReactToPrint
              trigger={() => (
                <button className="flex  items-center  gap-2 rounded-md text-white hover:bg-blue-600 duration-300 bg-blue-500 px-5 py-2 uppercase">
                  <PiPrinterDuotone />  Print
                </button>
              )}
              content={() => componentRef.current}
            />
            <button
              className="rounded-md text-white hover:bg-red-600 duration-300 bg-red-500 px-5 py-2 uppercase"
              onClick={invoice[0]?.status === true ? onUnDoCancel : onCancel}
            >
              {invoice[0]?.status === true ? "undo cancel" : "cancel"}
            </button>
  
            {/* <button
              type="button"
              onClick={close}
              className="rounded-md text-white hover:bg-red-600 duration-300 bg-red-500 px-5 py-2 uppercase"
            >
              Close
            </button> */}
  
            <button  onClick={handleShareImg} className="z-50 rounded-md text-white hover:bg-blue-600 duration-300 bg-blue-500 px-3 py-2">
              <BiShareAlt size={25} />
            </button>
            <button  onClick={handleDownloadPDF} className="z-50 rounded-md text-white hover:bg-blue-600 duration-300 bg-blue-500 px-3 py-2">
              <BiDownload size={25} />
            </button>
          </div>
  
       
    <div className="A4Page p-3 relative z-40" ref={componentRef}>
            {invoice[0]?.status === true ? (
              <img
                src={Cancel}
                alt="cancel logo"
                className="absolute left-52 bottom-80 w-96 z-50"
              />
            ) : (
              ""
            )}
        <div className="border-black border">
          {/* Header */}
          <div className="flex justify-between px-5 py-2">
            <div className="w-28">
              <img src={paramdata?.company?.logo} />
            </div>
            <div className="text-center">
              <h3 className="text-md font-semibold">JAI MATA DI</h3>
              <h1 className="font-bold text-xl uppercase">
                {paramdata?.company?.name}
              </h1>
              <h3 className="text-xs font-semibold">TAX INVOICE</h3>
            </div>
            <div className="w-20">
              <img src={Holmark}  alt="holmart" />
            </div>
          </div>
          {/* invoice date and number  */}
          <div className="flex justify-between pb-3 pt-1.5 px-3 relative border border-l-0 border-r-0 border-black">
            <div className="flex flex-col">
              <div className="flex gap-4 items-center text-xs font-bold">
                Invoice No :{" "}
                <span className="font-normal">{invoice[0]?.quot}</span>
              </div>
              <label className="flex gap-12 items-center text-xs font-bold">
                Date :{" "}
                <span className="font-normal">
                  {moment(invoice[0]?.quotdate).format("DD-MM-YYYY")}
                </span>
              </label>
              {/* <label className="flex gap-3 items-center text-xs font-bold">
                State Code : <span className="font-normal capitalize"></span>
              </label> */}
            </div>
            <div className="flex flex-col w-72">
              <label className="flex gap-3 items-center text-xs font-bold">
                Payment Mode :
                <span className="font-bold capitalize">
                  {invoice[0]?.mode || "-"}
                </span>
              </label>
              <label className="flex gap-3 items-center text-xs font-bold">
                Delivery Mode : <span className="font-bold">-</span>
              </label>
              {/* <label className="flex gap-3 items-center text-xs font-bold">
                Place of Supply : <span className="font-normal"></span>
              </label> */}
            </div>
          </div>
          {/* customer and bill details */}
          <div className="flex justify-between">
                {/* Bill */}
            <div className="w-full border-black">
            <div className="h-6 flex items-center pl-3 border-b border-black">
                <label className="text-xs font-bold">
                  {""}<span></span>
                </label>
              </div>
              <div className="p-2">
                <div className="flex gap-3 text-lg h-24 ">
                  <label className="text-nowrap text-xs font-bold">
                    Billed to :
                  </label>
                  <ul className="text-xs capitalize">
                    <li className="uppercase font-bold">
                      {paramdata?.company?.name}
                    </li>
                    <li className="capitalize">{paramdata?.company?.address}</li>
                  </ul>
                </div>
              </div>
              <div className="w-full p-3 flex flex-col">
                <label className="flex gap-14 items-center text-xs font-bold">
                  Party PAN :{" "}
                  <span className="font-normal uppercase text-xs">
                    {paramdata?.company?.pan}
                  </span>
                </label>
                <label className="flex gap-4 items-center text-xs font-bold">
                  Party Mobile No. :{" "}
                  <span className="font-normal">
                    {paramdata?.company?.mobile}
                  </span>
                </label>
                <label className="flex gap-11 items-center text-xs font-bold">
                  GSTIN / UIN :{" "}
                  <span className="font-normal uppercase">
                    {paramdata?.company?.gst}
                  </span>
                </label>
              </div>
            </div>
                {/* shipping */}
            <div className="w-full border-black border-l">
            <div className="h-6 flex justify-start items-center px-3 border-b border-black">
                <label className="    text-xs font-bold">
                  <span></span>
                </label>
              </div>
              <div className="p-2">
                <div className="flex gap-3 h-24 ">
                  <label className="text-nowrap text-xs font-bold">
                    Shipped to :
                  </label>
                  <ul className="text-xs">
                    <li className="uppercase font-bold">
                      {paramdata?.customer[0]?.name}
                    </li>
                    <li className="capitalize">{paramdata?.customer[0]?.address}</li>
                  </ul>
                </div>
              </div>
              <div className="w-full p-3 flex flex-col">
                <label className="flex gap-14 text-xs font-bold">
                  Party PAN :
                  <span className="font-normal uppercase">
                    {paramdata?.customer[0]?.pan || "-"}
                  </span>
                </label>
                <label className="flex gap-3 text-xs font-bold">
                  Party Mobile No. :
                  <span className="font-normal">
                    {paramdata?.customer[0]?.mobile || "-"}
                  </span>
                </label>
                <label className="flex gap-11 text-xs font-bold">
                  GSTIN / UIN :{" "}
                  <span className="font-normal uppercase">
                    {paramdata?.customer[0]?.gst || "-"}
                  </span>
                </label>
              </div>
            </div>

          </div>

          <div>
            <table >

              <thead>
                <tr className="text-xs">
                  <th className="uppercase text-center w-5 -pt-2 pb-3">
                    SN.
                  </th>
                  <th className="uppercase text-center w-40 -pt-2 print:pt-3 pb-3">
                    Description Goods
                  </th>
                  <th className="uppercase text-center w-10 -pt-2 print:pt-3 pb-3">
                    HSN
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    Purity
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    Weight. (g)
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    MAKING CHARGES
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    QTY.
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    RATE
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    SGST
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    CGST
                  </th>
                  <th className="uppercase text-center w-16 -pt-2 print:pt-3 pb-3">
                    IGST
                  </th>
                  <th className="uppercase text-center w-28 -pt-2 print:pt-3 pb-3">
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoice[0]?.invoice?.map((doc, index) => (
                  <tr className="text-xs ">
                    <td className="text-center w-5 py-1.5  print:pt-3 pb-3">
                      1
                    </td>
                    <td className="capitalize text-start pl-3 w-40  print:pt-3 pb-3">
                      {doc?.desc}
                    </td>
                    <td className="text-center w-10  print:pt-3 pb-3">
                      {doc?.hsn}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {doc?.purity}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {parseFloat(doc?.weight).toFixed(2)}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {parseFloat(doc?.mcharg).toFixed(2)}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {doc?.qty}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {parseFloat(doc?.rate).toFixed(2)}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {parseFloat(doc?.sgst).toFixed(2)}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {parseFloat(doc?.cgst).toFixed(2)}
                    </td>
                    <td className="text-center w-16  print:pt-3 pb-3">
                      {parseFloat(doc?.igst || 0).toFixed(2)}
                    </td>
                    <td className="text-center w-28  print:pt-3 pb-3">
                      {parseFloat(doc?.nettotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <th
                    colSpan={11}
                    className="text-xs  print:pt-3 pb-3 border-black border border-l-0 w-5 text-end pr-3"
                  >
                    Total Discount
                  </th>

                  <th
                    colSpan={4}
                    className=" print:pt-3 pb-3 text-xs border-black border border-r-0 w-16"
                  >
                    {parseFloat(invoice[0]?.tdisc || 0).toFixed(2)}
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={11}
                    className="text-xs  print:pt-3 pb-3 border-black text-end pr-3 border border-l-0 w-5"
                  >
                    Total Tax
                  </th>

                  <th
                    colSpan={4}
                    className="text-xs  print:pt-3 pb-3 border-black border border-r-0 w-16"
                  >
                    {parseFloat(invoice[0]?.ttax || 0).toFixed(2)}
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={11}
                    className="text-xs  print:pt-3 pb-3 border-black border border-l-0 border-r-0 w-5 text-end pr-3"
                  >
                    Grand Total
                  </th>
                  <th
                    colSpan={4}
                    className="text-xs print:pt-3 pb-3 border-black border border-r-0 text-center w-16 pl-3"
                  >
                    {parseFloat(invoice[0]?.gtotal || 0).toFixed(0)}
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
              3. Please note that, the net amount includes Metal Value, Cost of
              Stones (Precious, Non- Precious and other material Charges),
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

export default GstBillPrint;