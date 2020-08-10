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

export default function CheckoutForm({ data }: Props) {
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

    const product = "pro-desktop";

    const res = await fetch(
      `${process.env.REACT_APP_FUNCTION_HOST}/payments/purchase-intent/pro-desktop`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.uid,
          name,
          email,
        }),
      }
    );
    const { client_secret } = await res.json();

    const cardElement = elements.getElement(CardElement);
    if (cardElement && client_secret) {
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name === "" ? undefined : name,
            email: email === "" ? undefined : email,
          },
        },
      });

      if (result.error) {
        // TODO: Show error in payment form
        console.log("form error: ", result.error);

        setErrorMessage(result.error.message);

        setFormState("input");
      } else if (result.paymentIntent) {
        const { status } = result.paymentIntent;
        if (status === "succeeded") {
          // No additional information was needed
          // Show a success message to your customer
          console.log("success case - proceed to pro writing tools");

          // Update the runtime app data to reflect the purchase
          data.userData.activeProducts = [
            ...data.userData.activeProducts,
            product,
          ];
          // This will be propagated to db via a webhook
          setFormState("input");
        } else if (status === "requires_action") {
        }
      }
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
          {formState === "submitting" ? <Loader /> : "Upgrade Now"}
        </button>
      </div>
    </form>
  );
}
