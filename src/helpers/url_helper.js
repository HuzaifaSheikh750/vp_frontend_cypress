//ORDER_MANAGEMENT AND SALES ORDER LIST
export const GET_ORDER_MANAGEMENT = "/order-management";
export const ADD_ORDER_MANAGEMENT = "/order-management";
export const UPDATE_ORDER_MANAGEMENT = "/order-management";
export const DELETE_ORDER_MANAGEMENT = "/order-management";

//TRANSACTION_HISTORY
export const GET_PAYMENT_DETAILS = "/paymentDetails";
export const ADD_PAYMENT_DETAILS = "/paymentDetails";
export const UPDATE_PAYMENT_DETAILS = "/paymentDetails";
export const DELETE_PAYMENT_DETAILS = "/paymentDetails";

//UPLOAD IMAGES

export const GET_HELP = "/contact/upload";
export const ADD_HELP = "/contact/upload";
export const UPDATE_HELP = "/contact/upload";
export const DELETE_HELP = "/contact/upload";
export const ADD_CONTACT = "/contact";

export const GET_SPECIFIC_CONTACT = "/contact/specific";

export const LOGIN = "/auth/login";

export const EXPORT_ALL_ORDERS = "/order-management/export/AllOrders";

export const EXPORT_ALL_TRANSACTION = "/paymentDetails/export/allPayments";

//Dashboard
export const TOTAL_ORDERS = "/dashboard/totalOrders";

export const OPEN_ORDERS = "/dashboard/openOrders";

export const CANCEL_ORDERS = "/dashboard/cancelOrders";

export const TOTAL_ORDER_PAYMENT = "/dashboard/totalOrderPayments";

export const MONTH_TOP_PRODUCTS = "/dashboard/monthTopProducts";

export const SALES_ORDER_REPORT_HISTORY = "/dashboard/salesOrderReportHistory";

export const MONTH_ORDER_REPORT = "/dashboard/monthOrderReport";

export const AZURE_LOGIN = "/auth/loginViaAzureSSO";

export const QUANTITY = "/notification/getRemainingUsers";

export const USERS = "/user";

export const PLAN = "/plan/getAllPlans";

export const UPDATE_PLAN = "/plan/updatePlan";

export const UPDATE_REMAINING_QUANTITY = "/plan/updateQuantity";

export const UPDATE_SALES_ORDER_STATUS =
  "/order-management/update/orderStatusBulk?id=";

export const VENDORS = "/vendor";

export const SALES_UNIT = "/uom";

export const BANKING_INFO = "/vendor-bank-details";

// * New Endpoints

export const CURRENCY_CODE = "/currencies";

export const PAYMENT_TERM = "/payment-terms";

export const PRODUCTS = "/items";

export const QUOTATION = "/vendor-quote-headers";

export const PAYMENT_METHOD = "/payment-methods";

export const WAREHOUSE = "/warehouses";

export const SITES = "/sites";

export const COMPANY = "/company";

export const PURCHASE_ORDER = "/purchaseOrderHeader";

export const PRODUCT_IMAGE = "/items/uploadImages";

export const CONTACT_IMAGE = "/contact/uploadImages";

export const CONTACT = "/contact";

export const PURCHASE_AGREEMENT = "/contract-header";

export const SOURCING = "/request-for-quotation";

export const INVOICE = "/invoice-headers";

export const REASONING_LIST = "/status-reason";

export const DISCOUNT = "/discount-item";
