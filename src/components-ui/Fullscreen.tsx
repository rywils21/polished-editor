import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { AppData } from "types";
import Fullscreen from "react-full-screen";

interface Props {
  data: AppData;
  children: ReactNode;
}

export const FullscreenWrapper = observer(function FullscreenComponent({
  data,
  children
}: Props) {
  return (
    <Fullscreen
      enabled={data.fullScreen}
      onChange={isFull => {
        data.fullScreen = isFull;
      }}
    >
      {children}
    </Fullscreen>
  );
});
