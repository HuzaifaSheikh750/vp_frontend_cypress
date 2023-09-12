import * as url from "./url_helper";

import {
  del,
  get,
  jwtLogin,
  patch,
  post,
  postformData,
  put,
} from "./api_helper";

import { PublicClientApplication } from "@azure/msal-browser";
import axios from "axios";
import { config } from "../../Config";

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// get OrderManagement
const getOrderManagement = async (params) => await get(url.QUOTATION + params);

//add OrderManagement
const addNewOrderManagement = (payload) =>
  post(url.ADD_ORDER_MANAGEMENT, payload);

//update OrderManagement
const updateOrderManagement = (payload) =>
  put(url.UPDATE_ORDER_MANAGEMENT + "/" + payload.code, payload);

// delete OrderManagement
const deleteOrderManagement = (payload) =>
  del(url.DELETE_ORDER_MANAGEMENT + "/" + payload.code);

// get TransactionHistory
const getTransactionHistory = async (params) =>
  await get(url.GET_PAYMENT_DETAILS + params);

//add OrderManagement
const addNewTransactionHistory = (payload) =>
  post(url.ADD_PAYMENT_DETAILS, payload);

//update OrderManagement
const updateTransactionHistory = (payload) =>
  put(url.UPDATE_PAYMENT_DETAILS + "/" + payload.code, payload);

// delete OrderManagement
const deleteTransactionHistory = (payload) =>
  del(url.DELETE_PAYMENT_DETAILS + "/" + payload.code);

// Auth Login
const Login = async (payload) => await jwtLogin(url.LOGIN, payload);

// get all Orders to Export
const getAllOrders = async () => await get(url.EXPORT_ALL_ORDERS);

// get all transaction to Export
const getAllTransaction = async () => await get(url.EXPORT_ALL_TRANSACTION);

// get Total Orders
const TotalOrders = async () => await get(url.TOTAL_ORDERS);

// get Open Orders
const OpenOrders = async () => await get(url.OPEN_ORDERS);

// get Cancel Orders
const CancelOrders = async () => await get(url.CANCEL_ORDERS);

// get Total Orders Payment
const TotalOrdersPayment = async () => await get(url.TOTAL_ORDER_PAYMENT);

// get Total Orders
const MonthTopProducts = async () => await get(url.MONTH_TOP_PRODUCTS);

const SalesOrderReportHistory = async () =>
  await get(url.SALES_ORDER_REPORT_HISTORY);

const MonthlyOrderReport = async () => await get(url.MONTH_ORDER_REPORT);

const postAzureLogin = async (payload) =>
  await jwtLogin(url.AZURE_LOGIN, payload);

const LogintoAzure = async () => {
  const PCInstance = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      authority: config.authority,
      redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
    },
  });

  const authCodeRequest = {
    scopes: config.scopes,
    redirectUri: config.redirectUri,
  };

  return await PCInstance.loginPopup(authCodeRequest)
    .then((response) => response)
    .catch((error) => error);
};

const getUsersCall = async (params) => await get(url.USERS + params);

const updateUserCall = (payload) =>
  put(url.USERS + "/" + payload.code, payload.data);

const deleteUserCall = (payload) => del(url.USERS + "/" + payload);

const addNewUserCall = (payload) => post(url.USERS, payload);

const getQuantityCall = async () => await get(url.QUANTITY);

const getPlanCall = async () => await get(url.PLAN);

const updatePlanCall = (payload) => patch(url.UPDATE_PLAN, payload);

const updateRemainingQuantityCall = (payload) =>
  patch(url.UPDATE_REMAINING_QUANTITY, payload);

const updateSalesOrderStatus = async (payload) =>
  await patch(url.UPDATE_SALES_ORDER_STATUS + payload);

// * Products API Calls (CRUD) PRODUCTS = "/items"
const getProductList = async (params) => await get(url.PRODUCTS + params);
const addNewProductList = async (payload) => await post(url.PRODUCTS, payload);
const deleteProductList = async (payload) =>
  await del(url.PRODUCTS + "/" + payload);
const updateProductList = async (payload) =>
  await put(url.PRODUCTS + "/" + payload.param, payload.data);
