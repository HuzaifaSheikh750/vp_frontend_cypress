import { Modal, ModalBody } from "@/base-components";

import $_ from "lodash";
import { helper as $h } from "@/utils";

function Main({ componentRef, modalOpen, setModalOpen, invoice }) {
  return (
    <Modal
      size="modal-xl"
      slideOver={true}
      show={modalOpen}
      onHidden={() => {
        setModalOpen(false);
      }}
    >
      <ModalBody>
        <>
          <div className="intro-y box overflow-hidden mt-5" ref={componentRef}>
            <div className="flex flex-col lg:flex-row pt-10 px-5 sm:px-20 sm:pt-20 lg:pb-20 text-center sm:text-left">
              <div className="font-semibold text-primary text-3xl"></div>

              <div className="mt-20 lg:mt-0 lg:ml-auto lg:text-right">
                <div className="text-xl text-primary font-medium">
                  {import.meta.env.VITE_COMPANY_NAME}
                </div>
                <div className="mt-1">{import.meta.env.VITE_COMPANY_EMAIL}</div>
                <div className="mt-1">
                  {import.meta.env.VITE_COMPANY_ADDRESS}
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row border-b px-5 sm:px-20 pt-10 pb-10 sm:pb-20 text-center sm:text-left">
              <div>
                <div className="text-base text-slate-500">Vendor Details</div>
                <div className="text-lg font-medium text-primary mt-2">
                  {invoice.vendor?.name || "N/A"}
                </div>
                <div className="mt-1">{invoice.vendor?.email || "N/A"}</div>
              </div>
              <div className="mt-10 lg:mt-0 lg:ml-auto lg:text-right">
                <div className="text-base text-slate-500">Receipt</div>
                <div className="text-lg text-primary font-medium mt-2">
                  Invoice Id : {invoice.id || "N/A"}
                </div>
                <div className="text-lg text-primary font-medium mt-2">
                  Reference Id : {invoice.purchaseOrderId || "N/A"}
                </div>

                <div className="mt-1">
                  Payment Method : {invoice?.paymentMethod?.name ?? "N/A"}
                </div>
                <div className="mt-1">
                  Payment Terms : {invoice?.paymentTerm?.name ?? "N/A"}
                </div>
                <div className="mt-1">
                  Currency : {invoice?.currency?.name ?? "N/A"}
                </div>
                <div className="mt-1">
                  Invoice Date :
                  {$h.formatDate(invoice.invoiceDate, "DD-MMM-YYYY") || "N/A"}
                </div>
              </div>
            </div>
            <div className="intro-y grid grid-cols-11 gap-5 mt-5">
              <div className="col-span-12 lg:col-span-12 2xl:col-span-12">
                <div className="box p-5 rounded-md">
                  <div className="overflow-auto lg:overflow-visible -mt-3">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th className="whitespace-nowrap !py-5">Product</th>
                          <th className="whitespace-nowrap text-right">
                            Unit Price
                          </th>
                          <th className="whitespace-nowrap text-right">Qty</th>
                          <th className="whitespace-nowrap text-right">
                            Unit of Measure
                          </th>
                          <th className="whitespace-nowrap text-right">
                            Currency
                          </th>
                          <th className="whitespace-nowrap text-right">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.hasOwnProperty("invoiceLine")
                          ? $_.take(
                              invoice.invoiceLine,
                              invoice.invoiceLine.length
                            ).map((value, key) => (
                              <tr key={key}>
                                <td className="!py-4">
                                  <div className="flex items-center">
                                    <a
                                      href=""
                                      className="font-medium whitespace-nowrap ml-4"
                                    >
                                      {value.item?.name || "N/A"}
                                    </a>
                                  </div>
                                </td>
                                <td className="text-right">
                                  {$h.formatCurrency(value.unitCost)}
                                </td>
                                <td className="text-right">{value.quantity}</td>
                                <td className="text-right">
                                  {value?.uom?.name ?? "N/A"}
                                </td>

                                <td className="text-right">
                                  {value?.currency?.name ?? "N/A"}
                                </td>
                                <td className="text-right">
                                  {$h.formatCurrency(value?.lineAmount ?? 0) ??
                                    "N/A"}
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-20 pb-10 sm:pb-10 flex flex-col-reverse sm:flex-row mt-4">
              <div className="text-center sm:text-left mt-10 sm:mt-0 ">
                <div className="text-base text-slate-500">Bank Transfer</div>
                <div className="text-lg text-primary font-medium mt-2">
                  Account Title:{" "}
                  {invoice?.vendor?.bankDetails &&
                  invoice?.vendor?.bankDetails[0]
                    ? invoice?.vendor?.bankDetails[0]?.accountTitle
                    : "N/A"}
                </div>
                <div className="mt-1">
                  Bank:{" "}
                  {invoice?.vendor?.bankDetails &&
                  invoice?.vendor?.bankDetails[0]
                    ? invoice?.vendor?.bankDetails[0]?.bank
                    : "N/A"}
                </div>
                <div className="mt-1">
                  Bank Account:{" "}
                  {invoice?.vendor?.bankDetails &&
                  invoice?.vendor?.bankDetails[0]
                    ? invoice?.vendor?.bankDetails[0]?.accountNumber
                    : "N/A"}
                </div>
                <div className="mt-1">
                  IBAN:{" "}
                  {invoice?.vendor?.bankDetails &&
                  invoice?.vendor?.bankDetails[0]
                    ? invoice?.vendor?.bankDetails[0]?.iban
                    : "N/A"}
                </div>
                <div className="mt-1">
                  Swift Code:{" "}
                  {invoice?.vendor?.bankDetails &&
                  invoice?.vendor?.bankDetails[0]
                    ? invoice?.vendor?.bankDetails[0]?.swiftCode
                    : "N/A"}
                </div>
                <div className="mt-1">
                  Bank Branch Code:{" "}
                  {invoice?.vendor?.bankDetails &&
                  invoice?.vendor?.bankDetails[0]
                    ? invoice?.vendor?.bankDetails[0]?.bankBranchCode
                    : "N/A"}
                </div>
                <div className="mt-1">
                  Bank Branch Address:{" "}
                  {invoice?.vendor?.bankDetails &&
                  invoice?.vendor?.bankDetails[0]
                    ? invoice?.vendor?.bankDetails[0]?.bankBranchAddress
                    : "N/A"}
                </div>
              </div>
              <div className="text-center sm:text-right sm:ml-auto">
                <div className="text-center sm:text-right sm:ml-auto mt-1">
                  Tax Type : {invoice?.taxType ?? "N/A"}
                </div>
                <div className="text-center sm:text-right sm:ml-auto mt-1">
                  Tax Rate : {invoice?.taxRate ?? "N/A"}
                </div>
                <div className="text-center sm:text-right sm:ml-auto mt-1">
                  Tax Amount : {$h.formatCurrency(invoice?.taxAmount ?? 0)}
                </div>
                <div className="text-center sm:text-right sm:ml-auto mt-1">
                  Discount Percentage : {invoice?.discountPercentage ?? "N/A"}
                </div>

                <div className="text-base text-slate-500 mt-2">
                  Total Amount
                </div>
                <div className="text-xl text-primary font-medium mt-1">
                  {$h.formatCurrency(invoice?.totalAmount ?? 0) ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
        </>
      </ModalBody>
    </Modal>
  );
}

export default Main;
