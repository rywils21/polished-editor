/** @jsx jsx */
import { jsx } from "theme-ui";
import { useLocalStore, observer } from "mobx-react-lite";
import { useState, Component } from "react";
import { Styled, ThemeProvider } from "theme-ui";
import { AppData, AppEnvironment, AppDataStatus } from "types";
import { createAppData } from "../actions/creatorAppData";
import { base } from "../themes/theme";
import { ElectronControls } from "../electron/clientControls";
import { WindowEmptyStateHelper } from "./WindowEmptyStateHelper";
import { FullscreenWrapper } from "components-ui/Fullscreen";
import { useAuth } from "hooks/useAuth";
import { useOfflineStatus } from "hooks/useOfflineStatus";
import { IpcRenderer } from "electron";
import { SVGCanvas } from "./SVGContainerCanvas";
import { Menu } from "./Menu/Menu";
import { TitleBar } from "./Menu/TitleBar";
import { MenuVisibility } from "types/editorEffects";
import { useSpring } from "react-spring";
import { useCancellingInterval } from "hooks/useInterval";
import { ElectronContext, AppContext } from "index";
import { useDataLayer } from "hooks/useDataLayer";
import { useWindowControls } from "hooks/useWindowControls";
import { LoadingScreen } from "./LoadingScreen";

interface Props {
  appEnvironment: AppEnvironment;
  electronControls: ElectronControls | null;
  ipcRenderer: IpcRenderer | null;
}

export const App = observer(function App({
  appEnvironment,
  electronControls,
  ipcRenderer,
}: Props) {
  const appState = useLocalStore<AppData>(() => createAppData(appEnvironment));

  useWindowControls(appState);

  useAuth(appState);

  useOfflineStatus(appState);

  useDataLayer(appEnvironment, appState, electronControls, ipcRenderer);

  const [menuInteractionState, setMenuInteractionState] = useState<
    "idle" | "justleft" | "hovered"
  >("idle");

  const hideMenu =
    menuInteractionState === "idle" &&
    appState.activeProfile.activeMode.editorEffects.menu.visibility ===
      MenuVisibility.WHEN_HOVERED;
  const hideSpring = useSpring({
    opacity: hideMenu ? 0 : 1,
  });

  useCancellingInterval(
    () => {
      if (menuInteractionState === "justleft") {
        setMenuInteractionState("idle");
      }
    },
    1500,
    menuInteractionState
  );

  const [accountState, setAccountState] = useState<"open" | "closed">("closed");

  return (
    <FullscreenWrapper data={appState}>
      <ThemeProvider theme={base}>
        <Styled.root>
          <AppContext.Provider value={appState}>
            <TopLevelErrorBoundary>
              <ElectronContext.Provider value={electronControls}>
                {appState.status === AppDataStatus.STARTING_UP ||
                appState.authStatus === "initializing" ? (
                  <LoadingScreen />
                ) : (
                  <div
                    sx={{
                      height: "100vh",
                      maxHeight: "100vh",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div sx={{ flex: "0 0 auto" }}>
                      <TitleBar
                        data={appState}
                        hideMenu={hideMenu}
                        hideSpring={hideSpring}
                        setMenuInteractionState={setMenuInteractionState}
                        accountState={accountState}
                        setAccountState={setAccountState}
                      />
                    </div>
                    <div
                      sx={{
                        position: "relative",
                        flex: "1 1 0",
                        display: "flex",
                        height: "calc(100% - 35px)",
                      }}
                    >
                      <Menu
                        data={appState}
                        hideMenu={hideMenu}
                        hideSpring={hideSpring}
                        setMenuInteractionState={setMenuInteractionState}
                        accountState={accountState}
                        setAccountState={setAccountState}
                      />
                      <SVGCanvas data={appState} />
                      <div
                        sx={{
                          position: "absolute",
                          height: "100%",
                          top: 0,
                          left: 0,
                          width: "64px",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={() => {
                          setMenuInteractionState("hovered");
                        }}
                        onMouseLeave={() => {
                          setMenuInteractionState("justleft");
                        }}
                      ></div>
                      <WindowEmptyStateHelper data={appState} />
                    </div>
                  </div>
                )}
              </ElectronContext.Provider>
            </TopLevelErrorBoundary>
          </AppContext.Provider>
        </Styled.root>
      </ThemeProvider>
    </FullscreenWrapper>
  );
});

class TopLevelErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log("top level error", error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <button
            onClick={() => {
              // @ts-ignore
              if (window.clearSettings) {
                // @ts-ignore
                window.clearSettings();
                setTimeout(() => {
                  // @ts-ignore
                  window.location.reload();
                }, 500);
              }
            }}
          >
            Clear settings
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;