const updateProductStatusCall = async (payload) =>
  await patch(url.PRODUCTS + "/" + payload.param, payload.data);

// * Quotations API Calls (CRUD) QUOTATIONS = "/vendor-quote-headers"
// TODO : These will be removed
const getSalesOrderList = async (params) => await get(url.QUOTATION + params);
const addNewSalesOrderList = (payload) => post(url.QUOTATION, payload);
const deleteSalesOrderList = (payload) => del(url.QUOTATION + "/" + payload);
const updateSalesOrderList = (payload) =>
  put(url.QUOTATION + "/" + payload.code, payload);

// * Quotations API Calls (CRUD) QUOTATIONS = "/vendor-quote-headers"
const getQuotationCall = async (params) => await get(url.QUOTATION + params);
const addQuotationCall = (payload) => post(url.QUOTATION, payload);
const deleteQuotationCall = (payload) => del(url.QUOTATION + "/" + payload);
const updateQuotationCall = (payload) =>
  put(url.QUOTATION + "/" + payload.code, payload.body);

// * Currency Code API Calls (CRUD) CURRENCY_CODE = "/currencies"
const addCurrencyCodeApi = (payload) => post(url.CURRENCY_CODE, payload);
const deleteCurrencyCodeApi = (payload) =>
  del(url.CURRENCY_CODE + "/" + payload);
const getCurrencyCodeApi = async (params) =>
  await get(url.CURRENCY_CODE + params);
const updateCurrencyCodeApi = (payload) =>
  put(url.CURRENCY_CODE + "/" + payload.params, payload.data);

// * UOM API Calls (CRUD) UOM = "/uom"
const addSalesUnitApi = (payload) => post(url.SALES_UNIT, payload);
const deleteSalesUnitApi = (payload) => del(url.SALES_UNIT + "/" + payload);
const getSalesUnitApi = async (params) => await get(url.SALES_UNIT + params);
const updateSalesUnitApi = (payload) =>
  put(url.SALES_UNIT + "/" + payload.params, payload.data);

// * Sites API Calls (CRUD) SITES = "/sites"
const addSitesApi = (payload) => post(url.SITES, payload);
const deleteSitesApi = (payload) => del(url.SITES + "/" + payload);
const getSitesApi = async (params) => await get(url.SITES + params);
const updateSitesApi = (payload) =>
  put(url.SITES + "/" + payload.params, payload.data);

// * Warehouse API Calls (CRUD) WAREHOUSE = "/warehouses"
const addWarehouseApi = (payload) => post(url.WAREHOUSE, payload);
const deleteWarehouseApi = (payload) => del(url.WAREHOUSE + "/" + payload);
const getWarehouseApi = async (params) => await get(url.WAREHOUSE + params);
const updateWarehouseApi = (payload) =>
  put(url.WAREHOUSE + "/" + payload.params, payload.data);

// * Payment Terms API Calls (CRUD) PAYMENT_TERMS = "/payment-terms"
const addPaymentTermApi = async (payload) =>
  await post(url.PAYMENT_TERM, payload);
const deletePaymentTermApi = async (payload) =>
  await del(url.PAYMENT_TERM + "/" + payload);
const getPaymentTermApi = async (params) =>
  await get(url.PAYMENT_TERM + params);
const updatePaymentTermApi = async (payload) =>
  await put(url.PAYMENT_TERM + "/" + payload.params, payload.data);

// * Discount API Calls (CRUD) DISCOUNT = "/discounts"

const addDiscountApi = async (payload) => await post(url.DISCOUNT, payload);
const deleteDiscountApi = async (payload) =>
  await del(url.DISCOUNT + "/" + payload);
const getDiscountApi = async (params) => await get(url.DISCOUNT + params);
const updateDiscountApi = async (payload) =>
  await put(url.DISCOUNT + "/" + payload.params, payload.data);

// * Payment Method API Calls (CRUD) PAYMENT_METHOD = "/payment-methods"
const addPaymentMethodApi = async (payload) =>
  await post(url.PAYMENT_METHOD, payload);
const deletePaymentMethodApi = async (payload) =>
  await del(url.PAYMENT_METHOD + "/" + payload);
