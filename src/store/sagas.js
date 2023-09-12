import { all, fork } from "redux-saga/effects";

import CurrencyCodeSaga from "./currencyCode/saga";
import DashboardSaga from "./dashboard/saga";
import DiscountSaga from "./discount/saga";
import HelpSaga from "./help/saga";
import InvoiceSaga from "./invoice/saga";
import ManageUsersSaga from "./manageUsers/saga";
import OrderManagementSaga from "./orderManagement/saga";
import PaymentMethodSaga from "./payment-methods/saga";
import PaymentTermSaga from "./payment-terms/saga";
import PlanSaga from "./plan/saga";
import ProductListSaga from "./productList/saga";
import PurchaseAgreementSaga from "./purchaseAgreement/saga";
import PurchaseOrderSaga from "./purchaseOrder/saga";
import QuotationSaga from "./quotation/saga";
import SalesOrderListSaga from "./salesOrderList/saga";
import SalesUnitSaga from "./salesUnit/saga";
import SitesSaga from "./sites/saga";
import SourcingSaga from "./sourcing/saga";
import TransactionHistorySaga from "./transactionHistory/saga";
import WarehouseSaga from "./warehouse/saga";
import authSaga from "./login/saga";
import vendorSaga from "./vendor/saga";

export default function* rootSaga() {
  yield all([
    fork(OrderManagementSaga),
    fork(TransactionHistorySaga),
    fork(ProductListSaga),
    fork(SalesOrderListSaga),
    fork(HelpSaga),
    fork(authSaga),
    fork(DashboardSaga),
    fork(CurrencyCodeSaga),
    fork(ManageUsersSaga),
    fork(PlanSaga),
    fork(vendorSaga),
    fork(SalesUnitSaga),
    fork(PaymentTermSaga),
    fork(WarehouseSaga),
    fork(SitesSaga),
    fork(PaymentMethodSaga),
    fork(QuotationSaga),
    fork(PurchaseOrderSaga),
    fork(PurchaseAgreementSaga),
    fork(SourcingSaga),
    fork(InvoiceSaga),
    fork(DiscountSaga),
  ]);
}
