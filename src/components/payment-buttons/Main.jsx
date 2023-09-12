import { Lucide } from "@/base-components";
import axios from "axios";

const StripePayButton = ({ cartItems }) => {
  // const user = useSelector((state) => state.auth)

  //apply base url for axios
  const API_URL = import.meta.env.VITE_BASE_URL;
  const currentPath = document.location.pathname.split("/")[1];

  const token = JSON.parse(localStorage.getItem("authUser")) || "";

  const openNewTab = (url) => {
    window.open(url, "_blank");
  };

  // axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token.accessToken}`;

  const handleCheckout = () => {
    axios
      .post(
        API_URL + currentPath + "/paymentGateway/stripe/create-checkout-session",
        {
          cartItems
          // userId: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        }
      )
      .then((res) => {
        if (res.data.url) {
          openNewTab(res.data.url);

          // window.location.href = res.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  // create request call with headers
  // const request = axios.create({
  //   baseURL: API_URL,
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${user.token}`
  //   }
  // });

  return (
    <>
      <button
        onClick={() => handleCheckout()}
        className="btn btn-primary shadow-md mr-16 float-right mb-6"
      >
        <Lucide icon="CreditCard" className="w-4 h-4 mr-2 " /> Pay via Stripe
      </button>
    </>
  );
};

export { StripePayButton };
