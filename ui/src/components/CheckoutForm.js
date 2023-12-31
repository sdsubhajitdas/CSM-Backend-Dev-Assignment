import { useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuthentication from "../hooks/useAuthentication";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const axios = useAxiosPrivate();
  const {
    authentication: { user },
    setAuthentication,
  } = useAuthentication();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [cardErrors, setCardErrors] = useState({
    cardNumber: "Required field",
    cardExpiry: "Required field",
    cardCvc: "Required field",
  });

  async function handleOnSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    await elements.submit();
    const formError = Object.entries(cardErrors).find((err) => !!err[1]);
    if (formError) return;

    try {
      setPaymentStatus("Initiating payment. Please do not refresh");
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement("cardNumber"),
      });

      setPaymentStatus("Processing payment...");
      const {
        data: { clientSecret, customer, subscription },
      } = await axios.post("/api/payment/subscribe", {
        paymentMethod: paymentMethod.id,
      });

      setPaymentStatus("Verifying payment status...");
      let response = await stripe.confirmCardPayment(clientSecret);

      if (response.error) {
        setPaymentStatus(`Error occurred: ${response.error.message}`);
        await axios.post("/api/payment/fail", {
          customer,
          subscription,
        });
      } else {
        setPaymentStatus("Almost there...");
        response = await axios.post("/api/payment/success", {
          customer,
          subscription,
        });

        setPaymentStatus("🎉 Congratulations you are now a Pro member");

        setAuthentication((previous) => ({
          ...previous,
          user: { ...previous.user, ...response.data.user },
        }));
      }
    } catch (error) {
      setPaymentStatus(
        `Error occurred: ${
          error?.response?.data?.message
            ? error.response.data.message
            : error.message
        }`
      );
    }
  }

  return (
    <>
      <h2 className="text-3xl text-center ">
        Get your monthly pro subscription now
      </h2>
      <form
        className="flex flex-col max-w-2xl gap-3 p-3 mx-auto border border-black rounded"
        onSubmit={handleOnSubmit}
      >
        <div className="flex gap-3">
          <div className="grow">
            <label htmlFor="email" className="block text-sm text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              className="w-full p-2 border border-black rounded disabled:bg-gray-200"
              value={user.email}
              disabled
            />
          </div>
          <div className="grow">
            <label htmlFor="fullName" className="block text-sm text-gray-700">
              Name
            </label>
            <input
              id="fullName"
              name="fullName"
              className="w-full p-2 border border-black rounded disabled:bg-gray-200"
              value={user.fullName}
              disabled
            />
          </div>
        </div>
        <CardDetailsBlock
          title="Card number"
          id="cardNumber"
          errors={cardErrors}
        >
          <CardNumberElement
            className="w-full p-3 border border-black rounded disabled:bg-gray-200"
            onChange={(e) =>
              setCardErrors((previous) => ({
                ...previous,
                cardNumber: e.complete
                  ? null
                  : e.error
                  ? e.error.message
                  : "Your card number is incomplete.",
              }))
            }
          />
        </CardDetailsBlock>
        <div className="flex gap-3">
          <CardDetailsBlock
            title="Expiration"
            className="grow"
            id="cardExpiry"
            errors={cardErrors}
          >
            <CardExpiryElement
              className="w-full p-3 border border-black rounded disabled:bg-gray-200"
              onChange={(e) =>
                setCardErrors((previous) => ({
                  ...previous,
                  cardExpiry: e.complete
                    ? null
                    : e.error
                    ? e.error.message
                    : "Your card's expiry date is incomplete.",
                }))
              }
            />
          </CardDetailsBlock>
          <CardDetailsBlock
            title="CVC"
            className="grow"
            id="cardCvc"
            errors={cardErrors}
          >
            <CardCvcElement
              className="w-full p-3 border border-black rounded disabled:bg-gray-200"
              onChange={(e) =>
                setCardErrors((previous) => ({
                  ...previous,
                  cardCvc: e.complete
                    ? null
                    : e.error
                    ? e.error.message
                    : "Your card's security code is incomplete.",
                }))
              }
            />
          </CardDetailsBlock>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-3 py-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-700 disabled:bg-gray-500"
            disabled={paymentStatus ? true : false}
          >
            Proceed to pay $5.00
          </button>
          <Link to="/">
            <button
              className="px-3 py-2 text-lg text-white bg-red-500 rounded hover:bg-red-700 disabled:bg-gray-500"
              disabled={paymentStatus ? true : false}
            >
              Cancel
            </button>
          </Link>
        </div>
        {paymentStatus && (
          <h3 className="mt-5 ml-3 text-xl">{paymentStatus}</h3>
        )}
      </form>
    </>
  );
}

function CardDetailsBlock({ title, className, children, id, errors }) {
  return (
    <div className={className}>
      <label className="block text-sm text-gray-700">{title}</label>
      {children}
      <span className="text-sm text-red-500">{errors[`${id}`]}</span>
    </div>
  );
}
