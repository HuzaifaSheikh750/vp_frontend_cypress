import { ROLE_BASED_MENU } from "./actionTypes";

export function roleBasedMenu(payload) {
  return {
    type: ROLE_BASED_MENU,
    payload
  };
}
