import { useEffect } from "react";
import { AppData } from "../types/index";

export const useWindowControls = (data: AppData) => {
  useEffect(() => {
    const handleCopy = (evt: ClipboardEvent): void => {
      evt.preventDefault();
      data.handleCopy(evt);
    };

    const handleCut = (evt: ClipboardEvent): void => {
      evt.preventDefault();
      data.handleCut(evt);
    };

    const handlePaste = (evt: ClipboardEvent): void => {
      evt.preventDefault();
      data.handlePaste(evt);
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
    };
  }, [data]);
};
