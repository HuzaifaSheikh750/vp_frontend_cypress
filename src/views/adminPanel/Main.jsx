import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getQuantity } from "../../store/actions";
import moment from "moment";

function Main() {
  const [data, setData] = useState({});

  const dispatch = useDispatch();

  const { quantity } = useSelector((state) => state.ManageUsersReducer);

  const getInfo = () => {
    const data = localStorage.getItem("authUser");
    if (data) {
      setData(JSON.parse(data).azure_data);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (quantity === null) {
      dispatch(getQuantity());
    }
  }, [dispatch]);

  return (
    <Fragment>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-4">
        <h2 className="text-lg font-medium mr-auto">ADMIN INFORMATION</h2>
      </div>
      <div className="flex flex-col justify-center mx-40 mt-6">
        <div className="intro-y box col-span-12 2xl:col-span-6">
          <div className="p-5">
            <div className="relative flex items-center">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Microsoft ID
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500 ml-10">
                {data?.azure_unique_id}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Publisher ID
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_publisherId}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Offer ID
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500 ml-8">
                {data?.azure_offerId}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Name
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_name}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  SaaS Subscription Status
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_subscription_status}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Email ID
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_emailId}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Purchaser ID
                </a>
              </div>{" "}
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_objectId}
              </div>
            </div>

            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Plan ID
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_planId}
              </div>
            </div>
            {/*data.azure_term_startDate ? (
              <div className="relative flex items-center mt-5">
                <div className="ml-4 mr-auto">
                  <a href="" className="font-medium">
                    Term Start Date
                  </a>
                </div>
                <div className="font-medium text-slate-600 dark:text-slate-500">
                  {moment(data.azure_term_startDate).utc().format("DD-MMM-YYYY")}
                </div>
              </div>
            ) : null*/}
            {/*data.azure_term_endDate ? (
              <div className="relative flex items-center mt-5">
                <div className="ml-4 mr-auto">
                  <a href="" className="font-medium">
                    Term End Date
                  </a>
                </div>
                <div className="font-medium text-slate-600 dark:text-slate-500">
                  {moment(data.azure_term_endDate).utc().format("DD-MMM-YYYY")}
                </div>
              </div>
            ) : null*/}
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Is Free Trial
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_isFreeTrial ? "Yes" : "No"}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Quantity
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {data?.azure_quantity}
              </div>
            </div>
            <div className="relative flex items-center mt-5">
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  Allowed Customer Operations
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Main;
