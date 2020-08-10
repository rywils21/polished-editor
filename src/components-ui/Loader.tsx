/** @jsx jsx */
import { jsx } from "theme-ui";
import { keyframes } from "@emotion/core";
import { Keyframes } from "@emotion/serialize";

const spin: Keyframes = keyframes`
  0% {transform: rotate(0deg)}
  50% {transform: rotate(180deg)}
  100% {transform: rotate(360deg)}
`;

export function Loader() {
  return (
    <div
      sx={{
        width: "20px",
        height: "20px",
        border: "2px solid white",
        borderBottomColor: "transparent",
        borderRadius: "50%",
        margin: "0 auto",
        animationName: spin.toString(),
        animationTimingFunction: "linear",
        animationDuration: "500ms",
        animationIterationCount: "infinite"
      }}
    ></div>
  );
}
