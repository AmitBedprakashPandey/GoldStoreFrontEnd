import { useEffect, useRef, useState } from "react";
import "./print.css";
import Holmark from "../asstes/download-removebg-preview.png";
import ReactToPrint from "react-to-print";
import moment from "moment";

function Print(params) {
  const [paramdata, setParamData] = useState();
  useEffect(() => {
    const storedData = sessionStorage.getItem("printData");
    if (storedData) {
      setParamData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (paramdata?.company?.name) {
      document.title = paramdata?.company?.name?.toUpperCase();
    }
  }, [paramdata]);

  const componentRef = useRef();
  return (
    <div  className="w-screen bg-slate-400">
      <ReactToPrint
        trigger={() => (
          <button className="absolute z-50 m-3 rounded-md text-white hover:bg-blue-600 duration-300 bg-blue-500 px-10 py-3">
            Prints
          </button>
        )}
        content={() => componentRef.current}
      />
      <div className="A4Page p-3" ref={componentRef}>
        <div className="border-black border-2">
          <div className="flex justify-between items-center p-2">
            <div className="w-28 h-28 flex justify-center items-center">
              <img src={paramdata?.company?.logo} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">JAI MATA DI</h3>
              <h1 className="font-bold text-3xl uppercase">
                {paramdata?.company?.name}
              </h1>
              <h3 className="text-lg font-semibold">TAX INVOICE</h3>
            </div>
            <div>
              <img src={Holmark} width={100} alt="holmart" />
            </div>
          </div>
          <div className="border-black border border-l-0 border-r-0 px-3 py-2 flex justify-between">
            <div className="flex flex-col">
              <label className="flex gap-5 items-center text-md font-bold">
                Invoice No :{" "}
                <span className="font-normal">{paramdata?.formData.quot}</span>
              </label>
              <label className="flex gap-16 items-center text-md font-bold">
                Date :{" "}
                <span className="font-normal">
                  {moment(paramdata?.quotdate).format("DD-MM-YYYY")}
                </span>
              </label>
              <label className="flex gap-3 items-center text-md font-bold">
                State Code : <span className="font-normal"></span>
              </label>
            </div>
            <div className="flex flex-col w-72">
              <label className="flex gap-3 items-center text-md font-bold">
                Payment Mode :{" "}
                <span className="font-normal capitalize">{paramdata?.formData?.mode}</span>
              </label>
              <label className="flex gap-3 items-center text-md font-bold">
                Delivery Mode : <span className="font-normal"></span>
              </label>
              <label className="flex gap-3 items-center text-md font-bold">
                Place of Supply : <span className="font-normal"></span>
              </label>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-full">
              <div className="px-3 h-7 border-black border border-t-0 border-r-0 border-l-0">
                <label className="text-md font-bold">
                  <span></span>
                </label>
              </div>
            </div>
            <div className="w-full">
              <div className="px-3 h-7 border-black border border-t-0 border-r-0">
                <label className="text-md font-bold">
                  Customer Details <span></span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-full border-black border border-t-0 border-l-0 border-r-0 border-b-0">
              <div className="px-3 h-32 ">
                <label className="flex gap-3 text-lg pt-2">
                  <label className="text-nowrap text-sm font-bold">
                    Billed to :
                  </label>
                  <ul className="text-sm capitalize">
                    <li className="uppercase font-bold">{paramdata?.company?.name}</li>
                    <li>{paramdata?.company?.address}</li>
                  </ul>
                </label>
              </div>
              <div className="w-full px-3 flex flex-col">
                <label className="flex gap-14 items-center text-sm font-bold">
                  Party PAN :{" "}
                  <span className="font-normal uppercase">{paramdata?.company?.pan}</span>
                </label>
                <label className="flex gap-3 items-center text-sm font-bold">
                  Party Mobile No. :{" "}
                  <span className="font-normal">
                    {paramdata?.company?.mobile}
                  </span>
                </label>
                <label className="flex gap-11 items-center text-sm font-bold">
                  GSTIN / UIN :{" "}
                  <span className="font-normal uppercase">{paramdata?.company?.gst}</span>
                </label>
              </div>
            </div>
            <div className="w-full border-black border border-t-0 border-b-0 border-r-0 py-2">
              <div className="px-3 h-32 ">
                <label className="flex gap-2 text-lg">
                  <label className="text-nowrap text-sm font-bold">
                    Shipped to :
                  </label>
                  <ul className="text-sm">
                    <li className="uppercase font-bold">{paramdata?.customer[0]?.name}</li>
                    <li>{paramdata?.customer[0]?.address}</li>
                  </ul>
                </label>
              </div>
              <div className="w-full px-3 flex flex-col">
                <label className="flex gap-14 text-sm font-bold">
                  Party PAN :
                  <span className="font-normal uppercase">
                    {paramdata?.customer[0]?.pan || "-"}
                  </span>
                </label>
                <label className="flex gap-3 text-sm font-bold">
                  Party Mobile No. :
                  <span className="font-normal">
                    {paramdata?.customer[0]?.mobile || "-"}
                  </span>
                </label>
                <label className="flex gap-11 text-sm font-bold">
                  GSTIN / UIN :{" "}
                  <span className="font-normal uppercase">
                    {paramdata?.customer[0]?.gst || "-"}
                  </span>
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
                    WEIGHT (grams)
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
                {paramdata?.invoice?.map((doc, index) => (
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
                      {parseFloat(doc?.weight).toFixed(2)}
                    </td>
                    <td className=" border-black text-center  border w-16">
                      {parseFloat(doc?.mcharg).toFixed(2)}
                    </td>
                    <td className=" border-black text-center  border w-16">
                      {doc?.qty}
                    </td>
                    <td className=" border-black text-center  border w-16">
                    {parseFloat(doc?.rate).toFixed(2)}
                    </td>
                    <td className=" border-black text-center  border w-16">
                    {parseFloat(doc?.sgst).toFixed(2)}
                    </td>
                    <td className=" border-black text-center  border w-16">
                    {parseFloat(doc?.cgst).toFixed(2)}
                    </td>
                    <td className=" border-black text-center  border w-16">
                    {parseFloat(doc?.igst || 0).toFixed(2)}
                    </td>
                    <td className=" border-black text-center  border border-r-0 w-28">
                      {parseFloat(doc?.nettotal).toFixed(2)}
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
                      {parseFloat(paramdata?.formData.tdisc || 0).toFixed(2)}

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
                    {parseFloat(paramdata?.formData.ttax || 0).toFixed(2)}
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
                    {parseFloat(paramdata?.formData.gtotal || 0).toFixed(2)}
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
  );
}

export default Print;
