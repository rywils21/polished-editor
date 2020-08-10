/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { AppData, ModeMenuState, MenuItemKey } from "types";
import { Icons, Icon } from "components-ui/Icon";
import { MenuIcons } from "components-ui/MenuIcon";
import { getDefaultHomeEffects } from "actions/creatorAppData";
import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useTransition, animated } from "react-spring";
import { SettingsMenuHome } from "./SettingsMenuHome";
import { SettingsMenuModeName } from "./SettingsMenuModeName";
import { SettingsMenuModeIcon } from "./SettingsMenuModeIcon";
import { SettingsMenuModeMenuItems } from "./SettingsMenuModeMenuItems";
import { SettingsMenuModeMenuInitialState } from "./SettingsMenuModeMenuInitialState";
import { SettingsMenuEffectMenu } from "./SettingsMenuEffectMenu";
import { SettingsMenuEffectControls } from "./SettingsMenuEffectControls";
import { SettingsMenuEffectControlsEnter } from "./SettingsMenuEffectControlsEnter";
import { SettingsMenuEffectControlsScroll } from "./SettingsMenuEffectControlsScroll";
import { SettingsMenuEffectControlsDrag } from "./SettingsMenuEffectControlsDrag";
import { SettingsMenuEffectBrowser } from "./SettingsMenuEffectBrowser";
import { SettingsMenuEffectDocument } from "./SettingsMenuEffectDocument";
import { SettingsMenuEffectApp } from "./SettingsMenuEffectApp";
import { SettingsMenuEffectCanvas } from "./SettingsMenuEffectCanvas";

export enum MenuRoute {
  HOME = "Configure",
  MODE_NAME = "Mode Name",
  MODE_ICON = "Mode Icon",
  MODE_MENU_INITIAL_STATE = "Menu Initial State",
  MODE_MENU_ITEMS = "Menu Items",
  CREATE_NEW_MODE = "Create new mode",
  MODE_EFFECTS_MENU = "Menu Effects",
  MODE_EFFECTS_CONTROL = "Control Effects",
  MODE_EFFECTS_CONTROL_ENTER = "Effect: Enter Key",
  MODE_EFFECTS_CONTROL_SCROLL = "Effect: Scroll Wheel",
  MODE_EFFECTS_CONTROL_DRAG = "Effect: Click + Drag",
  MODE_EFFECTS_BROWSER = "Browser Effects",
  MODE_EFFECTS_DOCUMENT = "Document Effects",
  MODE_EFFECTS_CANVAS = "Canvas Effects",
  MODE_EFFECTS_APP = "App Effects"
}

interface Props {
  open: boolean;
  data: AppData;
  close: () => void;
}

export const ConfigureWritingMode = observer(function ConfigureWritingMode({
  open,
  data,
  close
}: Props) {
  const [routes, setRoutes] = useState<MenuRoute[]>([MenuRoute.HOME]);

  const routeTransitions = useTransition(routes, item => item, {
    from: { marginRight: "-100%" },
    enter: { marginRight: "0%" },
    leave: { marginRight: "-100%" }
  });

  return (
    <div
      sx={{
        width: "420px",
        display: "flex",
        flexDirection: "column",
        background: "white",
        boxShadow: "menuItem",
        boxSizing: "border-box",
        height: "100%"
      }}
    >
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "gray3",
          color: "gray6",
          fontWeight: 400
        }}
      >
        <div sx={{ padding: 2 }}>Configure Writing Mode</div>

        <button
          onClick={close}
          sx={{
            background: "none",
            padding: 2,
            border: "none",
            borderRadius: "50%",
            ":hover": {
              backgroundColor: "hsl(0, 0%, 50%)"
            }
          }}
        >
          <Icon icon={Icons.CROSS} sx={{ fill: "gray6" }} />
        </button>
      </div>

      <div
        sx={{
          flex: 1,
          overflowY: "scroll",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        {routeTransitions.map(({ item, props, key }, i: number) => (
          <animated.div
            key={key}
            style={props}
            sx={{
              flex: 1,
              width: "100%",
              minWidth: "100%",
              maxWidth: "100%",
              height: "100%"
            }}
          >
            <MenuPageRenderer route={item} data={data} setRoutes={setRoutes} />
          </animated.div>
        ))}
      </div>
    </div>
  );
});

