import React, { useRef, useLayoutEffect } from "react";
import { Image } from "types/appTypes";
import { TextStyle } from "types";
import { LineBreakWithHeight } from "misc/utls";

interface PropTypes {
  node: Image;
  startingIndex: number;
  startingX: number;
  startingY: number;
  textStyle: TextStyle;
  lineBreaks: number[];
  lineBreaksWithHeights: LineBreakWithHeight[];
}

export function SVGElementImage({
  node,
  startingIndex,
  startingX,
  startingY,
  textStyle,
  lineBreaksWithHeights,
}: PropTypes) {
  const imgRef = useRef<SVGImageElement>(null);

  useLayoutEffect(() => {
    if (imgRef && imgRef.current) {
      // const rect = imgRef.current.getBoundingClientRect();
      // TODO: Set the char data here in case we need the x, y
      // Definitely needed once resizing is a thing
    }
  }, [node]);

  return (
    <g transform={`translate(${startingX} ${startingY - node.height})`}>
      <image
        ref={imgRef}
        preserveAspectRatio="xMidYMid slice"
        href={node.url}
        x="0"
        y="0"
        height={node.height}
        width={node.width}
      />
    </g>
  );
}
