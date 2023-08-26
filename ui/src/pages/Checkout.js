import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import useAuthentication from "../hooks/useAuthentication";
import { Navigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const {
    authentication: { user },
  } = useAuthentication();

  if (user.subscription.tier === "PRO") return <Navigate to="/" />;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
