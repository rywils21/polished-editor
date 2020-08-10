import { observer } from "mobx-react-lite";
import React, { useContext, useLayoutEffect } from "react";
import { AppContext } from "../index";
import { DocumentContext } from "./SVGElementDocument";
import { SVGControlTextCursor } from "./SVGControlTextCursor";
import { SVGElementGrammarHighlighting } from "./SVGElementGrammarHighlighting";
import { SelectionRange, TextStyle, AppData, CharData } from "../types/index";
import {
  Paragraph,
  Padding,
  Heading,
  PhrasingContent,
} from "../types/appTypes";
import {
  collectCharData,
  getWordDimensions,
  getLineBreaks,
  getLineBreaksWithHeights,
  getNewHeight,
} from "../misc/utls";
import { useTextStyle } from "../hooks/useTextStyle";
import { SVGControlTextSelection } from "./SVGControlTextSelection";
import { SVGElementPhrasingContent } from "./SVGElementPhrasingContent";
import { getNodeLength } from "../misc/utls";

interface PropTypes {
  blockIndex: number;
  node: Paragraph | Heading;
  width: number;
  padding: Padding;
  textStyle: TextStyle;
}

export const SVGElementBlock = observer(function SVGElementBlock({
  blockIndex,
  node,
  width,
  padding,
  textStyle,
}: PropTypes) {
  const appData = useContext<AppData>(AppContext);
  const { documentIndex } = useContext(DocumentContext);

  // TODO: refactor range out of here so these don't always rerender
  // console.log("rendering block: ", blockIndex);

  let appliedTextStyle = useTextStyle(node, textStyle);

  let { fontSize, lineHeight } = appliedTextStyle;

  let startingIndex = 0;

  const charData: CharData[] = collectCharData(node.children);
  const newWordData = getWordDimensions(charData, startingIndex);
  const lineBreaks = getLineBreaks(newWordData, width);
  const lineBreaksWithHeights = getLineBreaksWithHeights(
    charData,
    lineBreaks,
    appliedTextStyle
  );

  useLayoutEffect(() => {
    const newHeight = getNewHeight(
      charData,
      lineBreaks,
      fontSize,
      lineHeight,
      startingIndex
    );

    if (newHeight !== node.height) {
      node.height = newHeight;
    }
  }, [charData, lineBreaks, fontSize, lineHeight, node.height, startingIndex]);

  if (node.children) {
    let firstLineY = 0;
    if (lineBreaksWithHeights.length > 0) {
      firstLineY = lineBreaksWithHeights[0].lineY;
    }

    let ranges: SelectionRange[] = [];
    if (appData.activeWorkspace) {
      ranges = appData.activeWorkspace.selection.slice(0);
      if (appData.selecting) {
        ranges.push(appData.selecting);
      }

      // TODO: re-enable once cursor is working with new selection code
      // if (ranges.length > 0) {
      //   const range = ranges[0];
      //   if (
      //     appData.activeProfile.activeMode.editorEffects.document.text.fade
      //       .value === FadeTextValue.UNSELECTED_PARAGRAPH &&
      //     (range.start < startingIndex ||
      //       // @ts-ignore
      //       range.start > startingIndex + flattenNodesToText(nodes).length)
      //   ) {
      //     appliedTextStyle.opacity = 0.15;
      //   }
      // }
    }

    let subStartIndex = startingIndex;

    let startingX = 0;
    let startingY = 0;

    const display: any[] = [];
    let currentLine = 0;
    node.children.forEach((node: PhrasingContent, i: number) => {
      startingY = lineBreaksWithHeights[currentLine].lineY;
      const el = (
        <SVGElementPhrasingContent
          key={i}
          node={node}
          startingIndex={subStartIndex}
          startingX={startingX}
          startingY={startingY}
          firstChild={i === 0}
          firstLine={currentLine === 0}
          lineBreaks={lineBreaks}
          lineBreaksWithHeights={lineBreaksWithHeights}
          textStyle={{ ...appliedTextStyle }}
          blockIndex={blockIndex}
          blockWidth={width}
        />
      );
      const nodeLength = getNodeLength(node);

      if (startingIndex + charData.length > subStartIndex + nodeLength) {
        for (let i = subStartIndex; i < subStartIndex + nodeLength; i++) {
          startingX += charData[i - startingIndex].width;

          if (lineBreaks.indexOf(i) > -1) {
            startingX = 0;

            currentLine += 1;
          }
        }
      }
      subStartIndex += nodeLength;
      display.push(el);
    });

    return (
      <g className="SVGElementParagraph">
        {ranges.map((range: SelectionRange, i: number) => {
          if (documentIndex === range.documentIndex) {
            if (
              range.start.block === range.end.block &&
              range.start.offset === range.end.offset
            ) {
              return (
                <SVGControlTextCursor
                  key={`${range.start.block}-${range.start.offset}-${i}`}
                  blockIndex={blockIndex}
                  range={range}
                  charData={charData}
                  lineBreaks={lineBreaks}
                  textStyle={appliedTextStyle}
                  firstLineY={firstLineY}
                />
              );
            } else {
              return (
                <SVGControlTextSelection
                  key={`${range.start}-${i}`}
                  range={range}
                  charData={charData}
                  blockIndex={blockIndex}
                />
              );
            }
          } else {
            return null;
          }
        })}
        <SVGElementGrammarHighlighting charData={charData} />
        <g className="SVGElementPhrasingContent">{display}</g>
      </g>
    );
  }

  throw new Error("Block element did not have any children");
});
