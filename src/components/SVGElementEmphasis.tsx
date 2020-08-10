import React from "react";
import { Emphasis, PhrasingContent } from "types/appTypes";
import { SVGElementPhrasingContent } from "./SVGElementPhrasingContent";
import { TextStyle } from "types";
import { LineBreakWithHeight } from "misc/utls";

interface PropTypes {
  blockIndex: number;
  node: Emphasis;
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

export function SVGElementEmphasis({
  blockIndex,
  node,
  startingIndex,
  startingX,
  startingY,
  firstChild,
  firstLine,
  lineBreaks,
  lineBreaksWithHeights,
  blockWidth,
  textStyle,
}: PropTypes) {
  textStyle.fontStyle = "italic";

  return (
    <>
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
            textStyle={{ ...textStyle }}
            blockWidth={blockWidth}
          />
        );
      })}
    </>
  );
}
