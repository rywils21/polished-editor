import React, {
  useCallback,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { useCancellingInterval } from "../hooks/useInterval";
import { CharData, TextStyle } from "types";
import { AppContext } from "../index";
import { Autoscroll } from "types/editorEffects";
import { SelectionRange } from "../types/index";

interface PropTypes {
  blockIndex: number;
  range: SelectionRange;
  charData: CharData[];
  lineBreaks: number[];
  textStyle: TextStyle;
  firstLineY: number;
}

export const SVGControlTextCursor = ({
  blockIndex,
  range,
  charData,
  lineBreaks,
  textStyle,
  firstLineY,
}: PropTypes) => {
  const [color, setColor] = useState("black");

  const toggleColor = useCallback(() => {
    setColor((color) => (color === "black" ? "transparent" : "black"));
  }, []);

  const appData = useContext(AppContext);

  useCancellingInterval(toggleColor, 500, range.start);

  const { fontSize, lineHeight } = textStyle;

  let x = 0;
  let y = firstLineY;
  let height = fontSize * lineHeight;

  if (
    range.start.block === range.end.block &&
    range.start.offset === range.end.offset &&
    range.start.block === blockIndex &&
    charData.length > 0
  ) {
    if (range.start.offset === -1) {
      x = charData[0].x;
      y = charData[0].y;
      height = fontSize * lineHeight;
    } else {
      const i = range.start.offset;

      if (i < charData.length) {
        if (false) {
          // char === " " && lineBreaks.indexOf(range.start - 1) > -1) {
          x = charData[i + 1].x;
          y = charData[i + 1].y;
          height = charData[i + 1].height;
        } else {
          x = charData[i].x + charData[i].width;
          y = charData[i].y;
          height = fontSize * lineHeight;
        }
      }
    }
  }

  const ref = useRef<SVGRectElement>(null);

  useLayoutEffect(() => {
    if (
      ref &&
      ref.current !== null &&
      appData.activeProfile.activeMode.editorEffects.canvas.autoscroll.value ===
        Autoscroll.TYPEWRITER &&
      appData.activeWorkspace &&
      range.start.block === blockIndex
    ) {
      const bound = ref.current.getBoundingClientRect();
      // @ts-ignore
      const offsetY = Math.round(bound.y) - window.innerHeight / 3;

      if (
        Math.round(offsetY) >
        fontSize * lineHeight * appData.activeWorkspace.view.zoom - 1
      ) {
        appData.activeWorkspace.view.y -= offsetY;
      }
    }
  }, [
    x,
    y,
    ref,
    appData.activeProfile.activeMode.editorEffects.canvas.autoscroll.value,
    appData.activeWorkspace,
    fontSize,
    lineHeight,
    range.start.block,
    blockIndex,
  ]);

  if (
    range.start.block === range.end.block &&
    range.start.offset === range.end.offset &&
    range.start.block === blockIndex
  ) {
    return (
      <rect ref={ref} x={x} y={y} height={height} width={1} fill={color} />
    );
  } else {
    return null;
  }
};