interface MenuPageRendererProps {
  route: MenuRoute;
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

export const MenuPageRenderer = observer(function MenuPageRenderer({
  route,
  data,
  setRoutes
}: MenuPageRendererProps) {
  let element = null;

  if (route === MenuRoute.HOME) {
    element = <SettingsMenuHome data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.CREATE_NEW_MODE) {
    element = (
      <CreateNewMode
        data={data}
        cancel={() => {
          setRoutes([MenuRoute.HOME]);
        }}
        finish={() => {
          setRoutes([MenuRoute.HOME]);
        }}
      />
    );
  } else if (route === MenuRoute.MODE_NAME) {
    element = <SettingsMenuModeName data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_ICON) {
    element = <SettingsMenuModeIcon data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_MENU_INITIAL_STATE) {
    element = (
      <SettingsMenuModeMenuInitialState data={data} setRoutes={setRoutes} />
    );
  } else if (route === MenuRoute.MODE_MENU_ITEMS) {
    element = <SettingsMenuModeMenuItems data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_EFFECTS_MENU) {
    element = <SettingsMenuEffectMenu data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_EFFECTS_CONTROL) {
    element = <SettingsMenuEffectControls data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_EFFECTS_CONTROL_ENTER) {
    element = (
      <SettingsMenuEffectControlsEnter data={data} setRoutes={setRoutes} />
    );
  } else if (route === MenuRoute.MODE_EFFECTS_CONTROL_SCROLL) {
    element = (
      <SettingsMenuEffectControlsScroll data={data} setRoutes={setRoutes} />
    );
  } else if (route === MenuRoute.MODE_EFFECTS_CONTROL_DRAG) {
    element = (
      <SettingsMenuEffectControlsDrag data={data} setRoutes={setRoutes} />
    );
  } else if (route === MenuRoute.MODE_EFFECTS_BROWSER) {
    element = <SettingsMenuEffectBrowser data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_EFFECTS_DOCUMENT) {
    element = <SettingsMenuEffectDocument data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_EFFECTS_CANVAS) {
    element = <SettingsMenuEffectCanvas data={data} setRoutes={setRoutes} />;
  } else if (route === MenuRoute.MODE_EFFECTS_APP) {
    element = <SettingsMenuEffectApp data={data} setRoutes={setRoutes} />;
  }

  return element;
});

interface CreateModeProps {
  data: AppData;
  cancel: () => void;
  finish: () => void;
}

export function CreateNewMode({ data, cancel, finish }: CreateModeProps) {
  const [nameStatus, setNameStatus] = useState<"valid" | "empty" | "duplicate">(
    "empty"
  );
  const [name, setName] = useState<string>("");

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();

    data.activeProfile.modes.push({
      name,
      icon: MenuIcons.COPYWRITING,
      theme: "default",
      menu: {
        defaultState: ModeMenuState.OPEN,
        items: [
          { key: MenuItemKey.WORKSPACE_CHOOSER },
          { key: MenuItemKey.OPEN_EDITORS },
          { key: MenuItemKey.FILE_EXPLORER }
        ]
      },
      editorEffects: getDefaultHomeEffects()
    });

    data.activeProfile.selectedMode = data.activeProfile.modes.length - 1;
    finish();
  }

  function handleNameChange(evt: any) {
    const newName = evt.target.value;
    setName(newName);

    if (newName === "") {
      setNameStatus("empty");
    } else if (
      data.activeProfile.modes.filter(m => m.name === newName).length > 0
    ) {
      setNameStatus("duplicate");
    } else {
      setNameStatus("valid");
    }
  }

  return (
    <div>
      <h3>Create a new mode</h3>
      <form
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <label>Mode name</label>
        <input type="text" value={name} onChange={handleNameChange} />
        {nameStatus === "empty" && <div>Name cannot be empty</div>}
        {nameStatus === "duplicate" && <div>Name is already used</div>}
        <label>Mode Icon</label>
        <label>Menu Starting Point</label>
        <label>Effects Starting Point</label>

        <button onClick={cancel}>Cancel</button>
        <button type="submit" disabled={nameStatus !== "valid"}>
          Create
        </button>
      </form>
    </div>
  );
}
