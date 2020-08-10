import React from "react";
import { PhrasingContent, Delete } from "types/appTypes";
import { SVGElementPhrasingContent } from "./SVGElementPhrasingContent";
import { TextStyle } from "types";
import { LineBreakWithHeight } from "misc/utls";

interface PropTypes {
  blockIndex: number;
  node: Delete;
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

export function SVGElementDelete({
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
  textStyle.textDecoration = "line-through";

  return (
    <>
      {node.children.map((child: PhrasingContent, i: number) => {
        return (
          <SVGElementPhrasingContent
            blockIndex={blockIndex}
            key={i}
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
    </>
  );
}
