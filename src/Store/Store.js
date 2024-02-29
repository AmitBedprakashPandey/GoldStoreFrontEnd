import { configureStore } from "@reduxjs/toolkit";
import CustomerSlice from "./Slice/CustomerSlice";
import BranchSlice from "./Slice/BranchSlice";
import InvoiceSlice from "./Slice/InvoiceSlice";
import InvoiceIdSlice from "./Slice/InvoiceIdSlice";
import AuthSlice from "./Slice/AuthSlice";
import CompnaySlice from "./Slice/CompanySlice";
import Print from "./Slice/PrintSlice";
import PayMode from "./Slice/PayModeSlice";
import PayBank from "./Slice/PayBankSlice";
import InvoiceWithoutGstSlice from "./Slice/InvoiceWithoutGstSlice";
import InvoiceWithoutGstIdSlice from "./Slice/InvoiceWithoutGstIdSlice";
import PrintWithoutGstSlice from "./Slice/PrintWithoutGstSlice";
import StateSlice from "./Slice/StateSlice";
import QuatationSlice from "./Slice/QuatationSlice";
import QuatationWithoutGst from "./Slice/QuatationWithoutgstSlice";

export const Store = configureStore({
  reducer: {
    Customers: CustomerSlice,
    Branchs: BranchSlice,
    Invoices: InvoiceSlice,
    InvoicesWithoutGst: InvoiceWithoutGstSlice,
    InvoiceID: InvoiceIdSlice,
    InvoiceWithoutGstID: InvoiceWithoutGstIdSlice,
    Auth: AuthSlice,
    Company: CompnaySlice,
    print: Print,
    Printwithoutgst: PrintWithoutGstSlice,
    Mode: PayMode,
    Bank: PayBank,
    State: StateSlice,
    Quotation: QuatationSlice,
    QuotationWithoutGst: QuatationWithoutGst,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
