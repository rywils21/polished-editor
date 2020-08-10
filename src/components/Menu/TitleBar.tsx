/** @jsx jsx */
import { jsx } from "theme-ui";
import { useContext, Dispatch, SetStateAction } from "react";
import { AppData, AppEnvironment } from "types";
import { observer } from "mobx-react-lite";

import Logo from "1-assets/polished-logo.png";
import { Icon, Icons } from "components-ui/Icon";
import { ElectronContext } from "../../index";
import { animated, useTransition } from "react-spring";
import { AccountBar } from "./AccountBar";

import Bowser from "bowser";
const browser = Bowser.getParser(window.navigator.userAgent);

interface Props {
  data: AppData;
  hideSpring: any;
  hideMenu: boolean;
  setMenuInteractionState: (s: "hovered" | "idle" | "justleft") => void;
  accountState: "open" | "closed";
  setAccountState: Dispatch<SetStateAction<"open" | "closed">>;
}

export const TitleBar = observer(function TitleBar({
  data,
  hideSpring,
  hideMenu,
  setMenuInteractionState,
  accountState,
  setAccountState,
}: Props) {
  const electronControls = useContext(ElectronContext);

  const accountTransition = useTransition(accountState === "open", null, {
    from: { marginTop: "-420px" },
    enter: { marginTop: "0px" },
    leave: { marginTop: "-420px" },
  });

  const accountTransitionGrayArea = useTransition(
    accountState === "open",
    null,
    {
      from: { opacity: 0 },
      enter: { opacity: 0.5 },
      leave: { opacity: 0 },
    }
  );

  return (
    <animated.div
      sx={{ overflow: "hidden" }}
      style={hideSpring}
      onMouseEnter={() => {
        setMenuInteractionState("hovered");
      }}
      onMouseLeave={() => {
        setMenuInteractionState("justleft");
      }}
    >
      {browser.getOSName() === "Windows" &&
        data.appEnvironment === AppEnvironment.ELECTRON && (
          <div
            style={{
              // @ts-ignore
              WebkitUserSelect: "none",
              // @ts-ignore
              WebkitAppRegion: hideMenu ? "no-drag" : "drag",
            }}
            sx={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "gray2",
              boxSizing: "border-box",
              zIndex: 5,
            }}
          >
            <img
              src={Logo}
              alt="Polished Logo"
              sx={{
                width: "24px",
                height: "24px",
                padding: 1,
                paddingLeft: 2,
                display: "flex",
                alignItems: "center",
              }}
            />
            <div>
              <button
                style={{
                  // @ts-ignore
                  WebkitAppRegion: "no-drag",
                }}
                sx={{
                  border: "none",
                  background: "none",
                  padding: 2,
                  paddingLeft: 3,
                  paddingRight: 3,
                  ":hover": {
                    backgroundColor: "hsl(0, 0%, 40%)",
                    svg: { fill: "white" },
                  },
                }}
                onClick={() => {
                  // close the window
                  if (electronControls) {
                    electronControls.minimizeWindow();
                  }
                }}
              >
                <Icon icon={Icons.MINUS} width={16} height={16} />
              </button>

              <button
                style={{
                  // @ts-ignore
                  WebkitAppRegion: "no-drag",
                }}
                sx={{
                  height: "100%",
                  border: "none",
                  background: "none",
                  padding: 2,
                  paddingLeft: 3,
                  paddingRight: 3,
                  ":hover": {
                    backgroundColor: "hsl(0, 0%, 40%)",
                    rect: { stroke: "white" },
                  },
                }}
                onClick={() => {
                  // close the window
                  if (electronControls) {
                    electronControls.maximizeWindow();
                  }
                }}
              >
                <svg width="16px" height="16px">
                  <rect
                    x={1}
                    y={1}
                    width={14}
                    height={14}
                    fill="none"
                    stroke="#707070"
                    strokeWidth="2px"
                  />
                </svg>
              </button>
              <button
                style={{
                  // @ts-ignore
                  WebkitAppRegion: "no-drag",
                }}
                sx={{
                  border: "none",
                  background: "none",
                  padding: 2,
                  paddingLeft: 3,
                  paddingRight: 3,
                  ":hover": { backgroundColor: "red", svg: { fill: "white" } },
                }}
                onClick={() => {
                  // close the window
                  if (electronControls) {
                    electronControls.closeWindow();
                  }
                }}
              >
                <Icon icon={Icons.CROSS} width={16} height={16} />
              </button>
            </div>
          </div>
        )}
      {accountTransitionGrayArea.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              style={props}
              sx={{
                zIndex: 3,
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                height: "100vh",
                width: "100vw",
                backgroundColor: "hsl(0, 0%, 18%)",
              }}
              key={key}
              onClick={() => {
                setAccountState("closed");
              }}
            ></animated.div>
          )
      )}
      {accountTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              style={props}
              sx={{ zIndex: 4, position: "relative" }}
              key={key}
            >
              <AccountBar data={data} />
            </animated.div>
          )
      )}
    </animated.div>
  );
});
