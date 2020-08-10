/** @jsx jsx */
import { jsx } from "theme-ui";

import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { AppData, CharData } from "types";
import { AppContext } from "../index";
import { GrammarEffectStatus } from "types/editorEffects";

import writeGood from "write-good";

interface PropTypes {
  charData: CharData[];
}

export const SVGElementGrammarHighlighting = observer(
  function SVGElementGrammarHighlighting({ charData }: PropTypes) {
    const appData = useContext<AppData>(AppContext);

    let text = "";
    charData.forEach((char: CharData) => {
      text += char.char;
    });
    const grammarResults = writeGood(text);

    const display: any[] = [];

    if (
      appData.activeProfile.activeMode.editorEffects.document.grammar.status ===
      GrammarEffectStatus.ENABLED
    ) {
      grammarResults.forEach(
        ({
          index,
          offset,
          reason,
        }: {
          index: number;
          offset: number;
          reason: string;
        }) => {
          if (index < charData.length && offset <= charData.length) {
            const boxes: any = [];
            const startingChar = charData[index];
            let currentBox = {
              x: startingChar.x,
              y: startingChar.y,
              height: startingChar.height,
              width: startingChar.width,
            };

            for (let i = index + 1; i < index + offset; i++) {
              const currentChar = charData[i];

              if (currentChar.y !== currentBox.y) {
                boxes.push(currentBox);
                currentBox = {
                  x: currentChar.x,
                  y: currentChar.y,
                  height: currentChar.height,
                  width: currentChar.width,
                };
              } else {
                currentBox.width += currentChar.width;
              }
            }
            boxes.push(currentBox);

            boxes.forEach(
              (box: {
                x: number;
                y: number;
                width: number;
                height: number;
              }) => {
                display.push(
                  <rect
                    key={`${index}-${reason}`}
                    sx={{ opacity: 0.1, fill: "red" }}
                    width={box.width}
                    height={box.height}
                    x={box.x}
                    y={box.y}
                  />
                );
              }
            );
          }
        }
      );
    }

    return <React.Fragment>{display}</React.Fragment>;
  }
);
