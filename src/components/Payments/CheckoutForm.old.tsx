/** @jsx jsx */
import { jsx } from "theme-ui";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import CardSection from "./CardSection";
import { FormEvent, useState } from "react";
import { AppData } from "types";
import { Loader } from "../../components-ui/Loader";

interface Props {
  data: AppData;
}

/*
This is the old implementation of checkout form that was built for the subscription

I will need to leverage this in the future to implement subscriptions
*/

export default function CheckoutFormOld({ data }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(data.userData.email || "");

  const [formState, setFormState] = useState<"input" | "submitting">("input");

  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  const handleSubmit = async (event: FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    setFormState("submitting");

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (cardElement) {
      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: name === "" ? undefined : name,
          email: email === "" ? undefined : email,
        },
      });

      if (result.error) {
        // TODO: Show error in payment form
        console.log("form error: ", result.error);

        setErrorMessage(result.error.message);

        setFormState("input");
      } else if (result.paymentMethod) {
        // Otherwise send paymentMethod.id to your server
        const res = await fetch(
          `${process.env.REACT_APP_FUNCTION_HOST}/payments/subscribe`,
          {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.uid,
              name,
              email,
              payment_method: result.paymentMethod.id,
              planId: process.env.REACT_APP_PRO_PLAN_ID,
            }),
          }
        );

        // The customer has been created
        const { subscription } = await res.json();
        console.log("server response: ", subscription);

        const { latest_invoice } = subscription;
        const { payment_intent } = latest_invoice;

        if (payment_intent) {
          const { client_secret, status } = payment_intent;

          if (status === "requires_action") {
            stripe.confirmCardPayment(client_secret).then(function (result) {
              if (result.error) {
                // Display error message in your UI.
                // The card was declined (i.e. insufficient funds, card has expired, etc)
                setErrorMessage(result.error.message);
                setFormState("input");
              } else {
                // Show a success message to your customer
                console.log("success case - proceed to pro writing tools");
                data.userData.activePlans = [
                  ...data.userData.activePlans,
                  subscription.plan.id,
                ];
                data.userData.activeProducts = [
                  ...data.userData.activeProducts,
                  subscription.plan.product,
                ];
                setFormState("input");
              }
            });
          } else {
            // No additional information was needed
            // Show a success message to your customer
            console.log("success case - proceed to pro writing tools");
            data.userData.activePlans = [
              ...data.userData.activePlans,
              subscription.plan.id,
            ];
            data.userData.activeProducts = [
              ...data.userData.activeProducts,
              subscription.plan.product,
            ];
            setFormState("input");
          }
        }
      }
    } else {
      // TODO: handle an error here?
      // What to do if cardElement doesn't exist
      setFormState("input");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      sx={{
        padding: 3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "hsl(0, 0%, 18%)",
        minWidth: "400px",
        maxWidth: "400px",
        height: "100%",
      }}
    >
      <div sx={{ fontSize: 4 }}>Enter your information</div>
      <div sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
        <label htmlFor="name" sx={{ fontSize: 1 }}>
          Full Name
        </label>
        <input
          sx={{ padding: 2, fontSize: 3, borderRadius: "4px", border: "none" }}
          name="name"
          value={name}
          placeholder="Name on Card"
          onChange={(evt) => setName(evt.target.value)}
        />
      </div>
      <div sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
        <label htmlFor="email" sx={{ fontSize: 1 }}>
          Email
        </label>
        <input
          sx={{ padding: 2, fontSize: 3, borderRadius: "4px", border: "none" }}
          name="email"
          value={email}
          placeholder="Your Email"
          onChange={(evt) => setEmail(evt.target.value)}
        />
      </div>
      <CardSection />
      <div sx={{ fontSize: 2, color: "red" }}>{errorMessage}</div>
      <div sx={{ marginTop: 3 }}>
        <button
          type="submit"
          disabled={!stripe}
          sx={{ variant: "buttons.primary2" }}
        >
          {formState === "submitting" ? <Loader /> : "Subscribe"}
        </button>
      </div>
    </form>
  );
}
