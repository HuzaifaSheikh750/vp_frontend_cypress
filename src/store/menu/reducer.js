import Constants from "@/constants/Constants";
import { ROLE_BASED_MENU } from "./actionTypes";

const INIT_STATE = {
  menuItems: [
    {
      icon: "Home",
      pathname: "/admin-panel",
      title: "Admin Panel",
      roleAccess: [Constants.ADMIN_ROLE_ID],
    },
    {
      icon: "DollarSign",
      pathname: "/plans",
      title: "Plans & Pricing",
      roleAccess: [Constants.ADMIN_ROLE_ID],
    },

    {
      icon: "User",
      pathname: "/manage-vendors",
      title: "Manage Vendors",
      roleAccess: [Constants.ADMIN_ROLE_ID],
    },
    {
      icon: "Send",
      title: "Request For Quote",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
      subMenu: [
        {
          icon: "",
          pathname: "/request-for-quotation",
          title: "View RFQ",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },
        {
          icon: "",
          pathname: "/create-request-for-quotation",
          title: "Create RFQ",
          roleAccess: [Constants.ADMIN_ROLE_ID],
        },
      ],
    },
    {
      icon: "Package",
      title: "Quotation",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
      subMenu: [
        {
          icon: "",
          pathname: "/quotation",
          title: "View Quotations",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },

        {
          icon: "",
          pathname: "/createQuotation",
          title: "Create Quotation",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },
      ],
    },
    {
      icon: "Airplay",
      title: "Purchase Order",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
      subMenu: [
        {
          icon: "",
          pathname: "/purchaseOrder",
          title: "View PO",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },
        {
          icon: "",
          pathname: "/createPurchaseOrder",
          title: "Create PO",
          roleAccess: [Constants.ADMIN_ROLE_ID],
        },
      ],
    },
    {
      icon: "UserPlus",
      title: "Contracts",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
      subMenu: [
        {
          icon: "",
          pathname: "/contracts",
          title: "View Contracts",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },
        {
          icon: "",
          pathname: "/create-contract",
          title: "Create Contract",
          roleAccess: [Constants.ADMIN_ROLE_ID],
        },
      ],
    },
    {
      icon: "FileText",
      title: "Invoice",
      pathname: "/invoice",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
    },
    {
      icon: "ShoppingBag",
      pathname: "/products",
      title: "Products",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
    },
    {
      icon: "User",
      pathname: "/profile",
      title: "Profile",
      roleAccess: [Constants.USER_ROLE_ID],
    },
    {
      icon: "Settings",
      title: "Settings",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
      subMenu: [
        {
          icon: "DollarSign",
          pathname: "/currencyCode",
          title: "Currency Code",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },
        {
          icon: "Ruler",
          pathname: "/salesUnit",
          title: "UOM",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },
        {
          icon: "Wallet",
          pathname: "/paymentTerms",
          title: "Payment Terms",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },

        {
          icon: "CreditCard",
          pathname: "/paymentMethods",
          title: "Payment Methods",
          roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
        },
      ],
    },
    {
      icon: "Percent",
      pathname: "/discount",
      title: "Discount",
      roleAccess: [Constants.USER_ROLE_ID],
    },
    {
      icon: "Locate",
      pathname: "/sites",
      title: "Sites",
      roleAccess: [Constants.ADMIN_ROLE_ID],
    },
    {
      icon: "Building2",
      pathname: "/warehouse",
      title: "Warehouse",
      roleAccess: [Constants.ADMIN_ROLE_ID],
    },
    {
      icon: "Phone",
      pathname: "/help",
      title: "Contact",
      roleAccess: [Constants.ADMIN_ROLE_ID],
    },
    {
      icon: "Voicemail",
      pathname: "/contacts",
      title: "Contact List",
      roleAccess: [Constants.ADMIN_ROLE_ID, Constants.USER_ROLE_ID],
    },
  ],
};

const MenuReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ROLE_BASED_MENU:
      const userRole = action.payload;
      const filteredMenuItems = state.menuItems.reduce((result, menuItem) => {
        // If the menuItem itself passes the role check
        if (!menuItem.roleAccess || menuItem.roleAccess.includes(userRole)) {
          // If the menuItem has subMenu, filter the subMenu items based on the role
          if (menuItem.subMenu) {
            const filteredSubMenu = menuItem.subMenu.filter(
              (subMenu) =>
                !subMenu.roleAccess || subMenu.roleAccess.includes(userRole)
            );
            // If only one subMenu item passes the role check
            // Move that item to the parent menu
            if (filteredSubMenu.length === 1) {
              result.push({
                ...menuItem,
                ...filteredSubMenu[0],
                icon: menuItem.icon,
                subMenu: undefined,
              });
            } else {
              result.push({ ...menuItem, subMenu: filteredSubMenu });
            }
          } else {
            result.push(menuItem);
          }
        }
        return result;
      }, []);
      return { ...state, menuItems: filteredMenuItems };

    // case ROLE_BASED_MENU:
    //   const userRole = action.payload;
    //   const filteredMenuItems = state.menuItems.filter((menuItem) => {
    //     return !menuItem.roleAccess || menuItem.roleAccess.includes(userRole);
    //   });

    //   return { ...state, menuItems: filteredMenuItems };

    default:
      return state;
  }
};

export default MenuReducer;
