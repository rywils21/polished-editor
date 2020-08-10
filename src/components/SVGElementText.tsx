/** @jsx jsx */
import { jsx } from "theme-ui";
import {
  useRef,
  useContext,
  useLayoutEffect,
  MouseEvent,
  RefObject,
} from "react";
import { Text } from "types/appTypes";
import { TextStyle, ViewState, CharData, AppData } from "types";
import { AppContext } from "../index";
import { DocumentContext, DocumentContextModel } from "./SVGElementDocument";
import { LineBreakWithHeight } from "misc/utls";

interface PropTypes {
  blockIndex: number;
  node: Text;
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

export function SVGElementText({
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
  const textRef = useRef<SVGTextElement>(null);
  const appData = useContext<AppData>(AppContext);
  const { documentIndex, documentScrollBind } = useContext<
    DocumentContextModel
  >(DocumentContext);

  const {
    color,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    fontStyle,
    textDecoration,
    opacity,
  } = textStyle;

  useLayoutEffect(() => {
    if (textRef.current) {
      const newCharData: CharData[] = [];
      for (let i = 0; i < node.value.length; i++) {
        const char = node.value.charAt(i);
        const dimensions = textRef.current.getExtentOfChar(i);
        const { width, height, x, y } = dimensions;
        newCharData.push({
          type: "char",
          index: i,
          char,
          width,
          height,
          x: x,
          y: y + startingY,
        });
      }

      node.charData = newCharData;
    }
  }, [
    node,
    node.value,
    node.charData.length,
    fontSize,
    fontWeight,
    lineHeight,
    startingY,
    startingX,
  ]);

  const lines: { value: string; width: number }[] = [{ value: "", width: 0 }];
  let currentLine = 0;

  // If this is the start of a new line but the first part of this text
  if (lineBreaks.indexOf(startingIndex - 1) > -1) {
    lines.push({ value: "", width: 0 });
    currentLine += 1;
  }

  for (let i = 0; i < node.value.length; i++) {
    const currentIndex = startingIndex + i;
    const char = node.value.charAt(i);

    lines[currentLine].value += char;
    if (node.charData.length > i) {
      lines[currentLine].width += node.charData[i].width;
    }

    if (lineBreaks.indexOf(currentIndex) > -1) {
      lines.push({ value: "", width: 0 });
      currentLine += 1;
    }
  }

  let firstLineDy = 0;
  let nonFirstDy = 0;

  if (fontSize && lineHeight) {
    if (firstLine && startingY !== 0) {
      // if startingY is not zero - that means there's an image in the first line
      firstLineDy = 0;
    } else {
      // firstLineDy = 0;
      firstLineDy =
        fontSize * lineHeight - ((fontSize * lineHeight) / 2 - fontSize / 2);
    }
    nonFirstDy = fontSize * lineHeight;
  }

  function getBoxY(i: number) {
    if (firstLine && startingY !== 0) {
      return -1 * fontSize * lineHeight + (fontSize * lineHeight - fontSize);
    }
    return (
      (fontSize * lineHeight) / 2 - fontSize / 2 + i * fontSize * lineHeight
    );
  }

  const tspans = lines.map(
    (line: { value: string; width: number }, i: number) => (
      <tspan
        key={`${i}-${line}`}
        x={i === 0 && !firstChild ? startingX : 0}
        dy={i === 0 ? firstLineDy : nonFirstDy}
        fill={color}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontStyle={fontStyle}
        textDecoration={textDecoration}
        opacity={opacity}
      >
        {line.value}
      </tspan>
    )
  );

  const selectionRects = lines.map(
    (line: { value: string; width: number }, i: number) => (
      <rect
        key={`box-${i}-${line}`}
        sx={{ cursor: "text" }}
        fill="transparent"
        // stroke="black"
        // strokeWidth="1"
        // opacity={0.15}
        height={fontSize * lineHeight}
        width={line.width}
        y={getBoxY(i)}
        x={i === 0 && !firstChild ? startingX : 0}
        onMouseDown={(evt) => {
          if (textRef && textRef.current) {
            const newIndex = adjustAndGetCursorIndex(
              textRef,
              fontSize,
              lineHeight,
              evt,
              lineBreaks,
              appData.activeWorkspace?.view,
              node.charData,
              startingIndex,
              startingX,
              lines
            );

            if (appData.activeWorkspace) {
              appData.activeWorkspace.selection = [];
              appData.selecting = {
                documentIndex,
                start: {
                  block: blockIndex,
                  offset: newIndex,
                },
                end: {
                  block: blockIndex,
                  offset: newIndex,
                },
              };
            }
          }
        }}
        onMouseMove={(evt) => {
          const newIndex = adjustAndGetCursorIndex(
            textRef,
            fontSize,
            lineHeight,
            evt,
            lineBreaks,
            appData.activeWorkspace?.view,
            node.charData,
            startingIndex,
            startingX,
            lines
          );

          if (appData.selecting) {
            appData.selecting = {
              documentIndex,
              start: appData.selecting.start,
              end: {
                block: blockIndex,
                offset: newIndex,
              },
            };
          }
        }}
        onMouseUp={(evt) => {
          if (textRef && textRef.current && appData.selecting) {
            let start = appData.selecting.start;
            let end = appData.selecting.end;

            if (
              start.block > end.block ||
              (start.block === end.block && start.offset > end.offset)
            ) {
              end = appData.selecting.start;
              start = appData.selecting.end;
            }

            appData.selecting = {
              documentIndex,
              start,
              end,
            };

            console.log("mouse final selection: ", start.offset, end.offset);

            if (appData.activeWorkspace) {
              if (!evt.shiftKey) {
                appData.activeWorkspace.selection = [appData.selecting];
              } else {
                // TODO: push the selection range when multiple are supported
              }
              appData.selecting = null;
            }
          }
        }}
      />
    )
  );

  return (
    <g transform={`translate(0 ${startingY})`} {...documentScrollBind()}>
      <text
        xmlSpace="preserve"
        ref={textRef}
        // {...documentScrollBind()}
        sx={{ fontSize, fontWeight, userSelect: "none", cursor: "text" }}
        fontFamily={`'Montserrat', sans-serif`}
      >
        {tspans}
      </text>
      {selectionRects}
      {node.value === "" && (
        <rect
          sx={{ cursor: "text" }}
          fill="transparent"
          height={fontSize * lineHeight}
          width={blockWidth}
          y={0}
          x={0}
          onMouseDown={(evt) => {
            if (textRef && textRef.current) {
              const newIndex = adjustAndGetCursorIndex(
                textRef,
                fontSize,
                lineHeight,
                evt,
                lineBreaks,
                appData.activeWorkspace?.view,
                node.charData,
                startingIndex,
                startingX,
                lines
              );

              if (appData.activeWorkspace) {
                appData.activeWorkspace.selection = [];
                appData.selecting = {
                  documentIndex,
                  start: {
                    block: blockIndex,
                    offset: newIndex,
                  },
                  end: {
                    block: blockIndex,
                    offset: newIndex,
                  },
                };
              }
            }
          }}
          onMouseMove={(evt) => {
            const newIndex = adjustAndGetCursorIndex(
              textRef,
              fontSize,
              lineHeight,
              evt,
              lineBreaks,
              appData.activeWorkspace?.view,
              node.charData,
              startingIndex,
              startingX,
              lines
            );

            if (appData.selecting) {
              appData.selecting = {
                documentIndex,
                start: appData.selecting.start,
                end: {
                  block: blockIndex,
                  offset: newIndex,
                },
              };
            }
          }}
          onMouseUp={(evt) => {
            if (textRef && textRef.current && appData.selecting) {
              let start = appData.selecting.start;
              let end = appData.selecting.end;

              if (
                start.block > end.block ||
                (start.block === end.block && start.offset > end.offset)
              ) {
                end = appData.selecting.start;
                start = appData.selecting.end;
              }

              appData.selecting = {
                documentIndex,
                start,
                end,
              };

              console.log("mouse final selection: ", start.offset, end.offset);

              if (appData.activeWorkspace) {
                if (!evt.shiftKey) {
                  appData.activeWorkspace.selection = [appData.selecting];
                } else {
                  // TODO: push the selection range when multiple are supported
                }
                appData.selecting = null;
              }
            }
          }}
        />
      )}
    </g>
  );
}

function adjustAndGetCursorIndex(
  textRef: any,
  fontSize: number,
  lineHeight: number,
  evt: MouseEvent,
  lineBreaks: number[],
  view: ViewState | undefined,
  charData: CharData[],
  startingIndex: number,
  startingX: number,
  lines: { value: string; width: number }[]
): number {
  if (view) {
    const textBound = textRef.current.getBoundingClientRect();
    const partitionSize = fontSize * lineHeight * view.zoom;
    let currentPartitionPoint = partitionSize / 2 + textBound.top;
    let x =
      evt.clientX < textBound.left
        ? textBound.left
        : evt.clientX > textBound.right
        ? textBound.right
        : evt.clientX;
    let y = currentPartitionPoint;
    for (let i = 0; i < lineBreaks.length; i++) {
      currentPartitionPoint += partitionSize;
      if (
        Math.abs(evt.clientY - currentPartitionPoint) <
        Math.abs(evt.clientY - y)
      ) {
        y = currentPartitionPoint;
      }
    }
    if (lines.length === 1) {
      x += startingX * view.zoom;
    }

    const cursorIndex = getCursorIndex(x, y, textRef, view, charData);

    return cursorIndex + startingIndex - 1;
  } else {
    return -1;
  }
}

function getCursorIndex(
  x: number,
  y: number,
  textRef: any,
  view: ViewState,
  displayCharData: CharData[]
): number {
  const svg: any = document.getElementById("editArea");
  const point = svg.createSVGPoint();
  const dim = textRef.current.getBoundingClientRect();
  point.x = (x - dim.left) / view.zoom;
  point.y = (y - dim.top) / view.zoom;

  let cursorIndex = textRef.current.getCharNumAtPosition(point);
  if (cursorIndex === -1) {
    cursorIndex = displayCharData.length - 1;
  }
  const char = displayCharData[cursorIndex];
  if (char) {
    if (point.x < char.x + char.width / 2) {
      cursorIndex -= 1;
    }
  }

  return cursorIndex + 1;
}
