/** @jsx jsx */
import { jsx } from "theme-ui";
import { useRef, useState, useContext } from "react";
import { LineBreakWithHeight } from "../misc/utls";
import { PhrasingContent, Link } from "types/appTypes";
import { SVGElementPhrasingContent } from "./SVGElementPhrasingContent";
import { TextStyle, AppData } from "types";
import { createNewBrowser } from "../actions/creatorAppData";
import { AppContext } from "../index";

interface PropTypes {
  blockIndex: number;
  node: Link;
  startingIndex: number;
  startingX: number;
  startingY: number;
  firstChild: boolean;
  firstLine: boolean;
  lineBreaks: number[];
  lineBreaksWithHeights: LineBreakWithHeight[];
  textStyle: TextStyle;
  blockWidth: number;
}

export function SVGElementLink({
  blockIndex,
  node,
  startingIndex,
  startingX,
  startingY,
  firstChild,
  firstLine,
  lineBreaks,
  lineBreaksWithHeights,
  textStyle,
  blockWidth,
}: PropTypes) {
  const appData = useContext<AppData>(AppContext);
  const containerRef = useRef<SVGGElement>(null);

  textStyle.color = "blue";
  textStyle.textDecoration = "underline";

  const [hovered, setHovered] = useState<boolean>(false);

  const LINK_CONTROLS_HEIGHT = 70;

  const hoverBarShift = -1 * startingY + LINK_CONTROLS_HEIGHT;

  return (
    <g
      ref={containerRef}
      onMouseOver={() => {
        if (containerRef && containerRef.current) {
          setHovered(true);
        }
      }}
    >
      {node.children.map((child: PhrasingContent, i: number) => {
        return (
          <SVGElementPhrasingContent
            key={i}
            blockIndex={blockIndex}
            node={child}
            startingIndex={startingIndex}
            startingX={startingX}
            startingY={startingY}
            firstChild={firstChild}
            firstLine={firstLine}
            lineBreaks={lineBreaks}
            lineBreaksWithHeights={lineBreaksWithHeights}
            textStyle={textStyle}
            blockWidth={blockWidth}
          />
        );
      })}
      {hovered && (
        <g transform={`translate(${startingX - 5} ${-1 - hoverBarShift})`}>
          <foreignObject
            y={0}
            x={0}
            width={`${410}`}
            height={`${LINK_CONTROLS_HEIGHT}`}
            onMouseLeave={() => {
              setHovered(false);
            }}
          >
            <div
              sx={{
                backgroundColor: "white",
                padding: 2,
                border: "1px solid #707070",
                borderRadius: "4px",
              }}
            >
              <div sx={{ color: "blue" }}>{node.url}</div>
              <div>
                <button
                  sx={{
                    border: "none",
                    borderRight: "1px solid #707070",
                    padding: 1,
                    background: "none",
                    fontSize: 2,
                    color: "text",
                    fontWeight: "body",
                    fontFamily: "body",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (appData.activeWorkspace) {
                      appData.activeWorkspace.browsers.push(
                        createNewBrowser(appData, node.url)
                      );
                    }
                  }}
                >
                  Open in Workspace
                </button>
                <a
                  sx={{
                    padding: 1,
                    textDecoration: "none",
                    fontSize: 2,
                    color: "text",
                    ":visited": {
                      color: "text",
                    },
                  }}
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  );
}
