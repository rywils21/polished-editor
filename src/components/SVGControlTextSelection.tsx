import React from "react";
import { Box, CharData } from "types";
import { SelectionRange } from "../types/index";

interface PropTypes {
  range: SelectionRange;
  charData: CharData[];
  blockIndex: number;
}

export const SVGControlTextSelection = ({
  range,
  charData,
  blockIndex,
}: PropTypes) => {
  const boxes: Box[] = [];

  let start = range.start;
  let end = range.end;

  if (
    start.block > end.block ||
    (start.block === end.block && start.offset > end.offset)
  ) {
    end = range.start;
    start = range.end;
  }

  if (
    start.block === blockIndex ||
    end.block === blockIndex ||
    (start.block <= blockIndex && end.block >= blockIndex)
  ) {
    let startIndex = start.offset;
    let endIndex = end.offset;

    if (start.block < blockIndex) {
      startIndex = -1;
    }

    if (end.block > blockIndex) {
      endIndex = charData.length - 1;
    }

    if (
      startIndex !== endIndex &&
      endIndex > -1 &&
      startIndex < charData.length
    ) {
      let currentBox: Box = {
        x: charData[0].x,
        y: charData[0].y,
        height: charData[0].height,
        width: 0,
      };

      if (startIndex > -1) {
        currentBox = {
          x: charData[startIndex].x + charData[startIndex].width,
          y: charData[startIndex].y,
          height: charData[startIndex].height,
          width: 0,
        };
      }

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const char = charData[i];

        if (currentBox.y === char.y) {
          // Same line extend the box
          currentBox.width += char.width;
        } else {
          boxes.push(currentBox);

          currentBox = {
            x: char.x,
            y: char.y,
            height: char.height,
            width: char.width,
          };
        }
      }

      boxes.push(currentBox);
    }
  }

  const display = boxes.map((box: Box, i: number) => (
    <rect
      key={`${i}-${range.start.block}-${range.start.offset}`}
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      fill="#67a7f0"
    />
  ));

  return <>{display}</>;
};
