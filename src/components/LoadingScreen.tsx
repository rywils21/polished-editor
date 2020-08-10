/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState, useCallback } from "react";
import { useInterval } from "hooks/useInterval";

export function LoadingScreen() {
  const [message, setMessage] = useState("....");

  const toggleMessage = useCallback(() => {
    setMessage((message) => {
      if (message === "") {
        return ".";
      } else if (message === ".") {
        return "..";
      } else if (message === "..") {
        return "...";
      } else {
        return "";
      }
    });
  }, []);

  useInterval(toggleMessage, 500);

  return (
    <div
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <h1 sx={{ textAlign: "left", width: "325px", marginLeft: "-5px" }}>
          Loading Polished{message}
        </h1>
      </div>
    </div>
  );
}
