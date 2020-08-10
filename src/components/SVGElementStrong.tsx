import React from "react";
import { getNewStartingX, LineBreakWithHeight } from "../misc/utls";
import { PhrasingContent, Strong } from "types/appTypes";
import { SVGElementPhrasingContent } from "./SVGElementPhrasingContent";
import { TextStyle } from "types";

interface PropTypes {
  blockIndex: number;
  node: Strong;
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

export function SVGElementStrong({
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
  let startX = startingX;

  textStyle.fontWeight = 700;

  return (
    <>
      {node.children.map((child: PhrasingContent, i: number) => {
        const thisStartX = startX;
        startX += getNewStartingX(child, startingIndex, lineBreaks);
        return (
          <SVGElementPhrasingContent
            blockIndex={blockIndex}
            key={i}
            node={child}
            startingIndex={startingIndex}
            startingX={thisStartX}
            startingY={startingY}
            firstChild={firstChild}
            firstLine={firstLine}
            lineBreaks={lineBreaks}
            lineBreaksWithHeights={lineBreaksWithHeights}
            textStyle={{ ...textStyle }}
            blockWidth={blockWidth}
          />
        );
      })}
    </>
  );
}
