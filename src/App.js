import "./App.css";
import { Route, Routes } from "react-router-dom";
import Print from "./Components/Print";
import PrintGST from "./Components/PrintWithGST";
import CreateCustomer from "./Components/CreateCustomer";
import Quotation from "./Components/Quotation";
import InvoiceWithoutGst from "./Components/InvoiceWithoutGst";
import HomePage from "./Components/HomePage";
import Branch from "./Components/Branch";
import Invoice2 from "./Components/Invoice2";
import LogingPage from "./Components/LoginPage";
import CompanyInfo from "./Components/CompanyInfo";
import Bank from "./Components/Bank";
import Mode from "./Components/Mode";
import QuotationWithoutGst from "./Components/QuatationWithoutGst";
import FrontPage from "./FrontPage/FrontPage";
import LivePrice from "./Components/LivePrice";
import Settings from "./Components/Settings";
import WebsiteSetting from "./Setting/WebsiteSetting";
import ForgetPasswordForm from "./layout/ForgetPasswordForm";
import GstBillPrint from "./Components/GstBillPrint";
import GstBillWithoutPrint from "./Components/GstBillWithoutPrint";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/forgetpassword" element={<ForgetPasswordForm />} />
        
        <Route path="/printinvoicegst" element={<PrintGST />} />
        <Route path="/print" element={<Print/>} />

        <Route path="/printwithoutgst" element={<GstBillWithoutPrint />} />        
        <Route path="/printgst" element={<GstBillPrint />} />

        <Route path="/crm" element={<HomePage />}>
          <Route path="login" element={<LogingPage />} />
          <Route path="setting" element={<Settings />}>
            <Route path="websitesetting" element={<WebsiteSetting />} />
          </Route>
          
          <Route path="report/quotation" element={<Quotation />} />
          <Route path="report/quotationwithoutgst" element={<QuotationWithoutGst />}/>
          <Route path="invoice/invoicegst" element={<Invoice2 />} />
          <Route path="invoice/invoice" element={<InvoiceWithoutGst />} />

          <Route path="master/branch" element={<Branch />} />
          <Route path="master/createcustomer" element={<CreateCustomer />} />
          <Route path="master/company" element={<CompanyInfo />} />
          <Route path="master/bank" element={<Bank />} />
          <Route path="master/mode" element={<Mode />} />
          <Route path="master/liveprice" element={<LivePrice />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
