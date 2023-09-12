import {
  Dropdown,
  DropdownContent,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Lucide
} from "@/base-components";
import { darkMode as darkModeStore, darkModeValue } from "@/stores/dark-mode";
import { useDispatch, useSelector } from "react-redux";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { helper as $h } from "@/utils";
import Constants from "../../constants/Constants";
import { Fragment } from "react";
import alternateImage from "../../assets/images/gallery.png";
import classnames from "classnames";
import dom from "@left4code/tw-starter/dist/js/dom";
import { logoutUser } from "../../store/actions";
import { QuantityChange as onQuantityChange } from "../../store/actions";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const darkMode = useRecoilValue(darkModeStore);
  const setDarkModeValue = useSetRecoilState(darkModeValue);

  const setDarkModeClass = () => {
    darkMode ? dom("html").addClass("dark") : dom("html").removeClass("dark");
  };

  const switchMode = () => {
    setDarkModeValue(() => !darkMode);
    localStorage.setItem("darkMode", !darkMode);
    setDarkModeClass();
  };

  setDarkModeClass();

  const { QuantityofEachProduct } = useSelector((state) => ({
    QuantityofEachProduct: state.ProductListReducer?.QuantityofEachProduct
  }));

  const removeElement = (from, product) => {
    dispatch(onQuantityChange({ record: product, action: from }));
  };

  return (
    <Fragment>
      <div className="top-bar">
        <nav aria-label="breadcrumb" className="-intro-x mr-auto hidden sm:flex"></nav>
        <div>
          <button
            id="theme-toggle"
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-5"
            onClick={switchMode}
          >
            {darkMode == true ? (
              <Lucide icon="Moon" className="notification__icon dark:text-slate-500"></Lucide>
            ) : (
              <Lucide icon="Sun" className="notification__icon dark:text-slate-500"></Lucide>
            )}
          </button>
        </div>

        <Dropdown className="intro-x w-8 h-8">
          <DropdownToggle
            tag="div"
            role="button"
            className="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in mt-1"
          >
            <Lucide icon="User" className="content-center w-full" />
          </DropdownToggle>
          <DropdownMenu className="w-56">
            <DropdownContent className="bg-primary text-white">
              <DropdownHeader tag="div" className="!font-normal">
                <div className="font-medium">{$h.getName()}</div>
                <div className="text-xs text-white mt-0.5 dark:text-slate-500">{$h.getEmail()}</div>
              </DropdownHeader>
              <DropdownDivider className="border-white/[0.08]" />
              {/* <DropdownItem
                className="hover:bg-white/5"
                // link={
                //   $h.getRole() == "customer"
                //     ? `/CustomerProfile?id=${$h.getTokenData().id}`
                //     : `/AdminProfile?id=${$h.getTokenData().id}`
                // }
                onClick={() => {
                  navigate(
                    $h.getRoleId() === Constants.USER_ROLE_ID
                      ? `/CustomerProfile?id=${$h.getTokenData().id}`
                      : `/AdminProfile?id=${$h.getTokenData().id}`
                  );
                }}
              >
                <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
              </DropdownItem>*/}

              <DropdownDivider className="border-white/[0.08]" />
              <DropdownItem
                className="hover:bg-white/5"
                onClick={() => {
                  dispatch(logoutUser(navigate));
                }}
              >
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" />
                <div>Logout</div>
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Fragment>
  );
}

export default Main;
