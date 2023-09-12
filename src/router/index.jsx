import AdminPanel from "../views/adminPanel/Main";
import Contracts from "../views/contracts/Main";
import CreateContract from "../views/createContract/Main";
import CreateInvoice from "../views/createInvoice/Main";
import CreateSourcing from "../views/createSourcing/Main";
import CurrencyCode from "../views/CurrencyCode/Main";
import Dashboard from "../views/dashboard/Main";
import Discount from "../views/discount/Main";
import ErrorPage from "../views/errorPage/Main";
import Help from "../views/help/Main";
import Invoice from "../views/invoice/Main";
import Login from "../views/login/Main";
import ManageUsers from "../views/manageUsers/Main";
import OrderManagement from "../views/orderManagement/Main";
import Pricing from "../views/plan/Main";
import ProductList from "../views/productList/Main";
import Products from "../views/products/Main";
import Register from "../views/register/Main";
import SalesOrderList from "../views/salesOrderList/Main";
import Sourcing from "../views/sourcing/Main";
import TransactionHistory from "../views/transactionHistory/Main";
import createPurchaseOrder from "../views/createPurchaseOrder/Main";
import createQuotation from "../views/createQuotation/Main";
import createSalesOrder from "../views/createSalesOrder/Main";
import paymentMethod from "../views/payment-methods/Main";
import paymentTerms from "../views/payment-terms/Main";
import profile from "../views/profile/Main";
import purchaseOrder from "../views/purchaseOrder/Main";
import quotation from "../views/quotation/Main";
import review from "../views/review/Main";
import salesOrder from "../views/salesOrder/Main";
import salesUnit from "../views/salesUnit/Main";
import sites from "../views/sites/Main";
import vendor from "../views/vendor/Main";
import warehouse from "../views/warehouse/Main";

const authProtectedRoutes = [
  // 1000 = admin, 1001 = user
  {
    path: "/quotation",
    component: quotation,
    role: [1000, 1001],
  },
  {
    path: "/createQuotation",
    component: createQuotation,
    role: [1000, 1001],
  },
  {
    path: "/purchaseOrder",
    component: purchaseOrder,
    role: [1000, 1001],
  },
  {
    path: "/createPurchaseOrder",
    component: createPurchaseOrder,
    role: [1000],
  },
  { path: "/help", component: Help, role: [1001, 1000] },
  {
    path: "/contacts",
    component: review,
    role: [1001, 1000],
  },
  { path: "/products", component: Products, role: [1000, 1001] },
  { path: "/admin-panel", component: AdminPanel, role: [1000] },
  { path: "/manage-vendors", component: ManageUsers, role: [1000] },
  { path: "/plans", component: Pricing, role: [1000] },
  {
    path: "/vendors",
    component: vendor,
    role: [1000],
  },
  {
    path: "/create-request-for-quotation",
    component: CreateSourcing,
    role: [1000, 1001],
  },
  {
    path: "/request-for-quotation",
    component: Sourcing,
    role: [1000, 1001],
  },
  {
    path: "/currencyCode",
    component: CurrencyCode,
    role: [1000, 1001],
  },
  {
    path: "/salesUnit",
    component: salesUnit,
    role: [1000, 1001],
  },
  {
    path: "/paymentTerms",
    component: paymentTerms,
    role: [1000, 1001],
  },
  {
    path: "/paymentMethods",
    component: paymentMethod,
    role: [1000, 1001],
  },
  {
    path: "/sites",
    component: sites,
    role: [1000],
  },
  {
    path: "/warehouse",
    component: warehouse,
    role: [1000],
  },
  {
    path: "/contracts",
    component: Contracts,
    role: [1000, 1001],
  },
  {
    path: "/create-contract",
    component: CreateContract,
    role: [1000],
  },
  {
    path: "/create-invoice",
    component: CreateInvoice,
    role: [1000, 1001],
  },
  {
    path: "/invoice",
    component: Invoice,
    role: [1000, 1001],
  },
  {
    path: "/profile",
    component: profile,
    role: [1000, 1001],
  },
  {
    path: "/discount",
    component: Discount,
    role: [1001],
  },
];

const publicRoutes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/error-page", component: ErrorPage },
  { path: "*", component: ErrorPage },
];

export { authProtectedRoutes, publicRoutes };