const getPaymentMethodApi = async (params) =>
  await get(url.PAYMENT_METHOD + params);
const updatePaymentMethodApi = async (payload) =>
  await put(url.PAYMENT_METHOD + "/" + payload.params, payload.data);

// * Purchase Order API Calls (CRUD) PURCHASE_ORDER = "/purchaseOrderHeader"
const getPurchaseOrderApi = async (params) =>
  await get(url.PURCHASE_ORDER + params);
const addPurchaseOrderApi = (payload) => post(url.PURCHASE_ORDER, payload);
const deletePurchaseOrderApi = (payload) =>
  del(url.PURCHASE_ORDER + "/" + payload);
const updatePurchaseOrderApi = (payload) =>
  put(url.PURCHASE_ORDER + "/" + payload.params, payload.data);
const updateReasoningCall = (payload) =>
  patch(payload.module + "/statusReason/" + payload.params, payload.data);

// * Purchase Agreement API Calls (CRUD) PURCHASE_AGREEMENT = "/contractHeader"
const addPurchaseAgreementCall = (payload) =>
  post(url.PURCHASE_AGREEMENT, payload);
const deletePurchaseAgreementCall = (payload) =>
  del(url.PURCHASE_AGREEMENT + "/" + payload);
const getPurchaseAgreementCall = async (params) =>
  await get(url.PURCHASE_AGREEMENT + params);
const updatePurchaseAgreementCall = (payload) =>
  put(url.PURCHASE_AGREEMENT + "/" + payload.code, payload.data);

// * Sourcing API Calls (CRUD) SOURCING = "/request-for-quotation"
const addSourcingCall = (payload) => post(url.SOURCING, payload);
const deleteSourcingCall = (payload) => del(url.SOURCING + "/" + payload);
const getSourcingCall = async (params) => await get(url.SOURCING + params);
const updateSourcingCall = (payload) =>
  put(url.SOURCING + "/" + payload.code, payload.body);

// * Invoice API Calls (CRUD) INVOICE = "/invoice"
const addInvoiceApi = (payload) => post(url.INVOICE, payload);
const deleteInvoiceApi = (payload) => del(url.INVOICE + "/" + payload);
const getInvoiceApi = async (params) => await get(url.INVOICE + params);
const updateInvoiceApi = (payload) =>
  put(url.INVOICE + "/" + payload.code, payload.body);

// * Company GET API Call COMPANY = "/company"
const getCompanyApi = async (params) => await get(url.COMPANY + params);

