import { Link, useLocation, useNavigate } from "react-router-dom";
import { enter, leave, linkTo, toggleMobileMenu } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { helper as $h } from "@/utils";
import { Lucide } from "@/base-components";
import SimpleBar from "simplebar";
import { Transition } from "react-transition-group";
import classnames from "classnames";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/k.png";
import { nestedMenu } from "@/layouts/side-menu";
import { roleBasedMenu as onRoleBasedMenu } from "@/store/menu/actions";

function Main(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formattedMenu, setFormattedMenu] = useState([]);
  const { menuItems } = useSelector((state) => state.MenuReducer);

  const [activeMobileMenu, setActiveMobileMenu] = useState(false);

  useEffect(() => {
    dispatch(onRoleBasedMenu($h.getRoleId()));
  }, [dispatch]);

  useEffect(() => {
    if (dom(".mobile-menu .scrollable").length) {
      new SimpleBar(dom(".mobile-menu .scrollable")[0]);
    }
    setFormattedMenu(nestedMenu($h.toRaw(menuItems), location));
  }, [menuItems, location.pathname]);

  return (
    <>
      {/* BEGIN: Mobile Menu */}
      <div
        className={classnames({
          "mobile-menu md:hidden": true,
          "mobile-menu--active": activeMobileMenu
        })}
      >
        <div className="mobile-menu-bar">
          <Link to="" className="flex mr-auto">
            <img alt="Vendor Portal - KAISPE" className="w-6" src={logoUrl} />
          </Link>
          <Link to="#" onClick={(e) => e.preventDefault()} className="mobile-menu-toggler">
            <Lucide
              icon="BarChart2"
              className="w-8 h-8 text-white transform -rotate-90"
              onClick={() => {
                toggleMobileMenu(activeMobileMenu, setActiveMobileMenu);
              }}
            />
          </Link>
        </div>
        <div className="scrollable">
          <Link to="#" onClick={(e) => e.preventDefault()} className="mobile-menu-toggler">
            <Lucide
              icon="XCircle"
              className="w-8 h-8 text-white transform -rotate-90"
              onClick={() => {
                toggleMobileMenu(activeMobileMenu, setActiveMobileMenu);
              }}
            />
          </Link>
          <ul className="scrollable__content py-2">
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == "devider" ? (
                <li className="menu__devider my-6" key={menu + menuKey}></li>
              ) : (
                <li key={menu + menuKey}>
                  <Link
                    to={menu.subMenu ? "#" : menu.pathname}
                    className={classnames({
                      menu: true,
                      "menu--active": menu.active,
                      "menu--open": menu.activeDropdown
                    })}
                    onClick={(event) => {
                      event.preventDefault();
                      linkTo(menu, navigate, setActiveMobileMenu);
                      setFormattedMenu($h.toRaw(formattedMenu));
                    }}
                  >
                    <div className="menu__icon">
                      <Lucide icon={menu.icon} />
                    </div>
                    <div className="menu__title">
                      {menu.title}
                      {menu.subMenu && (
                        <div
                          className={classnames({
                            "menu__sub-icon": true,
                            "transform rotate-180": menu.activeDropdown
                          })}
                        >
                          <Lucide icon="ChevronDown" />
                        </div>
                      )}
                    </div>
                  </Link>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={classnames({
                          "menu__sub-open": menu.activeDropdown
                        })}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <Link
                              to={subMenu.subMenu ? "#" : subMenu.pathname}
                              className={classnames({
                                menu: true,
                                "menu--active": subMenu.active
                              })}
                              onClick={(event) => {
                                event.preventDefault();
                                linkTo(subMenu, navigate, setActiveMobileMenu);
                                setFormattedMenu($h.toRaw(formattedMenu));
                              }}
                            >
                              <div className="menu__icon">
                                <Lucide icon="Activity" />
                              </div>
                              <div className="menu__title">
                                {subMenu.title}
                                {subMenu.subMenu && (
                                  <div
                                    className={classnames({
                                      "menu__sub-icon": true,
                                      "transform rotate-180": subMenu.activeDropdown
                                    })}
                                  >
                                    <Lucide icon="ChevronDown" />
                                  </div>
                                )}
                              </div>
                            </Link>
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={classnames({
                                    "menu__sub-open": subMenu.activeDropdown
                                  })}
                                >
                                  {subMenu.subMenu.map((lastSubMenu, lastSubMenuKey) => (
                                    <li key={lastSubMenuKey}>
                                      <Link
                                        to={lastSubMenu.subMenu ? "#" : lastSubMenu.pathname}
                                        className={classnames({
                                          menu: true,
                                          "menu--active": lastSubMenu.active
                                        })}
                                        onClick={(event) => {
                                          event.preventDefault();
                                          linkTo(lastSubMenu, navigate, setActiveMobileMenu);
                                        }}
                                      >
                                        <div className="menu__icon">
                                          <Lucide icon="Zap" />
                                        </div>
                                        <div className="menu__title">{lastSubMenu.title}</div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </div>
      </div>
      {/* END: Mobile Menu */}
    </>
  );
}

export default Main;
