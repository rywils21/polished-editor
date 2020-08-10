/** @jsx jsx */
import { jsx } from "theme-ui";
import { BrowserObject, ResizeDirection } from "types";
import { Icon, Icons } from "components-ui/Icon";
import { observer } from "mobx-react-lite";
import { useContext, useState, useCallback, FormEvent, useRef } from "react";
import { AppContext } from "../index";

interface Props {
  browser: BrowserObject;
  index: number;
}

export const SVGElementWebBrowser = observer(function SVGElementWebBrowser({
  browser,
  index,
}: Props) {
  const data = useContext(AppContext);

  const width = browser.width;
  const height = browser.height;

  const [url, setUrl] = useState(browser.src);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateIframe = useCallback(
    function updateIframe(evt: FormEvent) {
      evt.preventDefault();
      browser.src = url;
    },
    [url, browser.src]
  );

  return (
    <g transform={`translate(${browser.position.x} ${browser.position.y})`}>
      <foreignObject width={`${width}`} height={`${height}`}>
        <div
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "calc(100% - 16px)",
              height: "calc(100% - 16px)",
              border: "1px solid black",
              boxSizing: "border-box",
            }}
          >
            <div
              sx={{
                width: "100%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  sx={{ border: "none", background: "none", padding: 2 }}
                  onMouseDown={() => {
                    browser.dragging = true;
                    data.draggingAnything = true;
                  }}
                >
                  <Icon icon={Icons.MOVE} x={16} y={8} />
                </button>
                <form
                  sx={{ width: "30%", display: "flex" }}
                  onSubmit={updateIframe}
                >
                  <input
                    sx={{
                      flex: 1,
                      border: "none",
                      borderBottom: "1px solid black",
                      padding: 1,
                    }}
                    value={url}
                    onChange={(evt) => {
                      setUrl(evt.target.value);
                    }}
                  />
                  <button sx={{ background: "none" }} type="submit">
                    go
                  </button>
                </form>
              </div>
              <div>
                <button
                  sx={{ border: "none", background: "none", cursor: "pointer" }}
                  onClick={() => {
                    if (data.activeWorkspace) {
                      data.activeWorkspace.browsers = [
                        ...data.activeWorkspace.browsers.slice(0, index),
                        ...data.activeWorkspace.browsers.slice(index + 1),
                      ];
                    }
                  }}
                >
                  <Icon icon={Icons.CROSS} />
                </button>
              </div>
            </div>
            <iframe
              ref={iframeRef}
              onLoad={() => {
                if (iframeRef && iframeRef.current) {
                  setUrl(iframeRef.current.src);
                }
              }}
              title={browser.src}
              src={browser.src}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={true}
              sandbox="allow-scripts allow-forms allow-same-origin"
              sx={{ background: "white", flex: 1 }}
            ></iframe>
            {(data.draggingAnything || browser.resizing.length > 0) && (
              <div
                sx={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  width: "100%",
                  background: "transparent",
                }}
              ></div>
            )}
          </div>
          <div
            sx={{
              position: "absolute",
              right: "4px",
              top: 0,
              width: "4px",
              height: "calc(100% - 16px)",
              background: "gray",
              cursor: `ew-resize`,
            }}
            onMouseDown={() => {
              browser.resizing.push(ResizeDirection.EW);
            }}
          ></div>
          <div
            sx={{
              position: "absolute",
              left: 0,
              bottom: "4px",
              width: "calc(100% - 16px)",
              height: "4px",
              background: "gray",
              cursor: `ns-resize`,
            }}
            onMouseDown={() => {
              browser.resizing.push(ResizeDirection.NS);
            }}
          ></div>
          <div
            sx={{
              position: "absolute",
              bottom: "0",
              right: "0",
              borderRadius: "6px",
              width: "12px",
              height: "12px",
              background: "gray",
              border: "none",
              padding: 0,
              cursor: `nwse-resize`,
            }}
            onMouseDown={() => {
              browser.resizing.push(ResizeDirection.NS);
              browser.resizing.push(ResizeDirection.EW);
            }}
          ></div>
        </div>
      </foreignObject>
    </g>
  );
});
