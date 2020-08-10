/** @jsx jsx */
import { jsx, Styled } from "theme-ui";
import { useForm } from "@statickit/react";

interface Props {
  cancel?: () => void;
}

export const FeedbackForm = ({ cancel }: Props) => {
  const [state, submit] = useForm({
    site: "6a173aae2128",
    form: "feedback-form"
  });

  if (state.succeeded) {
    return (
      <div sx={{ width: "100%", textAlign: "center" }}>
        <Styled.p>Thank you! I'll be in touch soon.</Styled.p>
      </div>
    );
  }

  return (
    <form
      sx={{ display: "flex", flexDirection: "column", width: "100%" }}
      onSubmit={submit}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: 4,
          "*": {
            padding: 2,
            fontSize: 3
          }
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Your email address"
        />
      </div>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: 4,
          "*": {
            padding: 2,
            fontSize: 3
          }
        }}
      >
        <label htmlFor="message">Message</label>
        <textarea
          sx={{ height: 200, resize: "none" }}
          id="message"
          name="message"
          placeholder="Your message here..."
        />
      </div>
      <button sx={{ variant: "buttons.primary" }} type="submit">
        Send Feedback
      </button>
      {cancel !== undefined && (
        <button sx={{ variant: "buttons.primary" }} onClick={cancel}>
          Cancel
        </button>
      )}
    </form>
  );
};
