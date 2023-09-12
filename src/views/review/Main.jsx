import * as $_ from "lodash";

import { Fragment, useEffect, useState } from "react";
import { Litepicker, Lucide, Modal, ModalBody, ModalHeader } from "@/base-components";
import { getAllContact, getContactDetails } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { Columns } from "./Columns";
import DataTable from "react-data-table-component";
import Select from "react-select";
import alternateImage from "../../assets/images/gallery.png";
import { keyValue } from "../../utils/keyvalue";

function Main() {
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: 10, label: "10" });

  const [getOrderId, setOrderId] = useState("");
  const [getDateRange, setDateRange] = useState("");

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);

  const columnFun = (rec) => setBasicSlideOverPreview(rec);

  const dispatch = useDispatch();

  const [data, setData] = useState({});

  const { contacts, contact } = useSelector((state) => state.HelpReducer);

  useEffect(() => {
    var date = getDateRange.split("-");

    if (parseInt(getPerPage.value) !== contacts.limit) {
      setCurrentPage(1);
      var params = `?perPage=${getPerPage.value}&page=1`;
      // params += getOrderId ? `&name=${getOrderId}` : "";
      params += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`.replace("-","to") : "";
    } else {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      // params += getOrderId ? `&name=${getOrderId}` : "";
      params += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`.replace("-","to") : "";
    }
    if (contacts.hasOwnProperty("message")) {
    } else if (
      !contacts.hasOwnProperty("docs") ||
      getCurrentPage != contacts.page ||
      parseInt(getPerPage.value) !== contacts.limit
    ) {
      dispatch(getAllContact(params));
    }
  }, [dispatch, getCurrentPage, getPerPage]);

  useEffect(() => {
    if (contacts.hasOwnProperty("docs")) {
      setData(contacts.docs);
    }
  }, [contacts]);

  useEffect(() => {
    if (basicSlideOverPreview.data) {
      dispatch(getContactDetails(basicSlideOverPreview.data.id));
    }
  }, [basicSlideOverPreview]);

  const handleFilterFunction = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    var date = getDateRange.split("-");
    // param += getOrderId ? `&name=${getOrderId}` : "";
    param += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`.replace("-","to") : "";
    dispatch(getAllContact(param));
  };

  const handleResetFilter = () => {
    // setOrderId("");
    setDateRange("");

    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(getAllContact(param));
  };

  return (
    <Fragment>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">CONTACT LIST</h2>
      </div>

      <div className="intro-y box p-5 mt-5 ">
        <form id="tabulator-html-filter-form" className="xl:flex sm:mr-auto mb-4">
          <div className="sm:flex items-center sm:mr-4">
            {/*<div className="w-48 relative text-slate-500 ">
              <input
                id="tabulator-html-filter-value"
                type="text"
                className="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
                placeholder="Search By User Name"
                value={getOrderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                }}
              />
              <Lucide icon="Search" className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>*/}
          </div>
          <div className="sm:flex items-center sm:mr-4">
            <Litepicker
              value={getDateRange}
              placeholder="Search By Posted Date"
              onChange={setDateRange}
              options={{
                autoApply: false,
                singleMode: false,
                numberOfColumns: 2,
                numberOfMonths: 2,
                showWeekNumbers: true,
                dropdowns: {
                  minYear: 1990,
                  maxYear: null,
                  months: true,
                  years: true
                }
              }}
              className="form-control w-56 block mx-auto"
            />
          </div>

          <div className="mt-2 xl:mt-0">
            <button
              id="tabulator-html-filter-go"
              type="button"
              className="btn btn-primary w-full sm:w-16 mr-3"
              onClick={() => handleFilterFunction()}
            >
              Filter
            </button>
            <button
              id="tabulator-html-filter-reset"
              type="button"
              className="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1"
              onClick={() => handleResetFilter()}
            >
              Reset
            </button>
          </div>
        </form>
        <div className="overflow-x-auto scrollbar-hidden">
          <DataTable
            title="Users"
            columns={Columns(columnFun)}
            data={data}
            highlightOnHover
            pointerOnHover
            responsive
            striped
            noHeader
            // paginationComponent={CustomPagination}
            customStyles={{
              rows: {
                style: {
                  minHeight: "72px" // override the row height
                }
              },
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "bold"
                }
              },
              cells: {
                style: {
                  fontSize: "15px"
                }
              }
            }}
          />
        </div>
        {contacts.hasOwnProperty("docs") ? (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {contacts.hasPrevPage ? (
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
                        onClick={() => setCurrentPage(contacts.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(users.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(contacts.prevPage)}
                      >
                        {contacts.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {contacts.page}
                  </a>
                </li>
                {contacts.hasNextPage ? (
                  <>
                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(contacts.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(contacts.nextPage)}
                      >
                        {contacts.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(contacts.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(contacts.totalPages)}
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
              options={keyValue.optionsPerPage}
            />
          </div>
        ) : null}
      </div>
      <Modal
        size="modal-xl"
        slideOver={true}
        show={basicSlideOverPreview.show}
        onHidden={() => {
          setBasicSlideOverPreview({
            type: "",
            show: false,
            data: null
          });
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="text-lg mr-auto font-medium">Contact Details</h1>
        </ModalHeader>
        <ModalBody>
          <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4">
            <div className="box">
              <div className="font-medium px-5 py-3 mt-5">User Information</div>

              <div className="flex items-start px-5 pt-5">
                <div className="w-full flex flex-col lg:flex-row items-center">
                  <div className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                    <div className="font-medium">
                      Name : {contact?.userRefId?.name ? contact?.userRefId?.name : "N/A"}
                    </div>
                    <div className="font-medium mt-1">
                      Email : {contact?.userRefId?.email ? contact?.userRefId?.email : "N/A"}
                    </div>
                    <div className="font-medium mt-1">
                      Phone :{" "}
                      {contact?.userRefId?.phoneNumber ? contact?.userRefId?.phoneNumber : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-200/60 dark:border-darkmode-400 mt-5">
                <div className="font-medium">Title</div>
                <div className="text-gray-600 mt-2 text-lg">
                  {contact?.title ? contact?.title : "N/A"}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-200/60 dark:border-darkmode-400 mt-5">
                <div className="font-medium">Content</div>
                <div
                  className="text-gray-600 mt-2"
                  dangerouslySetInnerHTML={{ __html: contact.content ? contact?.content : "N/A" }}
                ></div>
              </div>
            </div>

            <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4">
              <div className="box">
                <div className="font-medium px-5 py-3 mt-5">Images</div>

                <div className="flex items-start px-5 pt-5">
                  <div className="w-full flex flex-col lg:flex-row items-center">
                    <div className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                      <div className="font-medium">
                        Caption : {contact?.caption ? contact?.caption : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-5 mt-5 pt-5">
                  {contact &&
                  contact?.images &&
                  contact?.images?.length > 0 &&
                  contact?.images[0].url ? (
                    contact?.images?.map((value, index) => (
                      <div
                        key={index}
                        className="intro-y block col-span-12 sm:col-span-2 2xl:col-span-3"
                      >
                        <div className="box rounded-md p-3 relative zoom-in">
                          <div className="flex-none relative block before:block before:w-full before:pt-[100%]">
                            <div className="absolute top-0 left-0 w-full h-full image-fit">
                              <img
                                target="_blank"
                                alt="Image Not Found"
                                className="rounded-md"
                                src={value.url ? value.url : alternateImage}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = alternateImage;
                                }}
                              />
                            </div>
                          </div>
                          {/* <div className="block font-medium text-center truncate mt-3">
                            {value.filename}
                              </div>*/}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center">No Image Found</div>
                  )}
                </div>
              </div>
            </div>
            {/*            <div className="text-center lg:text-right p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <button className="btn btn-primary py-1 px-2 mr-2">Message</button>
              <button className="btn btn-outline-secondary py-1 px-2">Profile</button>
                            </div>*/}
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default Main;
