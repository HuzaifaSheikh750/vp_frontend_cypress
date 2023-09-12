const keyValue = {
  optionsPerPage: [
    { value: 10, label: "10" },
    { value: 25, label: "25" },
    { value: 35, label: "35" },
    { value: 50, label: "50" },
  ],

  optionsOrderStatus: [
    { value: "approved", label: "Approved" },
    { value: "approval", label: "Approval" },
    { value: "processing", label: "Processing" },
    { value: "packing", label: "Packing" },
    { value: "shipping", label: "Shipping" },
    { value: "delivered", label: "Delivered" },
  ],
  orderStatus: [
    { value: "paid", label: "Paid" },
    { value: "refund", label: "Refund" },
    { value: "unpaid", label: "Unpaid" },
  ],
  paymentStatus: [
    //  Draft, Sent, Rejected, Approved
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
  ],
  purchaseOrderStatus: [
    { value: "open", label: "Open" },
    { value: "received", label: "Received" },
    { value: "invoiced", label: "Invoiced" },
    { value: "cancelled", label: "Cancelled" },
  ],

  commitmentStatusOptions: [
    { value: "product_quantity", label: "Product Quantity" },
    { value: "product_value", label: "Product Value" },
    { value: "product_category_value", label: "Product Category Value" },
    { value: "value", label: "Value" },
  ],
  agreementStatusOptions: [
    { value: "on_hold", label: "On Hold" },
    { value: "effective", label: "Effective" },
    { value: "closed", label: "Closed" },
  ],

  paymentStatusOptions: [
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
  ],
};

export { keyValue as keyValue };
