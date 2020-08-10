import React from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";
import { AppData } from "types";

// @ts-ignore
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

interface Props {
  data: AppData;
}

export const Checkout = ({ data }: Props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm data={data} />
    </Elements>
  );
};
