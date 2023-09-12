import {
  Alert,
  LoadingIcon,
  Lucide,
  Modal,
  ModalBody,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from "@/base-components";
import { clearError, clearResponse, getAllPlan, updatePlan } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Loader from "./Loader";
import classnames from "classnames";

function Main() {
  const dispatch = useDispatch();

  const [data, setData] = useState({});

  const getInfo = () => {
    const data = localStorage.getItem("authUser");
    if (data) {
      setData(JSON.parse(data).azure_data);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const [deleteModalPreview, setDeleteModalPreview] = useState({
    isOpen: false,
    plan: null
  });

  const { plans, loading, error, result, updateerror } = useSelector((state) => state.PlanReducer);

  useEffect(() => {
    if (result === 1 || updateerror) {
      if (result === 1) {
        //   localStorage.setItem("plan", deleteModalPreview.plan);

        //const azureData = data;
        // azureData.azure_planId = deleteModalPreview.plan;
        const authObj = JSON.parse(localStorage.getItem("authUser"));
        authObj.azure_data.azure_planId = deleteModalPreview.plan;
        localStorage.setItem("authUser", JSON.stringify(authObj));
        getInfo();

        // localStorage.setItem("authUser", JSON.stringify(azureData));
      }

      setDeleteModalPreview({
        isOpen: false,
        plan: null
      });

      dispatch(clearResponse());
    }
  }, [result, updateerror]);

  const handlePlanChange = () => {
    dispatch(
      updatePlan({
        azureId: data?.azure_unique_id,
        planId: deleteModalPreview.plan
      })
    );
  };

  useEffect(() => {
    if (plans === null) {
      dispatch(getAllPlan());
    }
  }, [dispatch]);

  return (
    <>
      <h2 className="intro-y text-2xl font-medium mt-10 text-center mr-auto">
        Best Price & Services
      </h2>
      <TabGroup>
        {/* BEGIN: Pricing Tab */}
        <div className="intro-y flex justify-center mt-6">
          <TabList className="pricing-tabs nav-pills w-auto box rounded-full mx-auto overflow-hidden">
            <Tab className="w-32 lg:w-40 py-2 lg:py-3" tag="button">
              Monthly Fees
            </Tab>
          </TabList>
        </div>
        {updateerror !== null ? (
          <div className="col-span-12 mt-6 -mb-6 intro-y">
            <Alert className="box bg-danger text-white flex items-center mb-6">
              {({ dismiss }) => (
                <>
                  <span>{updateerror?.message}</span>
                  <button
                    type="button"
                    className="btn-close text-white"
                    onClick={() => {
                      dispatch(clearError());
                      dismiss();
                    }}
                    aria-label="Close"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                </>
              )}
            </Alert>
          </div>
        ) : null}

        {/* END: Pricing Tab */}
        {/* BEGIN: Pricing Content */}
        <div className="flex mt-10">
          <TabPanels>
            <TabPanel className="flex flex-col lg:flex-row">
              {plans &&
                plans.map((plan, index) => {
                  return (
                    <div
                      key={index}
                      className={classnames("intro-y flex-1 box py-16 lg:ml-5 mb-5 lg:mb-0", {
                        "border-2 border-primary dark:border-primary":
                          data?.azure_planId === plan.planId
                      })}
                      onClick={() => {
                        if (data?.azure_planId !== plan.planId) {
                          setDeleteModalPreview({
                            isOpen: true,
                            plan: plan.planId
                          });
                        }
                      }}
                    >
                      <Lucide icon="Briefcase" className="block w-12 h-12 text-primary mx-auto" />
                      <div className="text-xl font-medium text-center mt-10">{plan.name}</div>
                      <div className="text-slate-600 dark:text-slate-500 text-center mt-5">
                        {plan.min_users_allowed} Users Allowed
                      </div>
                      <div className="text-slate-500 px-10 text-center mx-auto mt-2">
                        {plan.details.functionality_allowed.map((item, index) => {
                          return (
                            <div key={index} className="flex items-center justify-center mt-2">
                              <Lucide icon="Check" className="w-4 h-4 mr-2" />
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        <div className="flex justify-center">
                          <div className="relative text-5xl font-semibold mt-8 mx-auto">
                            <span className="absolute text-2xl top-0 left-0 -ml-4">$</span>
                            {plan.details.pricing_details[0].price}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-rounded-primary py-3 px-4 block mx-auto mt-8"
                          disabled={data?.azure_planId === plan.planId}
                        >
                          {data?.azure_planId === plan.planId ? "PURCHASED" : "PURCHASE"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </TabPanel>
          </TabPanels>
        </div>
      </TabGroup>
      <Modal
        backdrop={loading ? "static" : ""}
        show={deleteModalPreview.isOpen}
        onHidden={() => {
          setDeleteModalPreview({
            isOpen: false,
            plan: null
          });
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-5">
                <Loader className="w-16 h-16 mx-auto mt-6" />
                <div className="text-2xl mt-5 mb-3">
                  Please wait <br /> while we are processing your request
                </div>
              </div>
            ) : (
              <div>
                <Lucide icon="PackageCheck" className="w-16 h-16 text-success mx-auto mt-3" />
                <div className="text-3xl mt-5">Are you sure?</div>
                <div className="text-slate-500 mt-2">
                  Do you really want to change your plan
                  <br />
                  This process cannot be undone.
                </div>
              </div>
            )}
          </div>
          {loading ? null : (
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalPreview({
                    isOpen: false,
                    plan: null
                  });
                }}
                className="btn btn-outline-secondary w-24 mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary w-24"
                onClick={() => handlePlanChange()}
              >
                Proceed
              </button>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

export default Main;
