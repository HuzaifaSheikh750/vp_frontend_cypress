import * as Yup from "yup";

import { Fragment, useEffect, useState } from "react";
import { Lucide, Modal, ModalBody, Tippy, TomSelect } from "@/base-components";
import {
  getSpecificUser,
  deleteBankingInfo as onDeleteBankingInfo,
  getVendor as onGetVendor,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { helper as $h } from "@/utils";
import Constants from "../../constants/Constants";
import ShippingAddressModal from "./ShippingAddressModal";
import UserInformationForm from "./UserInformationForm";
import VendorInformationForm from "./VendorInformationForm";
import alternateImage from "../../assets/images/user.png";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submit, setSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("personalInformation");
  const [editMode, setEditMode] = useState(false); // **  false = add mode, true = edit mode
  const [enabledTabs, setEnabledTabs] = useState(["personalInformation"]);
  const maxFileSize = 5242880;

  const {
    vendor,
    user,
    loading,
    updated,
    error,
    shippingInfoDeleted,
    bankUpdated,
    bankAdded,
    bankDeleted,
  } = useSelector((state) => state.ManageUsersReducer);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    show: false,
    data: null,
  });

  const [addUpdateModal, setAddUpdateModal] = useState({
    show: false,
    type: "",
    data: null,
  });

  const editModeCallback = (rec) => setEditMode(rec);

  const setTabCallback = (rec) => setActiveTab(rec);

  const callbackFunc = (rec) => setAddUpdateModal(rec);

  useEffect(() => {
    if ($h.getRoleId() === Constants.USER_ROLE_ID) {
      navigate(`/profile?id=${$h.getUserId()}`, { replace: true });
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      if ($h.isNullObject(user) || user.id !== id) {
        dispatch(getSpecificUser(`/${id}`));
        // add other tabs in enabledTabs
        setEnabledTabs((prevTabs) => [
          ...prevTabs,
          "shipmentSettings",
          "bankInformation",
        ]);
        setEditMode(true);
      }
    }
  }, [dispatch]);

  const addEnabledTabs = (rec) => {
    if (!enabledTabs.includes(rec)) {
      setEnabledTabs([...enabledTabs, rec]);
    }
  };

  useEffect(() => {
    if (!$h.isNullObject(user) && user?.vendor?.id) {
      dispatch(onGetVendor(`/${user?.vendor?.id}`));
    }
  }, [user]);

  return (
    <Fragment>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          {editMode ? "EDIT " : "CREATE "}
          VENDOR PROFILE
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 2xl:col-span-3 flex lg:block flex-col-reverse">
          <div className="intro-y box mt-5">
            <div className="relative flex items-center p-5">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 image-fit">
                  <img
                    target="_blank"
                    alt="Image Not Found"
                    className="rounded-full"
                    src={alternateImage}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = alternateImage;
                    }}
                  />
                </div>
              </div>
              <div className="ml-4 mr-auto">
                <div className="font-medium text-base">{user?.name}</div>
                <div className="text-slate-500">{user?.email}</div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <div
                className={classnames("flex items-center mt-5", {
                  "cursor-pointer ": true,
                  "text-primary font-medium":
                    activeTab == "personalInformation",
                })}
                onClick={() => setActiveTab("personalInformation")}
              >
                <Lucide icon="Activity" className="w-4 h-4 mr-2" /> Personal
                Information
              </div>
              <div
                className={classnames("flex items-center mt-5", {
                  "cursor-pointer": !editMode // **  false = add mode, true = edit mode
                    ? false
                    : enabledTabs.includes("shipmentSettings"),
                  "text-primary font-medium": activeTab == "shipmentSettings",
                })}
                onClick={() => {
                  if (enabledTabs.includes("shipmentSettings")) {
                    setActiveTab("shipmentSettings");
                  }
                }}
              >
                <Lucide icon="Box" className="w-4 h-4 mr-2" /> Vendor
                Information
              </div>
              <div
                className={classnames("flex items-center mt-5", {
                  "cursor-pointer ": !editMode
                    ? false
                    : enabledTabs.includes("bankInformation"),
                  "text-primary font-medium": activeTab == "bankInformation",
                })}
                onClick={() => {
                  if (enabledTabs.includes("bankInformation")) {
                    setActiveTab("bankInformation");
                  }
                }}
              >
                <Lucide icon="Box" className="w-4 h-4 mr-2" />
                Bank Information
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          {activeTab === "personalInformation" ? (
            <UserInformationForm
              editMode={editMode}
              editModeCallback={editModeCallback}
              setTabCallback={setTabCallback}
              addEnabledTabs={addEnabledTabs}
            />
          ) : activeTab === "shipmentSettings" ? (
            <VendorInformationForm
              editMode={editMode}
              editModeCallback={editModeCallback}
              setTabCallback={setTabCallback}
              addEnabledTabs={addEnabledTabs}
            />
          ) : activeTab === "bankInformation" ? (
            <div className="intro-y box mt-5">
              <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 className="font-medium text-base mr-auto">
                  Bank Information
                </h2>
              </div>
              <div className="p-5">
                <div className="intro-y grid grid-cols-9 gap-4">
                  {vendor?.bankDetails && vendor.bankDetails.length > 0 ? (
                    vendor.bankDetails.map((rec, index) => {
                      return (
                        <div
                          name="selectedAddress"
                          key={index}
                          className="col-span-12 lg:col-span-6 2xl:col-span-3"
                          onClick={() => {}}
                        >
                          <div
                            className={classnames("box p-5 rounded-md mt-5", {
                              "bg-[#1E40AF]": false,
                              "text-[#f8fafc]": false,
                            })}
                          >
                            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                              <div className="font-medium text-base truncate">
                                Bank Information {index + 1}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Lucide
                                icon="Clipboard"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              ID: {rec.id}
                            </div>
                            <div className="flex items-center mt-3">
                              <Lucide
                                icon="Calendar"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              Bank: {rec.bank}
                            </div>

                            <div className="flex items-center mt-3">
                              <Lucide
                                icon="MapPin"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              Account Title: {rec.accountTitle}
                            </div>
                            <div className="flex items-center mt-3">
                              <Lucide
                                icon="MapPin"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              Account Number: {rec.accountNumber}
                            </div>
                            <div className="flex items-center mt-3">
                              <Lucide
                                icon="MapPin"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              IBAN: {rec.iban}
                            </div>
                            <div className="flex items-center mt-3">
                              <Lucide
                                icon="MapPin"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              Swift Code: {rec.swiftCode}
                            </div>
                            <div className="flex items-center mt-3">
                              <Lucide
                                icon="MapPin"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              Bank Branch Code: {rec.bankBranchCode}
                            </div>
                            <div className="flex items-center mt-3">
                              <Lucide
                                icon="MapPin"
                                className={classnames(
                                  "w-4 h-4 text-slate-500 mr-2",
                                  {
                                    "text-[#fff]": false,
                                  }
                                )}
                              />
                              Bank Branch Address: {rec.bankBranchAddress}
                            </div>

                            <div className="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400 mt-4">
                              <div
                                className="cursor-pointer flex items-center mr-3"
                                onClick={() => {
                                  setAddUpdateModal({
                                    show: true,
                                    type: "edit",
                                    data: rec,
                                  });
                                }}
                              >
                                <Lucide
                                  icon="CheckSquare"
                                  className="w-4 h-4 mr-1"
                                />{" "}
                                Edit
                              </div>
                              {vendor.bankDetails.length > 1 && (
                                <div
                                  className="cursor-pointer flex items-center text-danger"
                                  onClick={() => {
                                    setDeleteConfirmationModal({
                                      show: true,
                                      data: rec,
                                    });
                                  }}
                                >
                                  <Lucide
                                    icon="Trash2"
                                    className="w-4 h-4 mr-1"
                                  />{" "}
                                  Delete
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-12 lg:col-span-6 2xl:col-span-3 mt-5">
                      <div className="flex items-center pb-5 mb-5">
                        <div className="font-medium text-base truncate">
                          No Bank Details Available
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    className="flex items-center btn btn-primary"
                    onClick={() => {
                      setAddUpdateModal({
                        show: true,
                        type: "add",
                        data: null,
                      });
                    }}
                  >
                    Add New Bank Information
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
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
              Do you really want to delete these record? <br />
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
                dispatch(
                  onDeleteBankingInfo(deleteConfirmationModal?.data?.id)
                );
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
      <ShippingAddressModal
        editMode={editMode}
        show={addUpdateModal.show}
        type={addUpdateModal.type}
        Func={callbackFunc}
        data={addUpdateModal.type == "add" ? null : addUpdateModal.data}
      />
    </Fragment>
  );
}

export default Main;
