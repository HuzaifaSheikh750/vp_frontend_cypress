import * as Yup from "yup";

import { Form, FormFeedback, Input, Label, Row } from "reactstrap";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { loginUser as PostLogin, loginWithAzure as PostLoginWithAzure } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import { LoadingIcon } from "@/base-components";
import dom from "@left4code/tw-starter/dist/js/dom";
import illustrationUrl from "@/assets/images/illustration.svg";
import logoUrl from "@/assets/images/k.png";
import { useFormik } from "formik";

const Login = (props) => {
  const history = useNavigate();

  useEffect(() => {
    dom("body").removeClass("main").removeClass("error-page").addClass("login");
  }, []);

  const dispatch = useDispatch();

  function handleAzureLokgin() {
    dispatch(PostLoginWithAzure(history));
  }

  const { loading } = useSelector((state) => state.LoginReducer);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: ""
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Please Enter Valid Email").required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password")
    }),

    onSubmit: (values) => {
      dispatch(PostLogin(values, history));
    }
  });

  return (
    <>
      <Form
        className="form-horizontal"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <div>
          <DarkModeSwitcher />
          <div className="container sm:px-10">
            <div className="block xl:grid grid-cols-2 gap-4">
              <div className="hidden xl:flex flex-col min-h-screen">
                <Link to="#" className="-intro-x flex items-center pt-5">
                  <img alt="Vendor Portal - KAISPE" className="w-6" src={logoUrl} />
                  <span className="text-white text-lg ml-3"> KAISPE </span>
                </Link>
                <div className="my-auto">
                  <img
                    alt="Vendor Portal - KAISPE"
                    className="-intro-x w-1/2 -mt-16"
                    src={illustrationUrl}
                  />
                  <div className="-intro-x text-white font-medium text-2xl leading-tight mt-10">
                    Seamless access. Secure login.
                    <br />
                    Your personalized solutions await in our <br /> Vendor Portal.
                  </div>
                </div>
              </div>
              <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                  <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left" data-cy="counter">
                    Sign In
                  </h2>
                  <div className="intro-x mt-2 text-slate-400 xl:hidden text-center">
                    Seamless access. Secure login. Your personalized solutions await in our Vendor
                    Portal.
                  </div>

                  <div className="intro-x mt-8">
                    <Input
                      name="email"
                      data-cy="email-input" 
                      className="intro-x login__input form-control py-3 px-4 block"
                      placeholder="Enter email"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ""}
                      invalid={validation.touched.email && validation.errors.email ? true : false}
                    />
                    {validation.touched.email && validation.errors.email ? (
                      <FormFeedback className="text-danger mt-2" type="invalid" data-cy="email-error" >
                        {validation.errors.email}
                      </FormFeedback>
                    ) : null}
                    <Input
                      name="password"
                      data-cy="password-input" 
                      className="intro-x login__input form-control py-3 px-4 block mt-4"
                      value={validation.values.password || ""}
                      type="password"
                      placeholder="Enter Password"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.password && validation.errors.password ? true : false
                      }
                    />
                    {validation.touched.password && validation.errors.password ? (
                      <FormFeedback className="text-danger mt-2" type="invalid"   data-cy="password-error" >
                        {validation.errors.password}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                    <button
                      className="btn btn-primary py-3 px-4 w-full xl:w-25 xl:mr-3 align-top"
                      type="submit"
                      disabled={loading}
                      data-cy="login-button"
                    >
                      {loading ? (
                        <div className="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center mr-2">
                          <LoadingIcon icon="oval" className="w-4 h-4" color="white" />
                        </div>
                      ) : null}
                      Sign In
                    </button>

                    <h2 className="intro-x font-bold text-center xl:text-center">
                      <p className="mt-5">Or sign in with </p>
                    </h2>

                    <button
                      type="button"
                      className="btn btn-primary py-3 px-4 mr-3 w-full xl:w-25 align-top mt-6"
                      onClick={handleAzureLokgin}
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="28"
                        height="28"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="#ff5722"
                          d="M6 6H22V22H6z"
                          transform="rotate(-180 14 14)"
                        ></path>
                        <path
                          fill="#4caf50"
                          d="M26 6H42V22H26z"
                          transform="rotate(-180 34 14)"
                        ></path>
                        <path
                          fill="#ffc107"
                          d="M26 26H42V42H26z"
                          transform="rotate(-180 34 34)"
                        ></path>
                        <path
                          fill="#03a9f4"
                          d="M6 26H22V42H6z"
                          transform="rotate(-180 14 34)"
                        ></path>
                      </svg>
                      <span className="ml-2">Sign In with Azure AD</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Login;
