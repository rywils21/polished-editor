/** @jsx jsx */
import { Icon, Icons } from "components-ui/Icon";
import { MenuIcon } from "components-ui/MenuIcon";
import { usePrevious } from "hooks/usePrevious";
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { animated, useTransition, useSpring } from "react-spring";
import { jsx } from "theme-ui";
import {
  AppData,
  Mode,
  ModeMenuState,
  ProfileData,
  AuthState,
  AppEnvironment,
} from "types";
import { StartScreenEffect } from "types/editorEffects";
import { ConfigureWritingMode } from "../Settings/ConfigureWritingMode";
import { MenuItemRenderer } from "./Items/MenuItemRenderer";
import moment from "moment";
import { getDefaultMode } from "../../actions/creatorAppData";
import { loadNewMarkdownFile } from "../../hooks/useData";
import { useDrag } from "react-use-gesture";

interface Props {
  data: AppData;
  hideSpring: any;
  hideMenu: boolean;
  setMenuInteractionState: (s: "hovered" | "idle" | "justleft") => void;
  accountState: "open" | "closed";
  setAccountState: Dispatch<SetStateAction<"open" | "closed">>;
}

export const Menu = observer(function Menu({
  data,
  hideSpring,
  hideMenu,
  setMenuInteractionState,
  accountState,
  setAccountState,
}: Props) {
  // Not sure if this is the right place for this or what...
  const previousMode = usePrevious(data.activeProfile.activeMode.name);
  useEffect(() => {
    if (
      data.activeProfile.activeMode.editorEffects.app.startScreenState ===
        StartScreenEffect.FULLSCREEN &&
      data.activeProfile.activeMode.name !== previousMode
    ) {
      data.fullScreen = true;
    } else if (
      data.activeProfile.activeMode.editorEffects.app.startScreenState ===
        StartScreenEffect.NOT_FULLSCREEN &&
      data.activeProfile.activeMode.name !== previousMode
    ) {
      data.fullScreen = false;
    }
  }, [
    data.activeProfile.activeMode.editorEffects.app.startScreenState,
    data.fullScreen,
    data.activeProfile.activeMode.name,
    previousMode,
  ]);

  const profile = data.activeProfile;

  const [sidebarState, setSidebarState] = useState<ModeMenuState>(
    profile.activeMode.menu.defaultState
  );

  useEffect(() => {
    setSidebarState(profile.activeMode.menu.defaultState);
  }, [profile.activeMode.menu.defaultState]);

  const [modalState, setModalState] = useState<"none" | "account">("none");

  // const [sidebarWidth, setSidebarWidth] = useState(300);
  const [tempWidth, setTempWidth] = useState(300);

  const sidebarWidthSpring = useSpring({
    width: tempWidth,
  });

  const bind = useDrag(({ offset: [x], down }) => {
    // const newWidth = sidebarWidth + x;
    const newWidth = 300 + x;
    setTempWidth(newWidth);
  });

  const sidebarTransition = useTransition(
    sidebarState === ModeMenuState.OPEN,
    null,
    {
      from: { marginLeft: `-${tempWidth + 8}px` },
      enter: { marginLeft: `-0px` },
      leave: { marginLeft: `-${tempWidth + 8}px` },
      unique: true,
    }
  );

  const menuWidth =
    sidebarState === ModeMenuState.OPEN ? 64 + tempWidth + 8 : 64;
  const slideSpring = useSpring({
    marginLeft: hideMenu ? menuWidth * -1 : 0,
  });

  const [configureBarState, setConfigureBarState] = useState<"open" | "closed">(
    "closed"
  );

  const configureMenuTransition = useTransition(
    configureBarState === "open",
    null,
    {
      from: { marginLeft: "-420px" },
      enter: { marginLeft: "0px" },
      leave: { marginLeft: "-420px" },
    }
  );

  const empty = !data.activeWorkspace
    ? null
    : data.activeWorkspace.documents.length === 0 &&
      data.activeWorkspace.browsers.length === 0;

  return (
    <div
      sx={{
        backgroundColor: "hsl(210, 5%, 99%)",
        width: empty ? "100%" : undefined,
      }}
    >
      <animated.div
        style={slideSpring}
        sx={{ height: "100%", width: empty ? "100%" : undefined }}
        onMouseEnter={() => {
          setMenuInteractionState("hovered");
        }}
        onMouseLeave={() => {
          setMenuInteractionState("justleft");
        }}
      >
        <div
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            height: "100%",
            width: empty ? "100%" : undefined,
          }}
        >
          {empty && (
            <div
              sx={{
                width: "100%",
                height: "100%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>Open a file to start editing or</div>
              <button
                sx={{ marginLeft: 2 }}
                onClick={() => {
                  loadNewMarkdownFile(data);
                }}
              >
                Create a new one
              </button>
            </div>
          )}
          <div
            sx={{
              position: "relative",
              zIndex: 1,
              maxHeight: "100%",
              display: "flex",
            }}
          >
            {sidebarTransition.map(
              ({ item, key, props }) =>
                item && (
                  <animated.div
                    style={{ ...props, ...sidebarWidthSpring }}
                    sx={{
                      overflow: "hidden",
                      boxSizing: "border-box",
                      height: "100%",
                      display: "flex",
                    }}
                    key={key}
                  >
                    <div
                      sx={{
                        flex: "1 1 0",
                        maxWidth: "calc(100% - 8px)",
                        height: "100%",
                        backgroundColor: "gray6",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <MenuItemRenderer
                        data={data}
                        menuItems={data.activeProfile.activeMode.menu.items}
                      />
                    </div>
                    <button
                      sx={{
                        height: "100%",
                        backgroundColor: "hsl(0, 0%, 72%)",
                        minWidth: 8,
                        cursor: "ew-resize",
                        border: "none",
                        padding: 0,
                      }}
                      {...bind()}
                    ></button>
                  </animated.div>
                )
            )}
          </div>
          <VerticalMenuBar
            data={data}
            profile={profile}
            setSidebarState={setSidebarState}
            sidebarState={sidebarState}
            setModalState={setModalState}
            modalState={modalState}
            configureBarState={configureBarState}
            setConfigureBarState={setConfigureBarState}
            accountState={accountState}
            setAccountState={setAccountState}
          />
          {configureMenuTransition.map(
            ({ item, key, props }) =>
              item && (
                <animated.div
                  style={props}
                  sx={{
                    maxWidth: "420px",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    zIndex: 3,
                    height: "100%",
                  }}
                  key={key}
                >
                  <ConfigureWritingMode
                    open={configureBarState === "open"}
                    data={data}
                    close={() => {
                      setConfigureBarState("closed");
                    }}
                  />
                </animated.div>
              )
          )}
        </div>
      </animated.div>
    </div>
  );
});

interface VerticalBarProps {
  data: AppData;
  profile: ProfileData;
  setSidebarState: Dispatch<SetStateAction<ModeMenuState>>;
  sidebarState: ModeMenuState;
  modalState: "none" | "account";
  setModalState: Dispatch<SetStateAction<"none" | "account">>;
  configureBarState: "open" | "closed";
  setConfigureBarState: Dispatch<SetStateAction<"open" | "closed">>;
  accountState: "open" | "closed";
  setAccountState: Dispatch<SetStateAction<"open" | "closed">>;
}

const VerticalMenuBar = observer(function ({
  data,
  profile,
  setSidebarState,
  sidebarState,
  modalState,
  setModalState,
  configureBarState,
  setConfigureBarState,
  accountState,
  setAccountState,
}: VerticalBarProps) {
  let accountDot = null;

  if (data.authState === AuthState.UNAUTHENTICATED) {
    accountDot = (
      <div
        sx={{
          position: "absolute",
          height: "8px",
          width: "8px",
          borderRadius: "50%",
          backgroundColor: "red",
          top: "4px",
          right: "4px",
        }}
      ></div>
    );
  } else if (data.authState === AuthState.AUTHENTICATED) {
    if (
      data.computedSubscriptionInfo.trialAvailable &&
      data.computedSubscriptionInfo.activeTier !== "pro"
    ) {
      accountDot = (
        <div
          sx={{
            position: "absolute",
            height: "8px",
            width: "8px",
            borderRadius: "50%",
            backgroundColor: "blue",
            top: "4px",
            right: "4px",
          }}
        ></div>
      );
    } else if (data.computedSubscriptionInfo.trialActive) {
      const daysLeft = moment(data.computedSubscriptionInfo.trialExpires)
        .fromNow(true)
        .slice(0, 3)
        .replace(" ", "");
      accountDot = (
        <div
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "hsl(0, 0%, 60%)",
            padding: "2px",
            borderRadius: "4px",
          }}
        >
          {daysLeft}
        </div>
      );
    } else if (data.computedSubscriptionInfo.activeTier === "pro") {
      accountDot = null;
    }
  }

  return (
    <div
      sx={{
        width: "64px",
        height: "100%",
        backgroundColor: "gray1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 2,
      }}
    >
      <div>
        <button
          sx={{
            position: "relative",
            padding: 2,
            margin: 2,
            border: "none",
            borderRadius: "50%",
            backgroundColor:
              accountState === "open" ? "hsl(0, 0%, 18%)" : "hsl(0, 0%, 23%)",
            width: "48px",
            height: "48px",
            ":hover": {
              backgroundColor: "hsl(0, 0%, 18%)",
            },
          }}
          onClick={() => {
            if (data.appEnvironment !== AppEnvironment.WEB_DEMO) {
              setAccountState(accountState === "open" ? "closed" : "open");
            }
          }}
        >
          <Icon
            icon={Icons.USER}
            fill={
              accountState === "open" ? "hsl(0, 0%, 73%)" : "hsl(0, 0%, 55%)"
            }
          />
          {accountDot}
        </button>

        {profile.modes.map((mode: Mode, index: number) => {
          const selected = profile.selectedMode === index;
          return (
            <button
              key={`${mode.name}-${index}`}
              sx={{
                padding: 3,
                backgroundColor: selected ? "hsl(0, 0%, 18%)" : "transparent",
                border: "none",
                // borderRight: selected
                //   ? "3px solid hsl(0, 0%, 90%)"
                //   : "3px solid transparent",
                width: "64px",
                ":hover": {
                  backgroundColor: "hsl(0, 0%, 18%)",
                },
              }}
              onClick={() => {
                if (selected) {
                  setSidebarState(
                    sidebarState === ModeMenuState.OPEN
                      ? ModeMenuState.CLOSED
                      : ModeMenuState.OPEN
                  );
                } else {
                  setSidebarState(mode.menu.defaultState);
                }

                profile.selectedMode = index;
              }}
            >
              <MenuIcon
                icon={mode.icon}
                color={selected ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 55%)"}
              />
            </button>
          );
        })}
        {configureBarState === "open" && (
          <button
            sx={{
              padding: 3,
              border: "none",
              backgroundColor: "transparent",
              width: "64px",
              ":hover": {
                backgroundColor: "hsl(0, 0%, 38%)",
              },
            }}
            onClick={() => {
              // TODO: add mode
              data.activeProfile.modes = [
                ...data.activeProfile.modes,
                getDefaultMode(),
              ];
              data.activeProfile.selectedMode =
                data.activeProfile.modes.length - 1;
            }}
          >
            <Icon icon={Icons.PLUS} fill={"hsl(0, 0%, 55%)"} />
          </button>
        )}
      </div>
      <div>
        <button
          sx={{
            marginTop: 5,
            padding: 3,
            border: "none",
            backgroundColor:
              configureBarState === "open" ? "hsl(0, 0%, 38%)" : "transparent",
            width: "64px",
            ":hover": {
              backgroundColor: "hsl(0, 0%, 38%)",
            },
          }}
          onClick={() => {
            setConfigureBarState(
              configureBarState === "open" ? "closed" : "open"
            );
          }}
        >
          <Icon
            icon={Icons.GEAR}
            fill={
              configureBarState === "open"
                ? "hsl(0, 0%, 73%)"
                : "hsl(0, 0%, 55%)"
            }
          />
        </button>
      </div>
    </div>
  );
});
