import CurrencyCodeReducer from "./currencyCode/reducer";
import DashboardReducer from "./dashboard/reducer";
import DiscountReducer from "./discount/reducer";
import HelpReducer from "./help/reducer";
import InvoiceReducer from "./invoice/reducer";
import LoginReducer from "./login/reducer";
import ManageUsersReducer from "./manageUsers/reducer";
import MenuReducer from "./menu/reducer";
import OrderManagementReducer from "./orderManagement/reducer";
import PaymentMethodReducer from "./payment-methods/reducer";
import PaymentTermReducer from "./payment-terms/reducer";
import PlanReducer from "./plan/reducer";
import ProductListReducer from "./productList/reducer";
import PurchaseAgreementReducer from "./purchaseAgreement/reducer";
import PurchaseOrderReducer from "./purchaseOrder/reducer";
import QuotationReducer from "./quotation/reducer";
import SalesOrderListReducer from "./salesOrderList/reducer";
import SalesUnitReducer from "./salesUnit/reducer";
import SitesReducer from "./sites/reducer";
import SourcingReducer from "./sourcing/reducer";
import TransactionHistoryReducer from "./transactionHistory/reducer";
import VendorReducer from "./vendor/reducer";
import WarehouseReducer from "./warehouse/reducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  OrderManagementReducer,
  TransactionHistoryReducer,
  ProductListReducer,
  SalesOrderListReducer,
  HelpReducer,
  LoginReducer,
  DashboardReducer,
  ManageUsersReducer,
  SalesUnitReducer,
  CurrencyCodeReducer,
  PlanReducer,
  VendorReducer,
  PaymentTermReducer,
  SitesReducer,
  WarehouseReducer,
  PaymentMethodReducer,
  QuotationReducer,
  PurchaseOrderReducer,
  MenuReducer,
  PurchaseAgreementReducer,
  SourcingReducer,
  InvoiceReducer,
  DiscountReducer,
});

// on logout all reducers will be reset
const appReducer = (state, action) => {
  if (action.type === "LOGOUT_USER") {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
