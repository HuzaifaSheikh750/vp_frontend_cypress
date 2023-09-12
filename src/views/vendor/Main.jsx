import * as Yup from "yup";

import {
  Alert,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  Tippy
} from "@/base-components";
import { Fragment, useEffect, useState } from "react";
import {
  clearQtyError,
  getQuantity,
  addNewUser as onAddNewUser,
  deleteUser as onDeleteUser,
  getUsers as onGetUsers,
  updateUser as onUpdateUser,
  quantityChange
} from "../../store/actions";

import alternateImage from "../../assets/images/user.png"

import { useDispatch, useSelector } from "react-redux";

import $_ from "lodash";
import { faker as $f } from "@/utils";
import { Columns } from "./Columns";
import DataTable from "react-data-table-component";
import QuantityModal from "./QuantityModal";
import Select from "react-select";
import { keyValue } from "../../utils/keyvalue";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

// lodash

function Main() {
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: 10, label: "10" });
  const [usersData, setUsersData] = useState([]);
  const { users, updated, added, deleted, quantity, updatedQuantity, errorQuantity } = useSelector(
    (state) => state.ManageUsersReducer
  );

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState({
    show: false,
    type: "",
    data: null
  });

  const columnFun = (rec) => setBasicSlideOverPreview(rec);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  useEffect(() => {
    if (parseInt(getPerPage.value) !== users.limit) {
      setCurrentPage(1);
      var params = `?perPage=${getPerPage.value}&page=1`;
    } else {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
    }
    if (users.hasOwnProperty("message")) {
    } else if (
      !users.hasOwnProperty("docs") ||
      getCurrentPage != users.page ||
      parseInt(getPerPage.value) !== users.limit
    ) {
      dispatch(onGetUsers(params));
    }
  }, [users, getCurrentPage, getPerPage]);

  useEffect(() => {
    if (users.hasOwnProperty("docs")) {
      setUsersData(users.docs);
    }
  }, [users]);

  return (
    <Fragment>
      <h2 className="intro-y text-lg font-medium mt-10">CUSTOMERS</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="hidden xl:block mx-auto text-slate-500">
            Showing {getCurrentPage > 1 ? getPerPage.value * (getCurrentPage - 1) + 1 : 1} to{" "}
            {users.totalDocs < getPerPage.value * getCurrentPage
              ? users.totalDocs
              : getPerPage.value * getCurrentPage}{" "}
            of {users.totalDocs} entries
          </div>
          {/*  <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div className="w-56 relative text-slate-500">
              <input type="text" className="form-control w-56 box pr-10" placeholder="Search..." />
              <Lucide icon="Search" className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
            </div>
            </div>*/}
        </div>
        {/* BEGIN: Users Layout */}
        {usersData.map((value, key) => (
          <div key={key} className="intro-y col-span-12 md:col-span-6 lg:col-span-4">
            <div className="box">
              <div className="flex items-start px-5 pt-5">
                <div className="w-full flex flex-col lg:flex-row items-center">
                  <div className="w-16 h-16 image-fit">
                    <img
                      target="_blank"
                      alt="Image Not Found"
                      className="rounded-md"
                      src={
                        value?.productImage?.url ||
                        alternateImage
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src =
                        alternateImage
                      }}
                    />
                  </div>
                  <div className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                    <a href="" className="font-medium">
                      {value?.name || "No Name"}
                    </a>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {value?.userId || "No User Id"}
                    </div>
                  </div>
                </div>
                {/*  <Dropdown className="absolute right-0 top-0 mr-5 mt-3">
                  <DropdownToggle tag="a" className="w-5 h-5 block" href="#">
                    <Lucide icon="MoreHorizontal" className="w-5 h-5 text-slate-500" />
                  </DropdownToggle>
                  <DropdownMenu className="w-40">
                    <DropdownContent>
                      <DropdownItem>
                        <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> Edit
                      </DropdownItem>
                      <DropdownItem>
                        <Lucide icon="Trash" className="w-4 h-4 mr-2" /> Delete
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                    </Dropdown>*/}
              </div>

              <div className="text-center lg:text-left p-5 font-medium">
                <div>Company : {value?.company_name || "N/A"}</div>
                <div className="flex items-center justify-center lg:justify-start text-slate-500 mt-5">
                  <Lucide icon="Mail" className="w-3 h-3 mr-2" />
                  {value?.email || "No Email"}
                </div>
                <div className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                  <Lucide icon="Phone" className="w-3 h-3 mr-2" />
                  {value?.phoneNumber || "No Phone Number"}
                </div>
              </div>
              <div className="text-center lg:text-right p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                <button
                  className="btn btn-primary py-1 px-2 mr-2"
                  onClick={() => {
                    navigate(`/VendorProfile?id=${value._id}`);
                  }}
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* END: Users Layout */}
        {users.hasOwnProperty("docs") ? (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {users.hasPrevPage ? (
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
                        onClick={() => setCurrentPage(users.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(users.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(users.prevPage)}
                      >
                        {users.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {users.page}
                  </a>
                </li>
                {users.hasNextPage ? (
                  <>
                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(users.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(users.nextPage)}
                      >
                        {users.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(users.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(users.totalPages)}
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
    </Fragment>
  );
}

export default Main;
