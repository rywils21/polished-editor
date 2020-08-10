/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import {
  DocumentEffectVisibility,
  DocumentHeight,
  DocumentVisibility,
  FadeTextValue,
  DocumentAutoSave
} from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";
import { GrammarEffectStatus } from "../../types/editorEffects";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const visibilityOptions: ToggleOption<DocumentVisibility>[] = [
  {
    title: "Visible",
    description: "All documents are always visible.",
    value: DocumentVisibility.VISIBLE
  },
  {
    title: "When Active",
    description:
      "When a document has an active cursor, only that document is visible. When no document has a cursor, all documents are shown.",
    value: DocumentVisibility.WHEN_ACTIVE
  },
  {
    title: "Hidden",
    description: "All documents are hidden.",
    value: DocumentVisibility.HIDDEN
  }
];

const heightOptions: ToggleOption<DocumentHeight>[] = [
  {
    title: "Fit Content",
    description: "Document height increases based on it's content.",
    value: DocumentHeight.FIT_CONTENT
  },
  {
    title: "Doubled Height",
    description:
      "Document height is doubled so it fills the screen when you're focused on the content.",
    value: DocumentHeight.FULLSCREEN
  }
  // {
  //   title: "Custom",
  //   description:
  //     "Document height is set to a custom value and the content becomes scrollable within that.",
  //   value: DocumentHeight.CUSTOM
  // }
];

const textFadeOptions: ToggleOption<FadeTextValue>[] = [
  {
    title: "Never",
    description: "Text is never faded.",
    value: FadeTextValue.NEVER
  },
  {
    title: "Unselected Paragraphs",
    description: "Paragraphs that do not have the cursor will fade.",
    value: FadeTextValue.UNSELECTED_PARAGRAPH
  }
];

const menuVisibilityOptions: ToggleOption<DocumentEffectVisibility>[] = [
  {
    title: "Visible",
    description: "Document menu is visible.",
    value: DocumentEffectVisibility.VISIBLE
  },
  {
    title: "Hidden",
    description: "Document menu is hidden.",
    value: DocumentEffectVisibility.HIDDEN
  }
];

const autoSaveOptions: ToggleOption<DocumentAutoSave>[] = [
  {
    title: "Enabled",
    description: "Documents will automatically save changes.",
    value: DocumentAutoSave.ENABLED
  },
  {
    title: "Disabled",
    description:
      "Documents will not be saved automatically. You must manually save changes as you go.",
    value: DocumentAutoSave.DISABLED
  }
];

const grammarOptions: ToggleOption<GrammarEffectStatus>[] = [
  {
    title: "Enabled",
    description: "Grammar highlighting is active.",
    value: GrammarEffectStatus.ENABLED
  },
  {
    title: "Disabled",
    description: "Grammar highlighting is not active.",
    value: GrammarEffectStatus.DISABLED
  }
];

export const SettingsMenuEffectDocument = observer(
  function SettingsMenuEffectDocument({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3 }}>Document</div>
          <div>
            <div
              sx={{
                paddingLeft: 3,
                fontSize: 4,
                marginTop: 3,
                fontWeight: 700
              }}
            >
              Visibility
            </div>
            <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
              Control whether or not documents are visible in the workspace.
            </div>
            <div sx={{ margin: 2 }}>
              <OptionToggle
                options2={visibilityOptions}
                current={data.activeProfile.activeMode.editorEffects.document}
                valueKey="visibility"
              />
            </div>
            <div
              sx={{
                paddingLeft: 3,
                fontSize: 4,
                marginTop: 5,
                fontWeight: 700
              }}
            >
              Height
            </div>
            <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
              How a document's height is determined.
            </div>
            <div sx={{ margin: 2 }}>
              <OptionToggle
                options2={heightOptions}
                current={
                  data.activeProfile.activeMode.editorEffects.document.height
                }
                valueKey="value"
              />
            </div>
            <div
              sx={{
                paddingLeft: 3,
                fontSize: 4,
                marginTop: 5,
                fontWeight: 700
              }}
            >
              Text Fade
            </div>
            <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
              Control if text fades.
            </div>
            <div sx={{ margin: 2 }}>
              <OptionToggle
                options2={textFadeOptions}
                current={
                  data.activeProfile.activeMode.editorEffects.document.text.fade
                }
                valueKey="value"
              />
            </div>
            <div
              sx={{
                paddingLeft: 3,
                fontSize: 4,
                marginTop: 5,
                fontWeight: 700
              }}
            >
              Menu Visibility
            </div>
            <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
              Controls if the document menu is visible.
            </div>
            <div sx={{ margin: 2 }}>
              <OptionToggle
                options2={menuVisibilityOptions}
                current={
                  data.activeProfile.activeMode.editorEffects.document.menu
                }
                valueKey="visibility"
              />
            </div>
            <div
              sx={{
                paddingLeft: 3,
                fontSize: 4,
                marginTop: 5,
                fontWeight: 700
              }}
            >
              Auto Save
            </div>
            <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
              Controls whether document changes are saved automatically.
            </div>
            <div sx={{ margin: 2 }}>
              <OptionToggle
                options2={autoSaveOptions}
                current={data.activeProfile.activeMode.editorEffects.document}
                valueKey="autoSave"
              />
            </div>

            <div
              sx={{
                paddingLeft: 3,
                fontSize: 4,
                marginTop: 5,
                fontWeight: 700
              }}
            >
              Grammar
            </div>
            <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
              Controls whether grammar highlighting is shown.
            </div>
            <div sx={{ margin: 2, marginBottom: "500px" }}>
              <OptionToggle
                options2={grammarOptions}
                current={
                  data.activeProfile.activeMode.editorEffects.document.grammar
                }
                valueKey="status"
              />
            </div>
          </div>
        </div>
      </SettingsMenuPage>
    );
  }
);
