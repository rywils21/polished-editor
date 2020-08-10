import { getNodeLength } from "./../misc/utls";
import { Heading, Strong, Emphasis, Delete, Text } from "types/appTypes";
import { useState, useLayoutEffect } from "react";
import { AppData } from "types";
import { mdNodeType } from "types/mdastTypes";
import { SelectionRange } from "../types/index";

export function useSpecialCharacters(
  node: Heading | Strong | Emphasis | Delete,
  startingIndex: number,
  selection: SelectionRange[],
  appData: AppData,
  documentIndex: number
) {
  const [cursorRelation, setCursorRelation] = useState<
    "idle" | "justentered" | "inside" | "justleft"
  >("idle");

  const selectionValues = JSON.stringify(selection);

  let specialInsertion = "";
  let surround = false;
  if (node.type === mdNodeType.HEADING) {
    specialInsertion = "#".repeat(node.depth) + " ";
    surround = false;
  } else if (node.type === mdNodeType.STRONG) {
    specialInsertion = "__";
    surround = true;
  } else if (node.type === mdNodeType.EMPHASIS) {
    specialInsertion = "*";
    surround = true;
  } else if (node.type === mdNodeType.DELETE) {
    specialInsertion = "~~";
    surround = true;
  }

  useLayoutEffect(() => {
    let cursorInHere = false;
    selection.forEach((range: SelectionRange) => {
      // TODO: convert to new range object
      // if (
      //   range.start >= startingIndex &&
      //   range.start <= startingIndex + getNodeLength(node) &&
      //   range.documentIndex === documentIndex
      // ) {
      //   cursorInHere = true;
      // }
    });

    if (cursorInHere && cursorRelation === "idle") {
      setCursorRelation("justentered");
      insertSpecialCharacters(node, specialInsertion, surround);

      // Set timeout holds off cursor shift until next render. Otherwise, you get a jumpy cursor
      setTimeout(() => {
        selection.forEach((range: SelectionRange) => {
          // TODO: convert to new range objects
          // if (range.start >= startingIndex) {
          //   range.start += specialInsertion.length;
          //   range.end += specialInsertion.length;
          // }
        });
      });
    } else if (cursorInHere && cursorRelation === "justentered") {
      setCursorRelation("inside");
    } else if (!cursorInHere && cursorRelation === "inside") {
      setCursorRelation("justleft");
      removeSpecialCharacters(
        node,
        specialInsertion,
        surround,
        selection,
        startingIndex,
        appData
      );
    } else if (!cursorInHere && cursorRelation === "justleft") {
      setCursorRelation("idle");
    }
  }, [
    selection,
    selectionValues,
    node,
    cursorRelation,
    startingIndex,
    appData.activeWorkspace,
    specialInsertion,
    surround,
    documentIndex,
    appData,
  ]);
}

function insertSpecialCharacters(
  node: Heading | Strong | Emphasis | Delete,
  specialInsertion: string,
  surround: boolean
) {
  let firstTextNode = node.children[0];
  while (firstTextNode.type !== mdNodeType.TEXT && firstTextNode.children) {
    // @ts-ignore
    firstTextNode = firstTextNode.children[0];
  }

  if (firstTextNode.value !== undefined) {
    firstTextNode.value = `${specialInsertion}${firstTextNode.value}`;
  }

  if (surround) {
    let lastTextNode = node.children[node.children.length - 1];
    while (lastTextNode.type !== mdNodeType.TEXT && lastTextNode.children) {
      // @ts-ignore
      lastTextNode = lastTextNode.children[lastTextNode.children.length - 1];
    }

    if (lastTextNode.value !== undefined) {
      lastTextNode.value = `${lastTextNode.value}${specialInsertion}`;
    }
  }
}

