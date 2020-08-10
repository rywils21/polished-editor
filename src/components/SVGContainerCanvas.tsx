/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { useRef, useEffect, ReactNode } from "react";
import { jsx } from "theme-ui";
import { AppData, BrowserObject, ResizeDirection, AppEnvironment } from "types";
import { DocumentRoot } from "types/appTypes";
import { SVGDocument } from "./SVGElementDocument";
import { useSpring, animated } from "react-spring";
import {
  FullGestureState,
  SharedGestureState,
  DistanceAngle,
  Coordinates,
} from "react-use-gesture/dist/types";
import { SVGElementWebBrowser } from "./SVGElementWebBrowser";
import { useGesture } from "react-use-gesture";
import {
  BrowserVisibility,
  DocumentVisibility,
  CursorVisibility,
  ClickDragEffect,
  WheelEffect,
  PinchEffect,
} from "types/editorEffects";

interface PropTypes {
  data: AppData;
}

export const SVGCanvas = observer(function SVGCanvas({ data }: PropTypes) {
  const svgEl = useRef<any>(null);
  const rectEl = useRef(null);

  // This hook dep is not corrent but fixing it causes an infinite render
  // Need to change the data model instead of just attaching the svg element
  useEffect(() => {
    if (svgEl && !data.svgElement) {
      data.svgElement = svgEl;
    }
  }, [svgEl, data.svgElement]);

  let zoom = 1;
  let x = 0;
  let y = 0;

  if (data.activeWorkspace) {
    const view = data.activeWorkspace.view;

    zoom = view.zoom;
    x = view.x;
    y = view.y;
  }

  const onPinch = ({
    event,
    origin,
    delta,
    vdva,
  }: FullGestureState<"pinch">) => {
    event?.preventDefault();
    if (
      data.activeProfile.activeMode.editorEffects.controls.CmdOrCtrlWheel ===
      PinchEffect.ZOOM
    ) {
      let zoomAmount = delta[1] * -1;
      if (Math.abs(zoomAmount) >= 100) {
        zoomAmount = vdva[0];
      }
      let newZoom = zoom + Math.round(zoomAmount) / 100;
      if (newZoom < 0.1) {
        newZoom = 0.1;
      }

      if (origin && svgEl && svgEl.current) {
        // @ts-ignore
        const boundingBox = svgEl.current.getBoundingClientRect();

        const zoomX = (origin[0] - x - boundingBox.x) / zoom;
        const zoomY = (origin[1] - y) / zoom;

        const zoomDelta = zoom - newZoom;

        const offsetX = zoomX * zoomDelta;
        const offsetY = zoomY * zoomDelta;

        const newX = x + offsetX;
        const newY = y + offsetY;

        if (data.selectedWorkspace && data.workspaces[data.selectedWorkspace]) {
          data.workspaces[data.selectedWorkspace].view = {
            x: newX,
            y: newY,
            zoom: newZoom,
          };
        }
      }
    }
  };

  const onWheel = ({ event, delta, xy }: FullGestureState<"wheel">) => {
    if (
      data.activeProfile.activeMode.editorEffects.controls.Wheel ===
      WheelEffect.PAN_CANVAS
    ) {
      const [dx, dy] = delta;
      if (data.activeWorkspace) {
        data.activeWorkspace.view.x -= dx;
        data.activeWorkspace.view.y -= dy;
      }
    }
  };

  const onDrag = ({ event, delta, velocity }: FullGestureState<"drag">) => {
    const [dx, dy] = delta;
    let isDraggingDocuments = false;

    if (data.activeWorkspace) {
      data.activeWorkspace.documents.forEach((document: DocumentRoot) => {
        if (document.dragging) {
          document.position.x += dx / zoom;
          document.position.y += dy / zoom;

          isDraggingDocuments = true;
        }
      });

      data.activeWorkspace.browsers.forEach((browser: BrowserObject) => {
        if (browser.dragging) {
          browser.position.x += dx / zoom;
          browser.position.y += dy / zoom;

          isDraggingDocuments = true;
        }

        if (browser.resizing.indexOf(ResizeDirection.NS) > -1) {
          browser.height += dy / zoom;

          isDraggingDocuments = true;
        }
        if (browser.resizing.indexOf(ResizeDirection.EW) > -1) {
          browser.width += dx / zoom;

          isDraggingDocuments = true;
        }
      });
    }

    if (
      !isDraggingDocuments &&
      !data.selecting &&
      event &&
      data.activeWorkspace
    ) {
      // TODO: check cmd for mac platform - implement some function that can take an event and do that magic
      if (
        (data.activeProfile.activeMode.editorEffects.controls
          .CmdOrCtrlClickDrag === ClickDragEffect.PAN_CANVAS &&
          event.ctrlKey) ||
        (data.activeProfile.activeMode.editorEffects.controls.ClickDrag ===
          ClickDragEffect.PAN_CANVAS &&
          !event.ctrlKey)
      ) {
        data.activeWorkspace.view.x += dx;
        data.activeWorkspace.view.y += dy;
      }
    }
  };

  const bindGestures = useGesture(
    {
      onPinch,
      onWheel,
      onDrag,
    },
    {
      domTarget: svgEl,
      eventOptions: {
        passive: false,
        capture: true,
      },
    }
  );

  // @ts-ignore
  useEffect(bindGestures, [bindGestures]);

  const viewSpring = useSpring({
    transform: `matrix(${zoom || 1} 0 0 ${zoom} ${x || 0} ${y || 0})`,
    config: {
      tension: 500,
      friction: 20,
      clamp: true,
    },
  });

  return (
    <div sx={{ flex: 1, display: "flex", position: "relative" }}>
      <svg
        sx={{
          flex: 1,
          cursor:
            data.typing &&
            data.activeProfile.activeMode.editorEffects.canvas.cursor
              .visibility === CursorVisibility.HIDDEN_WHILE_TYPING
              ? "none"
              : "default",
        }}
        id="editArea"
        focusable="true"
        tabIndex={0}
        ref={svgEl}
        onKeyDown={data.handleKeyDown}
        onMouseMove={() => {
          data.typing = false;
        }}
        onMouseUp={(evt) => {
          data.activeWorkspace?.documents.forEach((document: DocumentRoot) => {
            document.dragging = false;
          });
          data.activeWorkspace?.browsers.forEach((browser: BrowserObject) => {
            browser.dragging = false;
            browser.resizing = [];
          });

          data.draggingAnything = false;

          if (data.selecting && data.activeWorkspace) {
            if (!evt.shiftKey) {
              data.activeWorkspace.selection = [data.selecting];
            } else {
              data.activeWorkspace.selection.push(data.selecting);
            }
            data.selecting = null;
          }
        }}
      >
        <defs>
          <filter id="shadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="blur" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>
        <rect
          ref={rectEl}
          x={0}
          y={0}
          fill="hsl(210, 5%, 99%)"
          sx={{
            width: "100vw",
            height: "100vh",
          }}
          onMouseDown={() => {
            if (data.activeWorkspace) {
              data.activeWorkspace.selection = [];
            }
          }}
        />
        <animated.g transform={viewSpring.transform}>
          {data.activeWorkspace?.documents.map(
            (root: DocumentRoot, i: number) => {
              if (data.activeWorkspace) {
                let docEl: ReactNode | null = null;

                const hasRange =
                  data.activeWorkspace.selection.length > 0 || data.selecting;
                let docInRange = false;

                if (data.activeWorkspace.selection.length > 0) {
                  const range = data.activeWorkspace.selection[0];
                  if (range.documentIndex === i) {
                    docInRange = true;
                  }
                }
                if (data.selecting && data.selecting.documentIndex === i) {
                  docInRange = true;
                }

                let shouldShowDocument = true;
                if (
                  data.activeProfile.activeMode.editorEffects.document
                    .visibility === DocumentVisibility.WHEN_ACTIVE &&
                  hasRange &&
                  !docInRange
                ) {
                  shouldShowDocument = false;
                }

                if (shouldShowDocument) {
                  docEl = (
                    <SVGDocument
                      key={i}
                      documentIndex={i}
                      document={root}
                      isSelected={docInRange}
                      data={data}
                    />
                  );
                }

                return docEl;
              }
            }
          )}
          {data.activeWorkspace?.browsers.map(
            (browser: BrowserObject, i: number) =>
              data.activeProfile.activeMode.editorEffects.browser.visibility ===
              BrowserVisibility.VISIBLE ? (
                <SVGElementWebBrowser
                  key={`browser-${i}`}
                  browser={browser}
                  index={i}
                />
              ) : null
          )}
        </animated.g>
      </svg>

      {data.appEnvironment === AppEnvironment.WEB_DEMO && (
        <div
          sx={{
            position: "absolute",
            margin: 3,
            padding: 2,
            borderLeft: "3px solid #e3a008",
            backgroundColor: "#fdf6b2",
            borderRadius: 1,
            width: "calc(100% - 48px)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}>
              <svg
                sx={{
                  height: 20,
                  width: 20,
                  color: "#e3a008",
                  paddingTop: "1px",
                }}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div sx={{ marginLeft: 1, fontWeight: 700, fontSize: 3 }}>
                This is a demo
              </div>
            </div>
            <div sx={{ marginLeft: 4, marginTop: 1 }}>
              <a href="/download">Download the Polished Desktop App</a> to work
              offline and save changes.
            </div>
          </div>
          <div
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <a href="/">Go to website home</a>
          </div>
        </div>
      )}
    </div>
  );
});
