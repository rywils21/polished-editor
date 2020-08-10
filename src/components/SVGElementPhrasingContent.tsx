/** @jsx jsx */
import { jsx } from "theme-ui";
import {
  Emphasis,
  PhrasingContent,
  Strong,
  Text,
  Delete,
  Link,
  Image,
} from "types/appTypes";
import { mdNodeType } from "types/mdastTypes";
import { SVGElementEmphasis } from "./SVGElementEmphasis";
import { SVGElementStrong } from "./SVGElementStrong";
import { SVGElementText } from "./SVGElementText";
import { SVGElementDelete } from "./SVGElementDelete";
import { SVGElementLink } from "./SVGElementLink";
import { TextStyle } from "types";
import { SVGElementImage } from "./SVGElementImage";
import { LineBreakWithHeight } from "misc/utls";

interface PropTypes {
  blockIndex: number;
  node: PhrasingContent;
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

export function SVGElementPhrasingContent({
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
  if (node.type === mdNodeType.TEXT) {
    return (
      <SVGElementText
        node={node as Text}
        startingIndex={startingIndex}
        startingX={startingX}
        startingY={startingY}
        firstChild={firstChild}
        firstLine={firstLine}
        lineBreaks={lineBreaks}
        lineBreaksWithHeights={lineBreaksWithHeights}
        textStyle={textStyle}
        blockIndex={blockIndex}
        blockWidth={blockWidth}
      />
    );
  } else if (node.type === mdNodeType.STRONG) {
    return (
      <SVGElementStrong
        blockIndex={blockIndex}
        node={node as Strong}
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
  } else if (node.type === mdNodeType.EMPHASIS) {
    return (
      <SVGElementEmphasis
        blockIndex={blockIndex}
        node={node as Emphasis}
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
  } else if (node.type === mdNodeType.DELETE) {
    return (
      <SVGElementDelete
        blockIndex={blockIndex}
        node={node as Delete}
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
  } else if (node.type === mdNodeType.LINK) {
    return (
      <SVGElementLink
        blockIndex={blockIndex}
        node={node as Link}
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
  } else if (node.type === mdNodeType.IMAGE) {
    return (
      <SVGElementImage
        node={node as Image}
        startingIndex={startingIndex}
        startingX={startingX}
        startingY={startingY}
        textStyle={{ ...textStyle }}
        lineBreaks={lineBreaks}
        lineBreaksWithHeights={lineBreaksWithHeights}
      />
    );
  }
  return null;
}