// * Product Image Upload API Call PRODUCT_IMAGE = "/productImage"
const uploadProductImageCall = async (payload) => {
  const formData = new FormData();
  payload.forEach((file) => {
    formData.append("files", file);
  });
  try {
    const res = await postformData(url.PRODUCT_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

// * Contact Images Upload API Call CONTACT_IMAGE = "/contactImage"
const uploadImages = async (data) => {
  const formData = new FormData();
  data.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const res = await postformData(url.CONTACT_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

// * Contacts API Calls (CRUD) CONTACTS = "/contacts"
const getContactApi = async (params) => await get(url.CONTACT + params);
const addContactApi = (payload) => post(url.CONTACT, payload);

// * Vendor API Calls (CRUD) VENDORS = "/vendor"
const addNewVendorCall = (payload) => post(url.VENDORS, payload);
const deleteVendorCall = (payload) => del(url.VENDORS + "/" + payload);
const getAllVendorCall = async (payload) => await get(url.VENDORS + payload);
const updateVendorCall = (payload) =>
  put(url.VENDORS + "/" + payload.code, payload.data);
const getVendorApi = async (params) => await get(url.VENDORS + params);

// * BANKING_INFO API Calls (CRUD) BANKING_INFO = "/vendor-bank-details"
const addBankingInfoApi = async (payload) =>
  await post(url.BANKING_INFO, payload);

const deleteBankingInfoApi = async (payload) =>
  await del(url.BANKING_INFO + "/" + payload);

const getBankingInfoApi = async (params) =>
  await get(url.BANKING_INFO + params);

const updateBankingInfoApi = async (payload) =>
  await put(url.BANKING_INFO + "/" + payload.code, payload.data);

// getReasoningListCall
// submitReasonCall

const getReasoningListCall = async (params) =>
  await get(url.REASONING_LIST + params);

// const submitReasonCall = async (payload) =>
//   await post(url.SUBMIT_REASON, payload);

// const UpdateBankingInfo = async (payload) => put(url.BANKING_INFO , payload);

// const deleteBankingInfo = async (payload) =>
//   await del(
//     url.BANKING_INFO +
//       "/" +
//       payload.userId +
//       "/shippingInfo/" +
//       payload.specificInfoId
//   );

// const AdddBankingInfo = async (payload) =>
//   await post(
//     url.BANKING_INFO + "/" + payload.userId + "/shippingInfo",
//     payload.data
//   );

// const getBankingInfo = async (payload) =>
//   await get(
//     url.BANKING_INFO +
//       "/" +
//       payload.userId +
//       "/shippingInfo/" +
//       payload.specificInfoId
//   );

// const getBankingInfoList = async (payload) =>
//   await get(url.BANKING_INFO + "/" + payload.userId + "/shippingInfo/");

export {
  getOrderManagement,
  addNewOrderManagement,
  updateOrderManagement,
  deleteOrderManagement,
  getTransactionHistory,
  addNewTransactionHistory,
  updateTransactionHistory,
  deleteTransactionHistory,
  getProductList,
  addNewProductList,
  updateProductList,
  deleteProductList,
  getSalesOrderList,
  addNewSalesOrderList,
  updateSalesOrderList,
  deleteSalesOrderList,
  Login,
  getAllOrders,
  getAllTransaction,
  TotalOrders,
  OpenOrders,
  CancelOrders,
  TotalOrdersPayment,
  MonthTopProducts,
  SalesOrderReportHistory,
  MonthlyOrderReport,
  postAzureLogin,
  LogintoAzure,
  getUsersCall,
  updateUserCall,
  deleteUserCall,
  addNewUserCall,
  uploadImages,
  getQuantityCall,
  getPlanCall,
  updatePlanCall,
  updateRemainingQuantityCall,
  uploadProductImageCall,
  updateSalesOrderStatus,
  // UpdateBankingInfo,
  // deleteBankingInfo,
  // AdddBankingInfo,
  // getBankingInfo,
  // getBankingInfoList,
  addCurrencyCodeApi,
  deleteCurrencyCodeApi,
  getCurrencyCodeApi,
  updateCurrencyCodeApi,
  addSalesUnitApi,
  deleteSalesUnitApi,
  getSalesUnitApi,
  updateSalesUnitApi,
  addPaymentTermApi,
  deletePaymentTermApi,
  getPaymentTermApi,
  updatePaymentTermApi,
  addSitesApi,
  deleteSitesApi,
  getSitesApi,
  updateSitesApi,
  addWarehouseApi,
  deleteWarehouseApi,
  getWarehouseApi,
  updateWarehouseApi,
  addPaymentMethodApi,
  deletePaymentMethodApi,
  getPaymentMethodApi,
  updatePaymentMethodApi,
  getCompanyApi,
  addQuotationCall,
  deleteQuotationCall,
  getQuotationCall,
  updateQuotationCall,
  getVendorApi,
  getPurchaseOrderApi,
  addPurchaseOrderApi,
  deletePurchaseOrderApi,
  updatePurchaseOrderApi,
  getContactApi,
  addContactApi,
  addPurchaseAgreementCall,
  deletePurchaseAgreementCall,
  getPurchaseAgreementCall,
  updatePurchaseAgreementCall,
  addSourcingCall,
  deleteSourcingCall,
  getSourcingCall,
  updateSourcingCall,
  addInvoiceApi,
  deleteInvoiceApi,
  getInvoiceApi,
  updateInvoiceApi,
  addNewVendorCall,
  deleteVendorCall,
  getAllVendorCall,
  updateVendorCall,
  addBankingInfoApi,
  deleteBankingInfoApi,
  getBankingInfoApi,
  updateBankingInfoApi,
  updateProductStatusCall,
  getReasoningListCall,
  updateReasoningCall,
  addDiscountApi,
  deleteDiscountApi,
  getDiscountApi,
  updateDiscountApi,

  // submitReasonCall,
};
