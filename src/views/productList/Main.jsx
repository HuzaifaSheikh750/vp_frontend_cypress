import "toastr/build/toastr.min.css";

import * as $_ from "lodash";

import {
  AddtoCart,
  addNewProductList as onAddNewProductList,
  deleteProductList as onDeleteProductList,
  getProductList as onGetProductList,
  QuantityChange as onQuantityChange,
  updateProductList as onUpdateProductList
} from "../../store/actions";
import { Lucide, Modal, ModalBody } from "@/base-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { helper as $h } from "@/utils";
import Select from "react-select";
import alternateImage from "../../assets/images/gallery.png";
import classNames from "classnames";
import toastr from "toastr";

function Main() {
  const dispatch = useDispatch();

  const { productList } = useSelector((state) => ({
    productList: state.ProductListReducer?.productList
  }));

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [getProductList, setProductList] = useState([]);
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [getName, setName] = useState("");

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
    { value: 50, label: "50" }
  ];

  const handleNameSearch = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;

    param += getName ? `&name=${getName}` : "";

    dispatch(onGetProductList(param));
  };

  const handleResetFilter = () => {
    setName("");
    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(onGetProductList(param));
  };

  const onInputChange = (from, value, product) => {
    dispatch(onQuantityChange({ record: product, action: from, value: value }));
  };

  const addToCart = (from, product) => {
    dispatch(onQuantityChange({ record: product, action: from }));
  };

  const MakeVisibletoCart = (product) => {
    dispatch(AddtoCart(product));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setName(e.target.value);
      handleNameSearch();
    }
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10">Product List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="hidden md:block mx-auto text-slate-500">
            Showing {getCurrentPage > 1 ? getPerPage.value * (getCurrentPage - 1) + 1 : 1} to{" "}
            {productList.totalDocs < getPerPage.value * getCurrentPage
              ? productList.totalDocs
              : getPerPage.value * getCurrentPage}{" "}
            of {productList.totalDocs} entries
          </div>
          <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
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
        </div>
        {/* BEGIN: Users Layout */}
        {$_.take(productList.docs, productList.totalDocs).map((value, index) => (
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
                    src={value.productImage[0]?.url ? value.productImage[0]?.url : alternateImage}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = alternateImage;
                    }}
                  />

                  <div className="absolute bottom-0 text-white px-5 pb-6 z-10">
                    <a href="" className="block font-medium text-base">
                      {value.name}
                    </a>
                    <span className="text-white/90 text-xs mt-3">{value.category}</span>
                  </div>
                </div>
                <div className="text-slate-600 dark:text-slate-500 mt-5">
                  <div className="flex items-center">
                    <Lucide icon="DollarSign" className="w-4 h-4 mr-2" /> Price:{" "}
                    {$h.formatCurrency(value.price)}
                  </div>

                  <div className="flex items-center mt-3">
                    <Lucide icon="CheckSquare" className="w-4 h-4 text-slate-500 mr-2" />
                    Status:
                    {value.status != "available" ? (
                      <span className="bg-info/20 text-info rounded px-2 ml-1">
                        {$h.capitalizeFirstLetter(value.status)}
                      </span>
                    ) : (
                      <span className="bg-success/20 text-success rounded px-2 ml-1">
                        {$h.capitalizeFirstLetter(value.status)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-3">
                    <Lucide icon="Ruler" className="w-4 h-4 mr-2" /> Unit Of Measure :{" "}
                    {value.unitOfMeasure}
                  </div>
                </div>
              </div>

              <div
                className="flex mt-2 pb-5 xl:flex-col lg:flex-col items-center justify-between mx-8
              "
              >
                <div className=" flex flex-row h-10 w-32 rounded-lg  bg-transparent">
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
                    // QuantityofEachProduct GET INDEX OF EACH PRODUCT AND ADD TO CART
                    // vakue= {QuantityofEachProduct(value.productGenId)
                    min={0}
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
                <div className="xl:mt-4 lg:mt-4 ">
                  <button
                    className="btn btn-primary shadow-md"
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
              </div>
            </div>
          </div>
        ))}
        <div
          className={classNames({
            "flex flex-col items-center mt-2 pb-5":
              screen.width < 1700 ? "flex items-center mt-2 pb-5" : screen.width > 1700
          })}
        ></div>
        {/* END: Users Layout */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              {productList.hasPrevPage ? (
                <>
                  <li className="page-item">
                    <a className="page-link" href="#123" onClick={() => setCurrentPage(1)}>
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
            onChange={(e) => setPerPage({ value: `${e.value}`, label: `${e.value}` })}
            options={options}
          />
        </div>
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
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
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button type="button" className="btn btn-danger w-24">
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
