import { PhrasingContent } from "types/appTypes";
import { Content } from "types/appTypes";
import { mdNodeType } from "types/mdastTypes";
import { AppData, CharData, WordData, TextStyle } from "types";
import { centerViewOnPosition } from "hooks/useData";

export function getNodeLength(node: Content, listDepth: number = 0): number {
  let length = 0;

  if (node.type === mdNodeType.LIST && node.children) {
    node.children.forEach((child: Content, i: number) => {
      length += getNodeLength(child, listDepth + 1) + 1;
    });
  } else if (node.children) {
    node.children.forEach((child: Content) => {
      length += getNodeLength(child, listDepth);
    });
  } else if (node.value !== undefined) {
    length = node.value.length;
  } else if (node.type === mdNodeType.IMAGE) {
    length = 1;
  }

  return length;
}

export function focusDocument(data: AppData, activeDocumentIndex: number) {
  if (data.activeWorkspace) {
    const doc = data.activeWorkspace.documents[activeDocumentIndex];

    centerViewOnPosition(data, doc.position);

    data.activeWorkspace.selection = [
      {
        documentIndex: activeDocumentIndex,
        start: {
          block: 0,
          offset: -1,
        },
        end: {
          block: 0,
          offset: -1,
        },
      },
    ];
  }
}

export function focusBrowser(data: AppData, activeBrowserIndex: number) {
  if (data.activeWorkspace) {
    const browser = data.activeWorkspace.browsers[activeBrowserIndex];
    const { zoom } = data.activeWorkspace.view;

    data.activeWorkspace.view.x =
      window.innerWidth / 2 - (browser.width / 2 + browser.position.x) * zoom;
    data.activeWorkspace.view.y = -1 * browser.position.y + 200;
  }
}

// TEXT measurement stuff
export interface LineBreakWithHeight {
  index: number;
  lineY: number;
}

export function getLineBreaksWithHeights(
  charData: CharData[],
  lineBreaks: number[],
  textStyle: TextStyle
): LineBreakWithHeight[] {
  const lineBreaksWithHeights: LineBreakWithHeight[] = [];

  const { fontSize, lineHeight } = textStyle;

  let currentLine = 0;
  let startingY = 0;

  let startOfLineIndex = 0;

  // If image in first line, adjust startingX
  while (currentLine <= lineBreaks.length) {
    let endOfLineIndex =
      lineBreaks.length > currentLine
        ? lineBreaks[currentLine] + 1
        : charData.length;

    let lineHasImage = false;
    let tallestImage = 0;

    // Process the y for the first line
    for (let i = startOfLineIndex; i < endOfLineIndex; i++) {
      const char = charData[i];
      if (char && char.type === "image") {
        lineHasImage = true;
        tallestImage = char.height;
      }
    }

    if (lineHasImage) {
      startingY += tallestImage; // + 2 * ((fontSize * lineHeight) / 2 - fontSize / 2);
    } else if (currentLine > 0) {
      if (currentLine === 0) {
        startingY +=
          fontSize * lineHeight - ((fontSize * lineHeight) / 2 - fontSize / 2);
      } else {
        startingY += fontSize * lineHeight;
      }
    }

    lineBreaksWithHeights.push({
      index: endOfLineIndex,
      lineY: startingY,
    });

    lineHasImage = false;
    tallestImage = 0;
    currentLine += 1;
    startOfLineIndex = endOfLineIndex;
  }

  return lineBreaksWithHeights;
}

export function getNewStartingX(
  node: PhrasingContent,
  startingIndex: number,
  lineBreaks: number[]
): number {
  const charData = collectCharData([node]);
  let newStartingX = 0;

  for (let i = 0; i < charData.length; i++) {
    newStartingX += charData[i].width;

    if (lineBreaks.indexOf(i + startingIndex) > -1) {
      newStartingX = 0;
    }
  }

  return newStartingX;
}

export function getNewHeight(
  charData: CharData[],
  lineBreaks: number[],
  fontSize: number,
  lineHeight: number,
  startingIndex: number
): number {
  let startIndex = startingIndex;
  let height = 0;

  // TODO: figure out how to add lineheight for the last line
  const indexesToCheck = [...lineBreaks, startingIndex + charData.length];
  // const indexesToCheck = [...lineBreaks];

  for (let i = 0; i < indexesToCheck.length; i++) {
    const lineBreakIndex = indexesToCheck[i];
    let hasImage = false;
    let tallestImageHeight = 0;
    for (let j = startIndex; j < lineBreakIndex; j++) {
      const char = charData[j - startingIndex];
      if (char.type === "image") {
        hasImage = true;
        tallestImageHeight = char.height;
      }
    }
    if (hasImage) {
      height += tallestImageHeight;
    } else {
      height += fontSize * lineHeight;
    }

    startIndex = lineBreakIndex;
  }

  return height;
}

export function collectCharData(nodes: PhrasingContent[]): CharData[] {
  let charData: CharData[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === mdNodeType.TEXT) {
      charData = [...charData, ...node.charData];
    } else if (node.type === mdNodeType.IMAGE) {
      charData = [...charData, node.charData];
    } else if (node.children) {
      // @ts-ignore
      const childCharData = collectCharData(node.children);
      charData = [...charData, ...childCharData];
    }
  }

  return charData;
}

export function getWordDimensions(
  charData: CharData[],
  startingIndex: number
): WordData[] {
  const words: WordData[] = [];

  let currentWord: WordData = {
    word: "",
    isWhiteSpace: false,
    start: startingIndex,
    end: startingIndex,
    length: 0,
    width: 0,
  };

  if (charData && charData.length > 0) {
    for (let i = 0; i < charData.length; i++) {
      const char = charData[i];

      if (
        (currentWord.isWhiteSpace && char.char !== " ") ||
        (!currentWord.isWhiteSpace && char.char === " ")
      ) {
        if (currentWord.length > 0) {
          words.push(currentWord);
        }
        if (char.char === " ") {
          currentWord = {
            word: "",
            isWhiteSpace: true,
            start: startingIndex + i,
            end: startingIndex + i,
            length: 0,
            width: 0,
          };
        } else {
          currentWord = {
            word: "",
            isWhiteSpace: false,
            start: startingIndex + i,
            end: startingIndex + i,
            length: 0,
            width: 0,
          };
        }
      }

      currentWord.word += char.char;
      currentWord.end = startingIndex + i;
      currentWord.length += 1;
      currentWord.width += char.width;
    }

    if (currentWord.length > 0) {
      words.push(currentWord);
    }
  }

  return words;
}

export function getLineBreaks(words: WordData[], width: number): number[] {
  const lineBreaks: number[] = [];
  let currentWidth = 0;

  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    const nextWord = i < words.length - 1 ? words[i + 1] : null;

    if (
      nextWord !== null &&
      currentWord.isWhiteSpace &&
      currentWidth + currentWord.width + nextWord.width > width
    ) {
      // The word is whitespace and there won't be room for the next word
      // Add current word end as the line break
      lineBreaks.push(currentWord.end);
      currentWidth = 0;
    } else if (currentWord.width > width) {
      // Really long word case
    } else {
      // word fits
      currentWidth += currentWord.width;
    }
  }

  return lineBreaks;
}
