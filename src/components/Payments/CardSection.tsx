/** @jsx jsx */
import { jsx } from "theme-ui";
import { CardElement } from "@stripe/react-stripe-js";

const options = {
  style: {
    base: {
      color: "#aab7c4",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      },
      border: "1px solid #fefefe",
      borderRadius: "4px"
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

const CardSection = () => {
  return (
    <div sx={{ marginTop: 2 }}>
      <label sx={{ fontSize: 1 }}>Card details</label>
      <div
        sx={{
          border: "1px solid hsl(0, 0%, 93%)",
          padding: 2,
          borderRadius: "4px"
        }}
      >
        <CardElement options={options} />
      </div>
    </div>
  );
};

export default CardSection;
