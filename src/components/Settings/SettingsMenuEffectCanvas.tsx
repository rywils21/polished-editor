/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { Autoscroll, CursorVisibility } from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const autoscrollOptions: ToggleOption<Autoscroll>[] = [
  {
    title: "None",
    description: "Canvas does not automatically scroll.",
    value: Autoscroll.NONE
  },
  {
    title: "Typewriter",
    description:
      "As you type, the canvas scrolls to keep you cursor in the center of the page.",
    value: Autoscroll.TYPEWRITER
  }
];

const cursorOptions: ToggleOption<CursorVisibility>[] = [
  {
    title: "Visible",
    description: "The cursor is always visible.",
    value: CursorVisibility.VISIBLE
  },
  {
    title: "Hidden While Typing",
    description: "The cursor disappears while you're typing.",
    value: CursorVisibility.HIDDEN_WHILE_TYPING
  }
];

export const SettingsMenuEffectCanvas = observer(
  function SettingsMenuEffectCanvas({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3 }}>Canvas</div>

          <div
            sx={{
              paddingLeft: 3,
              fontSize: 4,
              marginTop: 3,
              fontWeight: 700
            }}
          >
            Autoscroll
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            Controls if the canvas automatically scrolls as you type.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={autoscrollOptions}
              current={
                data.activeProfile.activeMode.editorEffects.canvas.autoscroll
              }
              valueKey="value"
            />
          </div>
          <div
            sx={{
              paddingLeft: 3,
              fontSize: 4,
              marginTop: 3,
              fontWeight: 700
            }}
          >
            Cursor
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            Controls the cursor visibility.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={cursorOptions}
              current={
                data.activeProfile.activeMode.editorEffects.canvas.cursor
              }
              valueKey="visibility"
            />
          </div>
        </div>
      </SettingsMenuPage>
    );
  }
);
