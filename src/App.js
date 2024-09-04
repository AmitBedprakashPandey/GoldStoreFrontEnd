import "./App.css";
import { Route, Routes } from "react-router-dom";
import PrintGST from "./Components/PrintWithGST";
import Print from "./Components/Print";
import CreateCustomer from "./Components/CreateCustomer";
import Navbar from "./Components/NavBar";
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
import LayoutCrm from "./LayoutCrm";
import LivePrice from "./Components/LivePrice";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FrontPage />} />
      </Routes>
      <Routes>
        <Route path="/crm" element={<HomePage />}>
          <Route path="login" element={<LogingPage />} />
          <Route path="print" element={<Print />} />
          <Route path="printgst" element={<PrintGST />} />
          <Route path="createcustomer" element={<CreateCustomer />} />
          <Route path="quotation" element={<Quotation />} />
          <Route path="branch" element={<Branch />} />
          <Route path="quotationwithoutgst" element={<QuotationWithoutGst />} />
          <Route path="invoicegst" element={<Invoice2 />} />
          <Route path="invoice" element={<InvoiceWithoutGst />} />
          <Route path="company" element={<CompanyInfo />} />
          <Route path="bank" element={<Bank />} />
          <Route path="mode" element={<Mode />} />
          <Route path="master/liveprice" element={<LivePrice />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
