import "toastr/build/toastr.min.css";
import "react-input-range/lib/css/index.css";

import * as $_ from "lodash";

import {
  AddtoCart,
  deleteProductList,
  addNewProductList as onAddNewProductList,
  deleteProductList as onDeleteProductList,
  getProductList as onGetProductList,
  QuantityChange as onQuantityChange,
  updateProductList as onUpdateProductList,
} from "../../store/actions";
import { Lucide, Modal, ModalBody } from "@/base-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { helper as $h } from "@/utils";
import Constants from "../../constants/Constants";
import InputRange from "react-input-range";
import ProductModal from "./ProductModal";
import Select from "react-select";
import alternateImage from "../../assets/images/gallery.png";
import classNames from "classnames";
import toastr from "toastr";

function Main() {
  const dispatch = useDispatch();

  const { productList } = useSelector((state) => ({
    productList: state.ProductListReducer?.productList,
  }));

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    show: false,
    data: null,
  });

  const [addUpdateModal, setAddUpdateModal] = useState({
    show: false,
    type: "",
    data: null,
  });

  const [getProductList, setProductList] = useState([]);
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [getName, setName] = useState("");
  const [getVendorId, setVendorId] = useState("");
  const [getVendorName, setVendorName] = useState("");
  const [value, setValue] = useState({ min: 0, max: 5000 });

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  useEffect(() => {
    if (getPerPage.value != productList.limit) {
      setCurrentPage(1);
      var params = `?perPage=${getPerPage.value}&page=1`;
      params += getName ? `&name=${getName}` : "";
    } else {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      params += getName ? `&name=${getName}` : "";
    }
    if (productList.hasOwnProperty("message")) {
    } else if (
      !productList.hasOwnProperty("docs") ||
      getCurrentPage != productList.page ||
      getPerPage.value != productList.limit
    )
      dispatch(onGetProductList(params));

    setProductList(productList);
  }, [dispatch, getCurrentPage, getPerPage]);

  const options = [
    { value: 10, label: "10" },
    { value: 25, label: "25" },
    { value: 35, label: "35" },
    { value: 50, label: "50" },
  ];

  const callbackFunc = (rec) => setAddUpdateModal(rec);

  const handleNameSearch = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    param += getName ? `name=${getName}` : "";
    param += getVendorId ? `&vendorId=${getVendorId}` : "";
    param += getVendorName ? `&vendorName=${getVendorName}` : "";
    param += `&priceRange=${value.min}to${value.max}`;
    param += dispatch(onGetProductList(param));
  };

  const handleResetFilter = () => {
    setName("");
    setVendorId("");
    setVendorName("");
    setValue({ min: 0, max: 5000 });
    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(onGetProductList(param));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setName(e.target.value);
      handleNameSearch();
    }
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10">PRODUCTS</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          {
            // role
            $h.getRoleId() === Constants.ADMIN_ROLE_ID ? (
              <>
                <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0 mr-4">
                  <div className="w-48 relative text-slate-500">
                    <input
                      type="text"
                      className="form-control w-48 box pr-10 "
                      value={getVendorId}
                      placeholder="Search By Vendor Id"
                      onChange={(e) => {
                        setVendorId(e.target.value);
                      }}
                      // onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0 mr-8">
                  <div className="w-48 relative text-slate-500">
                    <input
                      type="text"
                      className="form-control w-52 box pr-10 "
                      value={getVendorName}
                      placeholder="Search By Vendor Name"
                      onChange={(e) => {
                        setVendorName(e.target.value);
                      }}
                      // onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </>
            ) : null
          }
          <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0 mr-2">
            <div className="w-48 relative text-slate-500">
              <input
                type="text"
                className="form-control w-48 box pr-10 "
                value={getName}
                placeholder="Search By Title"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <label className=" text-slate-500 mr-4">Price Range</label>
          <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0 mr-2">
            <div className="w-48 relative text-slate-500">
              <InputRange
                maxValue={5000}
                minValue={0}
                step={25}
                value={value}
                onChange={(value) => setValue(value)}
              />
            </div>
          </div>
          <button
            className="btn btn-primary shadow-md mr-2 ml-5"
            onClick={() => handleNameSearch()}
          >
            <Lucide icon="Search" className="w-4 h-4 mr-2" />
            Search
          </button>
          <button
            id="tabulator-html-filter-reset"
            type="button"
            className="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 ml-3"
            onClick={() => handleResetFilter()}
          >
            Reset
          </button>
          <div className="hidden md:block mx-auto text-slate-500">
            Showing{" "}
            {getCurrentPage > 1
              ? getPerPage.value * (getCurrentPage - 1) + 1
              : 1}{" "}
            to{" "}
            {productList.totalDocs < getPerPage.value * getCurrentPage
              ? productList.totalDocs
              : getPerPage.value * getCurrentPage}{" "}
            of {productList.totalDocs} entries
          </div>

          <button
            className="btn btn-primary shadow-md mr-2"
            onClick={() => setAddUpdateModal({ show: true, type: "add" })}
          >
            Add New Product
          </button>
        </div>
        {$_.take(productList.docs, productList.totalDocs).map(
          (value, index) => (
            <div
              key={index}
              className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
            >
              <div className="box">
                <div className="p-5">
                  <div className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                    <img
                      target="_blank"
                      alt="Image Not Found"
                      className="rounded-md"
                      src={
                        value?.imageUrl && value.imageUrl.length > 0
                          ? value.imageUrl[0]?.url
                          : alternateImage
                      }
                      // src={value.imageUrl ?? alternateImage}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = alternateImage;
                      }}
                    />
                    {value?.discountItem != null ? (
                      <span className="absolute top-0 bg-pending/80 text-white text-xs m-5 px-2 py-1 rounded z-10">
                        {value?.discountItem?.discountPercentage}% Off
                      </span>
                    ) : null}
                    <div className="absolute bottom-0 text-white px-5 pb-6 z-10">
                      <a
                        href=""
                        className="block font-medium text-base capitalize"
                      >
                        {value.name}
                      </a>
                    </div>
                  </div>
                  <div className="mt-5">
                    {$h.getRoleId() === Constants.ADMIN_ROLE_ID ? (
                      <>
                        <div className="flex items-center mt-2">
                          <Lucide
                            icon="User"
                            className="w-4 h-4 text-slate-500 mr-2"
                          />
                          Vendor :
                          <span className="text-gray-700 dark:text-gray-600 text-xs ml-2">
                            {value?.vendor?.id ?? ""}{" "}
                            {value?.vendor?.name ?? ""}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="ml-2">
                            {value?.authorized ? "Authorized" : "Unauthorized"}
                          </span>
                        </div>

                        <div className="d-flex flex items-center mt-2">
                          <span className="ml-2">
                            Rating:{" "}
                            <div className="flex items-center mt-2">
                              {Array.from({ length: value?.rating ?? 0 }).map(
                                (_, index) => (
                                  <Lucide
                                    key={index}
                                    icon="Star"
                                    className="w-4 h-4 text-slate-500"
                                  />
                                )
                              )}
                            </div>
                          </span>
                        </div>
                      </>
                    ) : null}

                    <div className="flex items-center mt-3">
                      <Lucide icon="DollarSign" className="w-4 h-4 mr-2" />{" "}
                      Price: {$h.formatCurrency(value.unitPrice)}
                    </div>

                    {value?.discountedUnitPrice != null ? (
                      <div className="flex items-center mt-3">
                        <Lucide icon="DollarSign" className="w-4 h-4 mr-2" />{" "}
                        Discounted Price:{" "}
                        {$h.formatCurrency(value.discountedUnitPrice)}
                      </div>
                    ) : null}

                    <div className="flex items-center mt-3">
                      <Lucide icon="Ruler" className="w-4 h-4 mr-2" /> Unit Of
                      Measure : {value?.uom?.name ?? ""}
                    </div>
                  </div>
                </div>
                <div className="justify-between flex items-center px-5 pb-5">
                  <button
                    type="button"
                    className="btn btn-primary w-full mr-4"
                    onClick={() =>
                      setAddUpdateModal({
                        show: true,
                        type: "edit",
                        data: value,
                      })
                    }
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger w-full"
                    onClick={() => {
                      setDeleteConfirmationModal({ show: true, data: value });
                    }}
                  >
                    Delete
                  </button>
                </div>

                {/*  <div className="flex items-center mt-2 pb-5">
                <div className="ml-5 flex flex-row h-10 w-40 rounded-lg relative bg-transparent mt-1">
                  <button
                    data-action="decrement"
                    className="bg-[#F1F5F9] text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                    onClick={() => {
                      addToCart("decrement", value);
                      // Decrement(index, value.productGenId);
                    }}
                  >
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-[#F1F5F9] font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 -webkit-appearance: none margin:0"
                    name="custom-input-number"
                    value={value.addToCart == undefined ? 0 : value.addToCart}
                    min="0"
                    onChange={(e) => onInputChange("input", e.target.value, value)}
                    onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                  ></input>
                  <button
                    data-action="increment"
                    className="bg-[#F1F5F9] text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                    onClick={() => {
                      addToCart("increment", value);
                    }}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
                <div className="ml-5 md:ml-10 lg:ml-15 w-full xl:w-auto flex items-center xl:mt-0">
                  <button
                    className="btn btn-primary shadow-md mr-2"
                    onClick={() => {
                      if (
                        !value.hasOwnProperty("CartVisibility") ||
                        value.CartVisibility == false
                      ) {
                        MakeVisibletoCart(value);
                      } else {
                        toastr.info("Item has already been added.");
                      }
                    }}
                  >
                    <Lucide icon="ShoppingBag" className="w-4 h-4 mr-2" />
                    <span>Add to Cart</span>
                  </button>
                </div>
                </div>*/}
              </div>
            </div>
          )
        )}
        <div
          className={classNames({
            "flex flex-col items-center mt-2 pb-5":
              screen.width < 1700
                ? "flex items-center mt-2 pb-5"
                : screen.width > 1700,
          })}
        ></div>
        {productList?.docs?.length > 0 ? (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {productList.hasPrevPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(1)}
                      >
                        <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(productList.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(productList.prevPage)}
                      >
                        {productList.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {productList.page}
                  </a>
                </li>
                {productList.hasNextPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(productList.nextPage)}
                      >
                        {productList.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(productList.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(productList.totalPages)}
                      >
                        <Lucide icon="ChevronsRight" className="w-4 h-4" />
                      </a>
                    </li>
                  </>
                ) : null}
              </ul>
            </nav>
            <Select
              defaultValue={getPerPage}
              onChange={(e) =>
                setPerPage({ value: `${e.value}`, label: `${e.value}` })
              }
              options={options}
            />
          </div>
        ) : null}
      </div>
      {productList?.docs ? null : (
        <div className="">
          <div className="flex flex-row items-center justify-center pt-10 pb-10">
            <Lucide icon="Info" className="w-6 h-6 mr-2" />
            <h2 className="text-lg font-medium ">Products Unavailable</h2>
          </div>
        </div>
      )}
      <Modal
        show={deleteConfirmationModal.show}
        onHidden={() => {
          setDeleteConfirmationModal({
            show: false,
            data: null,
          });
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal({
                  show: false,
                  data: null,
                });
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger w-24"
              onClick={() => {
                dispatch(deleteProductList(deleteConfirmationModal?.data?.id));
                setDeleteConfirmationModal({
                  show: false,
                  data: null,
                });
              }}
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
      <ProductModal
        show={addUpdateModal.show}
        type={addUpdateModal.type}
        Func={callbackFunc}
        data={addUpdateModal.type == "add" ? null : addUpdateModal.data}
      />
    </>
  );
}

export default Main;
