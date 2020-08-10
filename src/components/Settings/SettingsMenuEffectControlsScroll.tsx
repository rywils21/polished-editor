/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { PinchEffect, WheelEffect } from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

const wheelOptions: ToggleOption<WheelEffect>[] = [
  {
    title: "Scroll Document",
    description:
      "Will scroll when the mouse is over the contents of a document. Otherwise, does nothing.",
    value: WheelEffect.SCROLL_DOCUMENT
  },
  {
    title: "Pan Canvas",
    description:
      "Will pan the canvas regardless of if the mouse if hovering a document.",
    value: WheelEffect.PAN_CANVAS
  },
  {
    title: "Disabled",
    description: "Does nothing.",
    value: WheelEffect.DISABLED
  }
];

const pinchOptions: ToggleOption<PinchEffect>[] = [
  {
    title: "Zoom",
    description: "Zooms in and out on the canvas.",
    value: PinchEffect.ZOOM
  },
  {
    title: "Disabled",
    description: "Does nothing.",
    value: PinchEffect.DISABLED
  }
];

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

export const SettingsMenuEffectControlsScroll = observer(
  function SettingsMenuEffectControlsScroll({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div
            sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3, fontWeight: 700 }}
          >
            Scroll Wheel (Scroll Gesture)
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            Activated by scrolling the wheel on a mouse or the scroll gesture on
            a trackpad.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={wheelOptions}
              current={data.activeProfile.activeMode.editorEffects.controls}
              valueKey="Wheel"
            />
          </div>
          <div
            sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3, fontWeight: 700 }}
          >
            CmdOrCtrl + Scroll Wheel (Pinch Gesture)
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            Activated by holding CmdOrCtrl while scrolling the wheel on a mouse
            or by a pinch gesture on a trackpad.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={pinchOptions}
              current={data.activeProfile.activeMode.editorEffects.controls}
              valueKey="CmdOrCtrlWheel"
            />
          </div>
        </div>
      </SettingsMenuPage>
    );
  }
);