function removeSpecialCharacters(
  node: Heading | Strong | Emphasis | Delete,
  specialInsertion: string,
  surround: boolean,
  selection: SelectionRange[],
  startingIndex: number,
  appData: AppData
) {
  if (node.type === mdNodeType.HEADING) {
    // @ts-ignore
    node.type = mdNodeType.PARAGRAPH;

    if (selection.length > 0) {
      // TODO: this needs to be reworked when supporting multiple cursors
      const range = selection[0];
      // TODO: refactor this with the new selection object
      // appData.activeWorkspace?.documents[range.documentIndex].processMarkdown(
      //   range
      // );
    }
  } else {
    let firstTextNode = node.children[0];
    while (firstTextNode.type !== mdNodeType.TEXT && firstTextNode.children) {
      // @ts-ignore
      firstTextNode = firstTextNode.children[0];
    }
    let lastTextNode = node.children[node.children.length - 1];
    while (lastTextNode.type !== mdNodeType.TEXT && lastTextNode.children) {
      // @ts-ignore
      lastTextNode = lastTextNode.children[lastTextNode.children.length - 1];
    }

    let hadSpecialChars = true;

    if (surround) {
      if (
        firstTextNode.value !== undefined &&
        firstTextNode.value.startsWith(specialInsertion) &&
        lastTextNode.value !== undefined &&
        lastTextNode.value.endsWith(specialInsertion)
      ) {
        firstTextNode.value = firstTextNode.value.slice(
          specialInsertion.length
        );
        lastTextNode.value = lastTextNode.value.slice(
          0,
          lastTextNode.value.length - specialInsertion.length
        );
      } else {
        hadSpecialChars = false;
      }
    } else {
      if (
        firstTextNode.value !== undefined &&
        firstTextNode.value.startsWith(specialInsertion)
      ) {
        firstTextNode.value = firstTextNode.value.slice(
          specialInsertion.length
        );
      } else {
        hadSpecialChars = false;
      }
    }

    if (hadSpecialChars) {
      selection.forEach((range: SelectionRange) => {
        // TODO: convert to new range object
        // if (range.start >= startingIndex) {
        //   range.start -= specialInsertion.length;
        //   range.end -= specialInsertion.length;
        // }
        // if (range.start >= startingIndex + getNodeLength(node)) {
        //   range.start -= specialInsertion.length;
        //   range.end -= specialInsertion.length;
        // }
      });
    } else {
      const cursorChange = convertToTextNode(node);
      selection.forEach((range: SelectionRange) => {
        // TODO: convert to new range object
        // if (range.start >= startingIndex) {
        //   range.start -= cursorChange;
        //   range.end -= cursorChange;
        // }
      });

      if (selection.length > 0) {
        // TODO: this needs to be reworked when supporting multiple cursors
        const range = selection[0];
        // TODO: refactor this with the new selection object
        // appData.activeWorkspace?.documents[range.documentIndex].processMarkdown(
        //   range
        // );
      }
    }
  }
}

function convertToTextNode(node: Strong | Emphasis | Delete): number {
  const originalLength = getNodeLength(node);
  const plainText = flattenNodeToText(node, 0);
  // @ts-ignore
  node.type = mdNodeType.TEXT;
  node.value = plainText;
  // @ts-ignore
  node.charData = [];
  // @ts-ignore
  delete node.children;

  return originalLength - plainText.length;
}

// stringifies a node into text based on children
function flattenNodeToText(
  node: Strong | Emphasis | Delete | Text,
  depth: number
): string {
  let result = "";

  // Append before content of node
  if (depth !== 0) {
    if (node.type === mdNodeType.STRONG) {
      result += "__";
    } else if (node.type === mdNodeType.EMPHASIS) {
      result += "*";
    } else if (node.type === mdNodeType.DELETE) {
      result += "~~";
    }
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      // @ts-ignore
      result += flattenNodeToText(node.children[i], depth + 1);
    }
  } else if (node.value) {
    result += node.value;
  }

  // Append after content of node
  if (depth !== 0) {
    if (node.type === mdNodeType.STRONG) {
      result += "__";
    } else if (node.type === mdNodeType.EMPHASIS) {
      result += "*";
    } else if (node.type === mdNodeType.DELETE) {
      result += "~~";
    }
  }

  return result;
}
