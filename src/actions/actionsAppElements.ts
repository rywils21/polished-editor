import { getNodeLength } from "misc/utls";
import { toJS } from "mobx";
import {
  Content,
  DocumentRoot,
  List,
  ListItem,
  TopLevelContent,
  Text,
} from "types/appTypes";
import { mdNodeType } from "types/mdastTypes";
import { SelectionRange } from "../types/index";
import {
  Paragraph,
  Heading,
  PhrasingContent,
  BlockContent,
} from "../types/appTypes";
import {
  createParagraphFromApp,
  createDocumentRoot,
} from "./creatorAppElements";
import { markdownProcessor } from "../hooks/useData";

import {
  createEmptyList,
  createNewListItem,
  createTextFromValue,
} from "./creatorAppElements";

// Formula for traversing blocks
//
// let i = 0;
// let currentBlockIndex = 0;
// while (i < root.children.length) {
//   const currentTopLevelBlock = root.children[i];
//   if (currentTopLevelBlock.type === mdNodeType.LIST) {
//     const listBlocks = flattenList(currentTopLevelBlock);
//     const lastBlockIndex = currentBlockIndex + listBlocks.length - 1;
//     for (let j = 0; j < currentBlock.children.length; j++) {
//       const currentListItem = currentBlock.children[j];
//       yourRecursiveFunc(currentListItem, range, blockIndex);
//     }
//     currentBlockIndex = lastBlockIndex + 1;
//   } else if (
//     currentTopLevelBlock.type === mdNodeType.HEADING ||
//     currentTopLevelBlock.type === mdNodeType.PARAGRAPH
//   ) {
//     currentBlockIndex += 1;
//   }
//   i++;
// }

export function processMarkdown(
  node: DocumentRoot | ListItem,
  range: SelectionRange,
  blockIndex: number
) {
  let i = 0;

  while (i < node.children.length) {
    const currentBlock = node.children[i];

    if (currentBlock.type === mdNodeType.LIST) {
      for (let j = 0; j < currentBlock.children.length; j++) {
        const currentListItem = currentBlock.children[j];
        processMarkdown(currentListItem, range, blockIndex);

        const listItemBlocks = flattenListItem(currentListItem);
        blockIndex += listItemBlocks.length;
      }
    } else if (
      currentBlock.type === mdNodeType.HEADING ||
      currentBlock.type === mdNodeType.PARAGRAPH
    ) {
      if (blockIndex === range.start.block) {
        // @ts-ignore
        const stringified = markdownProcessor.stringify(currentBlock);
        // This returns a document root
        const parsed = markdownProcessor.parse(stringified);
        const docRoot = createDocumentRoot(
          // @ts-ignore
          parsed,
          { x: 0, y: 0 }
        );

        if (docRoot.children.length > 0) {
          const newChild = docRoot.children[0];

          if (currentBlock.type === mdNodeType.PARAGRAPH) {
            node.children.splice(i, 1, newChild);
          } else if (
            currentBlock.type === mdNodeType.HEADING &&
            newChild.type === mdNodeType.PARAGRAPH
          ) {
            currentBlock.children = newChild.children;
          }
        }

        i = node.children.length;
      }

      blockIndex += 1;
    }

    i++;
  }
}

export function arrowLeft(root: DocumentRoot, range: SelectionRange) {
  if (
    range.start.block !== range.end.block ||
    (range.start.block === range.end.block &&
      range.start.offset !== range.end.offset)
  ) {
    range.end = { ...range.start };
  } else if (range.start.block >= 0 && range.start.offset > -1) {
    range.start.offset -= 1;
    range.end.offset -= 1;
  } else if (range.start.block > 0) {
    const newBlockIndex = range.start.block - 1;

    range.start.block = newBlockIndex;
    range.end.block = newBlockIndex;

    const newOffset = getEndOffset(root, newBlockIndex);

    console.log("newoffset: ", newOffset, newBlockIndex);

    range.start.offset = newOffset;
    range.end.offset = newOffset;
  }
}

export function arrowRight(root: DocumentRoot, range: SelectionRange) {
  const blocks = flattenListTreeToBlocks(root);

  if (
    range.start.block !== range.end.block ||
    (range.start.block === range.end.block &&
      range.start.offset !== range.end.offset)
  ) {
    range.start = { ...range.end };
  } else if (
    range.start.block < blocks.length &&
    range.start.offset < getNodeLength(blocks[range.start.block]) - 1
  ) {
    range.start.offset += 1;
    range.end.offset += 1;
  } else if (range.start.block < blocks.length - 1) {
    const newBlockIndex = range.start.block + 1;

    range.start.block = newBlockIndex;
    range.end.block = newBlockIndex;

    range.start.offset = -1;
    range.end.offset = -1;
  }
}

export function arrowUp(root: DocumentRoot, range: SelectionRange) {
  const blocks = flattenListTreeToBlocks(root);
  if (
    range.start.block !== range.end.block ||
    (range.start.block === range.end.block &&
      range.start.offset !== range.end.offset)
  ) {
    range.end = { ...range.start };
  } else if (range.start.block > 0) {
    const atEnd =
      getNodeLength(blocks[range.start.block]) - 1 === range.start.offset;
    range.start.block -= 1;
    range.end.block -= 1;

    const blockLength = getNodeLength(blocks[range.start.block]) - 1;

    if (range.start.offset > blockLength || atEnd) {
      range.start.offset = blockLength;
      range.end.offset = blockLength;
    }
  } else if (range.start.block === 0) {
    range.start.offset = -1;
    range.end.offset = -1;
  }
}

export function arrowDown(root: DocumentRoot, range: SelectionRange) {
  const blocks = flattenListTreeToBlocks(root);

  if (
    range.start.block !== range.end.block ||
    (range.start.block === range.end.block &&
      range.start.offset !== range.end.offset)
  ) {
    range.start = { ...range.end };
  } else if (range.start.block < blocks.length - 1) {
    const atEnd =
      getNodeLength(blocks[range.start.block]) - 1 === range.start.offset;
    range.start.block += 1;
    range.end.block += 1;

    const blockLength = getNodeLength(blocks[range.start.block]) - 1;

    if (range.start.offset > blockLength || atEnd) {
      range.start.offset = blockLength;
      range.end.offset = blockLength;
    }
  } else if (range.start.block === blocks.length - 1) {
    const blockLength = getNodeLength(blocks[range.start.block]) - 1;
    range.start.offset = blockLength;
    range.end.offset = blockLength;
  }
}

function getEndOffset(root: DocumentRoot, blockIndex: number) {
  const flattenedTree = flattenListTreeToBlocks(root);

  return getNodeLength(flattenedTree[blockIndex]) - 1;
}

export function flattenListTreeToBlocks(
  root: DocumentRoot
): (Paragraph | Heading)[] {
  let result: (Paragraph | Heading)[] = [];

  result = root.children.flatMap((node: TopLevelContent) => {
    if (
      node.type === mdNodeType.PARAGRAPH ||
      node.type === mdNodeType.HEADING
    ) {
      return node;
    } else {
      return flattenList(node);
    }
  });

  return result;
}

function flattenListItem(listItem: ListItem): (Paragraph | Heading)[] {
  let result: (Paragraph | Heading)[] = [];

  result = listItem.children.flatMap((node: TopLevelContent) => {
    if (
      node.type === mdNodeType.PARAGRAPH ||
      node.type === mdNodeType.HEADING
    ) {
      return node;
    } else {
      return flattenList(node);
    }
  });

  return result;
}

function flattenList(list: List): (Paragraph | Heading)[] {
  let result: (Paragraph | Heading)[] = [];

  result = list.children.flatMap((listItem: ListItem) => {
    return listItem.children.flatMap((node: TopLevelContent) => {
      if (
        node.type === mdNodeType.PARAGRAPH ||
        node.type === mdNodeType.HEADING
      ) {
        return node;
      } else {
        return flattenList(node);
      }
    });
  });

  return result;
}

function insertKeyInNode(
  node: Content,
  range: SelectionRange,
  key: string,
  currentIndex: number
): void {
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const currentNode = node.children[i];
      const nodeLength = getNodeLength(currentNode);
      let endingIndex = currentIndex + nodeLength;

      // This is in case there is an empty string node next, we want to insert in the empty string instead of the end of this one
      let skipToNext: boolean = false;
      if (i < node.children.length - 1) {
        const nextNode = node.children[i + 1];
        let nextLength = getNodeLength(nextNode);
        if (nextLength === 0) {
          skipToNext = true;
        }
      }

      if (
        // The offset is after the start and before the end of the current child
        (range.start.offset > currentIndex &&
          range.start.offset <= endingIndex) ||
        // It is the first node and the offset is the currentIndex
        (i === 0 && range.start.offset === currentIndex) ||
        // Nodelength is zero and the offset is the currentIndex
        (nodeLength === 0 &&
          range.start.offset === currentIndex &&
          // The next node is not empty
          !skipToNext)
      ) {
        if (currentNode.value !== undefined) {
          // It is a text node, insert the key
          const sliceIndex = range.start.offset - currentIndex;
          const firstHalf = currentNode.value.slice(0, sliceIndex);
          const secondHalf = currentNode.value.slice(sliceIndex);

          // Update the node and range
          currentNode.value = `${firstHalf}${key}${secondHalf}`;
          break;
        } else if (currentNode.children) {
          insertKeyInNode(currentNode, range, key, currentIndex);
        }
      }

      currentIndex = endingIndex;
    }
  }
}

export function insertKey(
  root: DocumentRoot,
  range: SelectionRange,
  key: string
): void {
  const blocks = flattenListTreeToBlocks(root);

  if (
    range.start.block === range.end.block &&
    range.start.offset === range.end.offset
  ) {
    const blockToInsert = blocks[range.start.block];

    insertKeyInNode(blockToInsert, range, key, -1);

    range.start.offset += 1;
    range.end.offset += 1;
  }
}

function mergeNodesAfterDelete(
  parent: Content,
  range: SelectionRange,
  blockIndex: number
): {
  blockIndex: number;
  firstMergeElement: Paragraph | Heading | null;
  secondMergeElement: Paragraph | Heading | null;
} {
  let firstMergeElement: Paragraph | Heading | null = null;
  let secondMergeElement: Paragraph | Heading | null = null;

  if (parent.children) {
    let i = 0;
    while (blockIndex <= range.end.block && i < parent.children.length) {
      const currentChild = parent.children[i];

      if (currentChild.type === mdNodeType.LIST) {
        if (currentChild.children) {
          let j = 0;
          while (
            blockIndex <= range.end.block &&
            j < currentChild.children.length
          ) {
            const currentListItem = currentChild.children[j];

            const result = mergeNodesAfterDelete(
              currentListItem,
              range,
              blockIndex
            );

            if (currentListItem.children.length === 0) {
              currentChild.children.splice(j, 1);
              j--;
            }

            blockIndex = result.blockIndex;

            if (blockIndex <= range.end.block && result.firstMergeElement) {
              firstMergeElement = result.firstMergeElement;
            }

            if (
              blockIndex >= range.end.block &&
              result.secondMergeElement !== null
            ) {
              secondMergeElement = result.secondMergeElement;
            }

            j++;
          }
        }
      } else if (
        currentChild.type === mdNodeType.HEADING ||
        currentChild.type === mdNodeType.PARAGRAPH
      ) {
        if (blockIndex === range.start.block) {
          firstMergeElement = currentChild;
        } else if (
          blockIndex > range.start.block &&
          blockIndex < range.end.block
        ) {
          parent.children.splice(i, 1);
          i--;
        } else if (blockIndex === range.end.block) {
          secondMergeElement = currentChild;

          parent.children.splice(i, 1);
          i--;
        }

        blockIndex += 1;
      }

      i++;
    }
  }

  if (firstMergeElement !== null && secondMergeElement !== null) {
    // merge them and set them to null
    firstMergeElement.children = [
      ...firstMergeElement.children,
      ...secondMergeElement.children,
    ];
  }

  return { blockIndex, firstMergeElement, secondMergeElement };
}

function consolidateListNodes(node: DocumentRoot | ListItem) {
  if (node.children) {
    let i = 0;
    while (i < node.children.length) {
      const currentChild = node.children[i];

      if (currentChild.type === mdNodeType.LIST) {
        if (currentChild.children.length > 0) {
          let j = 0;
          while (j < currentChild.children.length) {
            const currentListItem = currentChild.children[j];

            let k = 0;
            while (k < currentListItem.children.length) {
              const currentListItemChild = currentListItem.children[k];

              if (currentListItemChild.type === mdNodeType.LIST) {
                consolidateListNodes(currentListItem);
              }

              k++;
            }

            if (
              isNodeEmpty(currentListItem) &&
              !(
                currentListItem.children.length === 1 &&
                currentListItem.children[0].children.length === 1 &&
                currentListItem.children[0].children[0].value === ""
              )
            ) {
              currentChild.children.splice(j, 1);
              j--;
            } else {
              if (
                currentListItem.children.length === 1 &&
                currentListItem.children[0].type === mdNodeType.LIST
              ) {
                currentChild.children.splice(
                  j,
                  1,
                  ...currentListItem.children[0].children
                );
                j--;
              } else if (
                currentListItem.children.length > 1 &&
                currentListItem.children[0].type === mdNodeType.LIST
              ) {
                currentChild.children.splice(
                  j,
                  1,
                  ...currentListItem.children[0].children
                );
                currentListItem.children[0].children[
                  currentListItem.children[0].children.length - 1
                ].children = [
                  ...currentListItem.children[0].children[
                    currentListItem.children[0].children.length - 1
                  ].children,
                  ...currentListItem.children.slice(1),
                ];
                // take rest of currentListItem children
                // slap them onto
                j--;
              }
            }

            j++;
          }
        } else {
          node.children.splice(i, 1);
          i--;
        }
      }

      i++;
    }
  }
}

function combineTextNodes(node: Content) {
  if (node.children) {
    let i = 0;
    while (i < node.children.length - 1) {
      const currentChild = node.children[i];
      const nextChild = node.children[i + 1];

      if (
        currentChild.type === mdNodeType.TEXT &&
        nextChild.type === mdNodeType.TEXT
      ) {
        currentChild.value = `${currentChild.value}${nextChild.value}`;
        node.children.splice(i + 1, 1);
        i--;
      } else if (currentChild.type !== mdNodeType.TEXT) {
        combineTextNodes(currentChild);
      }

      i++;
    }
  }
}

function consolidateTextNodes(root: DocumentRoot) {
  const blocks = flattenListTreeToBlocks(root);

  for (let i = 0; i < blocks.length; i++) {
    const currentBlock = blocks[i];

    combineTextNodes(currentBlock);

    if (currentBlock.children.length > 0) {
      if (
        currentBlock.children[currentBlock.children.length - 1].type !==
        mdNodeType.TEXT
      ) {
        // @ts-ignore
        currentBlock.children.push(createTextFromValue(""));
      }

      if (currentBlock.children[0].type !== mdNodeType.TEXT) {
        // @ts-ignore
        currentBlock.children.unshift(createTextFromValue(""));
      }
    } else {
      currentBlock.children.push(createTextFromValue(""));
    }
  }
}

function deleteEmptyNodes(node: Content) {
  if (node.children !== undefined) {
    let i = 0;
    while (i < node.children.length) {
      const currentChild = node.children[i];

      if (currentChild.children) {
        deleteEmptyNodes(currentChild);

        if (currentChild.children.length === 0) {
          node.children.splice(i, 1);
          i--;
        }
      } else if (currentChild.value !== undefined) {
        if (
          currentChild.value === "" &&
          !(node.type === mdNodeType.PARAGRAPH && node.children.length === 1)
        ) {
          node.children.splice(i, 1);
          i--;
        }
      }

      i++;
    }
  }
}

function pruneEmptyNodes(root: DocumentRoot) {
  const blocks = flattenListTreeToBlocks(root);

  for (let i = 0; i < blocks.length; i++) {
    const currentBlock = blocks[i];

    deleteEmptyNodes(currentBlock);
  }
}

function deleteRangeFromText(
  node: Text,
  range: SelectionRange,
  blockIndex: number,
  currentIndex: number
): string {
  const endingIndex = currentIndex + node.value.length;
  let value = node.value;

  // TODO: consolidate these ifs and make sure logic is sound
  if (blockIndex === range.start.block && blockIndex === range.end.block) {
    if (endingIndex < range.start.offset || currentIndex > range.end.offset) {
      value = node.value;
    } else if (
      currentIndex < range.start.offset &&
      endingIndex > range.end.offset
    ) {
      // range is inside this child
      const firstHalf = node.value.slice(0, range.start.offset - currentIndex);
      const secondHalf = node.value.slice(range.end.offset - currentIndex);
      value = `${firstHalf}${secondHalf}`;
    } else if (
      currentIndex < range.start.offset &&
      endingIndex > range.start.offset
    ) {
      // this child straddles the start index
      value = node.value.slice(0, range.start.offset - currentIndex);
    } else if (
      currentIndex < range.end.offset &&
      endingIndex > range.end.offset
    ) {
      // this child straddles the end index
      value = node.value.slice(range.end.offset - currentIndex);
    } else if (
      currentIndex >= range.start.offset &&
      endingIndex <= range.end.offset
    ) {
      // this child is covered by the range
      value = "";
    }
  } else if (blockIndex === range.start.block) {
    if (currentIndex < range.start.offset && endingIndex > range.start.offset) {
      value = node.value.slice(0, range.start.offset - currentIndex);
    } else if (currentIndex >= range.start.offset) {
      value = "";
    } else {
      value = node.value;
    }
  } else if (blockIndex === range.end.block) {
    if (currentIndex < range.end.offset && endingIndex > range.end.offset) {
      value = node.value.slice(range.end.offset - currentIndex);
    } else if (endingIndex <= range.end.offset) {
      value = "";
    } else {
      value = node.value;
    }
  }

  return value;
}

function deleteRangeFromNode(
  node: Content,
  range: SelectionRange,
  blockIndex: number,
  currentIndex: number
): void {
  if (
    range.start.block !== range.end.block ||
    range.start.offset !== range.end.offset
  ) {
    if (node.children) {
      let i = 0;
      while (i < node.children.length) {
        const currentChild = node.children[i];
        const childLength = getNodeLength(currentChild);
        const endingIndex = currentIndex + childLength;

        if (currentChild.children) {
          deleteRangeFromNode(currentChild, range, blockIndex, currentIndex);
        } else if (currentChild.type === mdNodeType.TEXT) {
          currentChild.value = deleteRangeFromText(
            currentChild,
            range,
            blockIndex,
            currentIndex
          );
        }

        currentIndex = endingIndex;
        i++;
      }
    }
  }
}

// TODO: this needs a full rewrite
export function deleteRange(root: DocumentRoot, range: SelectionRange): void {
  if (
    range.start.block !== range.end.block ||
    range.start.offset !== range.end.offset
  ) {
    let currentBlockIndex = range.start.block;
    const blocks = flattenListTreeToBlocks(root);

    // Delete all of the unneeded text from blocks
    while (
      currentBlockIndex < range.end.block + 1 &&
      currentBlockIndex < blocks.length
    ) {
      const currentBlock = blocks[currentBlockIndex];

      if (
        currentBlockIndex > range.start.block &&
        currentBlockIndex < range.end.block
      ) {
        // This block is consumed by the range, just delete it's children
        // Cannot splice out the block because we need to do that in the recursive structure
        currentBlock.children = [];
      } else if (
        currentBlockIndex === range.start.block ||
        currentBlockIndex === range.end.block
      ) {
        deleteRangeFromNode(currentBlock, range, currentBlockIndex, -1);
      }

      currentBlockIndex += 1;
    }

    mergeNodesAfterDelete(root, range, 0);

    pruneEmptyNodes(root);

    consolidateListNodes(root);

    consolidateTextNodes(root);

    range.end = { ...range.start };
  }
}

function hoistListBlockElement(
  parent: DocumentRoot | ListItem,
  currentParentIndex: number,
  node: List,
  range: SelectionRange,
  blockIndex: number
) {
  let i = 0;
  while (i < node.children.length) {
    const currentListItem = node.children[i];

    let j = 0;
    while (j < currentListItem.children.length) {
      const currentBlockChild = currentListItem.children[j];

      if (currentBlockChild.type === mdNodeType.LIST) {
        // dive in and hoist again
        const listBlocks = flattenList(currentBlockChild);
        const lastBlockIndex = blockIndex + listBlocks.length - 1;

        if (
          blockIndex <= range.start.block &&
          lastBlockIndex >= range.start.block
        ) {
          hoistListBlockElement(
            currentListItem,
            j,
            currentBlockChild,
            range,
            blockIndex
          );
        }

        blockIndex = lastBlockIndex + 1;
      } else if (
        currentBlockChild.type === mdNodeType.HEADING ||
        currentBlockChild.type === mdNodeType.PARAGRAPH
      ) {
        if (blockIndex === range.start.block) {
          if (i > 0 && j === 0) {
            // it is the first child in a non-first list item
            // lift it to previous list item
            const prevListItem = node.children[i - 1];
            prevListItem.children.splice(
              prevListItem.children.length,
              0,
              ...currentListItem.children
            );

            node.children.splice(i, 1);
            i -= 1;
          } else {
            if (i === 0 && j === 0 && node.children.length > 1) {
              parent.children.splice(currentParentIndex, 0, currentBlockChild);
            } else if (i < node.children.length - 1) {
              // this was not the last list item, split the list
              const newList = createEmptyList(node.ordered);
              newList.children = node.children.slice(i + 1);
              node.children.splice(i + 1);

              parent.children.splice(
                currentParentIndex + 1,
                0,
                currentBlockChild,
                newList
              );
            } else {
              parent.children.splice(
                currentParentIndex + 1,
                0,
                ...currentListItem.children.slice(j)
              );
            }

            // remove existing node from where it was
            currentListItem.children.splice(j);
            if (currentListItem.children.length === 0) {
              node.children.splice(i, 1);
              i -= 1;
            }
          }
        }

        blockIndex += 1;
      }

      j++;
    }
    i++;
  }
}

export function liftElement(
  root: DocumentRoot,
  range: SelectionRange
): boolean {
  let liftedElement = false;

  let currentBlockIndex = 0;
  let i = 0;

  while (i < root.children.length) {
    const currentBlock = root.children[i];

    if (currentBlock.type === mdNodeType.LIST) {
      const listBlocks = flattenList(currentBlock);
      const lastBlockIndex = currentBlockIndex + listBlocks.length - 1;

      if (
        currentBlockIndex <= range.start.block &&
        lastBlockIndex >= range.start.block
      ) {
        hoistListBlockElement(root, i, currentBlock, range, currentBlockIndex);
        liftedElement = true;
      }

      currentBlockIndex = lastBlockIndex + 1;
    } else if (
      currentBlock.type === mdNodeType.HEADING ||
      currentBlock.type === mdNodeType.PARAGRAPH
    ) {
      currentBlockIndex += 1;
    }

    i++;
  }

  return liftedElement;
}

function indentItem(
  list: List,
  range: SelectionRange,
  blockIndex: number
): void {
  let i = 0;

  while (i < list.children.length) {
    const currentListItem = list.children[i];
    let j = 0;

    while (j < currentListItem.children.length) {
      const currentChild = currentListItem.children[j];

      if (currentChild.type === mdNodeType.LIST) {
        const listBlocks = flattenList(currentChild);
        const lastBlockIndex = blockIndex + listBlocks.length - 1;

        // TODO: improve this to indent multiple items instead of just the one
        // containing the start index
        if (
          blockIndex <= range.start.block &&
          lastBlockIndex >= range.start.block
        ) {
          indentItem(currentChild, range, blockIndex);
        }

        blockIndex = lastBlockIndex + 1;
      } else if (
        currentChild.type === mdNodeType.HEADING ||
        currentChild.type === mdNodeType.PARAGRAPH
      ) {
        if (blockIndex === range.start.block && i > 0) {
          const prevListItem = list.children[i - 1];
          const prevListItemLastChild =
            prevListItem.children[prevListItem.children.length - 1];
          if (prevListItemLastChild.type === mdNodeType.LIST) {
            prevListItemLastChild.children.push(currentListItem);
          } else {
            const newList = createEmptyList(list.ordered);
            newList.children.push(currentListItem);
            prevListItem.children.push(newList);
          }

          list.children.splice(i, 1);
        }

        blockIndex += 1;
      }

      j++;
    }

    i++;
  }
}

export function indentRange(root: DocumentRoot, range: SelectionRange): void {
  let i = 0;
  let currentBlockIndex = 0;

  while (i < root.children.length) {
    const currentTopLevelBlock = root.children[i];

    if (currentTopLevelBlock.type === mdNodeType.LIST) {
      const listBlocks = flattenList(currentTopLevelBlock);
      const lastBlockIndex = currentBlockIndex + listBlocks.length - 1;

      // TODO: improve this to indent multiple items instead of just the one
      // containing the start index
      if (
        currentBlockIndex <= range.start.block &&
        lastBlockIndex >= range.start.block
      ) {
        indentItem(currentTopLevelBlock, range, currentBlockIndex);
      }

      currentBlockIndex = lastBlockIndex + 1;
    } else if (
      currentTopLevelBlock.type === mdNodeType.HEADING ||
      currentTopLevelBlock.type === mdNodeType.PARAGRAPH
    ) {
      currentBlockIndex += 1;
    }

    i++;
  }
}

function dedentItem(
  parentList: List | null,
  list: List,
  range: SelectionRange,
  blockIndex: number,
  currentItemIndex: number | null
) {
  let i = 0;

  while (i < list.children.length) {
    const currentListItem = list.children[i];
    let j = 0;

    while (j < currentListItem.children.length) {
      const currentChild = currentListItem.children[j];

      if (currentChild.type === mdNodeType.LIST) {
        const listBlocks = flattenList(currentChild);
        const lastBlockIndex = blockIndex + listBlocks.length - 1;

        // TODO: improve this to indent multiple items instead of just the one
        // containing the start index
        if (
          blockIndex <= range.start.block &&
          lastBlockIndex >= range.start.block
        ) {
          dedentItem(list, currentChild, range, blockIndex, i);
        }

        blockIndex = lastBlockIndex + 1;
      } else if (
        currentChild.type === mdNodeType.HEADING ||
        currentChild.type === mdNodeType.PARAGRAPH
      ) {
        if (blockIndex === range.start.block) {
          if (parentList !== null && currentItemIndex !== null) {
            // attach this listitem to the parent list
            parentList.children.splice(
              currentItemIndex + 1,
              0,
              currentListItem
            );

            // remove this item from the current list
            list.children.splice(i, 1);
            const remainingItems = list.children.length - i;

            if (remainingItems > 0) {
              const newList = createEmptyList(list.ordered);
              newList.children = list.children.slice(i, i + remainingItems);
              list.children.splice(i, remainingItems);

              currentListItem.children.push(newList);
            }
          }
        }

        blockIndex += 1;
      }

      j++;
    }

    i++;
  }
}

export function dedentRange(root: DocumentRoot, range: SelectionRange): void {
  let i = 0;
  let currentBlockIndex = 0;

  while (i < root.children.length) {
    const currentTopLevelBlock = root.children[i];

    if (currentTopLevelBlock.type === mdNodeType.LIST) {
      const listBlocks = flattenList(currentTopLevelBlock);
      const lastBlockIndex = currentBlockIndex + listBlocks.length - 1;

      // TODO: improve this to dedent multiple items instead of just the one
      // containing the start index
      if (
        currentBlockIndex <= range.start.block &&
        lastBlockIndex >= range.start.block
      ) {
        dedentItem(null, currentTopLevelBlock, range, currentBlockIndex, null);
      }

      currentBlockIndex = lastBlockIndex + 1;
    } else if (
      currentTopLevelBlock.type === mdNodeType.HEADING ||
      currentTopLevelBlock.type === mdNodeType.PARAGRAPH
    ) {
      currentBlockIndex += 1;
    }

    i++;
  }

  consolidateListNodes(root);
}

function cloneRangeFromText(
  node: Text,
  range: SelectionRange,
  blockIndex: number,
  currentIndex: number
): string {
  let value = "";
  const endingIndex = currentIndex + node.value.length;

  if (range.start.block === blockIndex && range.end.block === blockIndex) {
    if (
      range.start.offset >= currentIndex &&
      range.start.offset <= endingIndex &&
      range.end.offset >= endingIndex
    ) {
      value = node.value.slice(range.start.offset - currentIndex);
    } else if (
      range.start.offset <= currentIndex &&
      range.end.offset >= currentIndex &&
      range.end.offset <= endingIndex
    ) {
      value = node.value.slice(0, range.end.offset - currentIndex);
    } else if (
      range.start.offset >= currentIndex &&
      range.start.offset <= endingIndex &&
      range.end.offset >= currentIndex &&
      range.end.offset <= endingIndex
    ) {
      // Clone a section of the block
      value = node.value.slice(
        range.start.offset - currentIndex,
        range.end.offset - currentIndex
      );
    }
  } else if (range.start.block === blockIndex) {
    if (range.start.offset >= currentIndex) {
      value = node.value.slice(range.start.offset - currentIndex);
    }
  } else if (range.end.block === blockIndex) {
    if (range.end.offset < endingIndex && range.end.offset > currentIndex) {
      value = node.value.slice(0, range.end.offset - currentIndex);
    }
  }

  return value;
}

function cloneRangeFromBlock(
  node: Content,
  range: SelectionRange,
  blockIndex: number,
  currentIndex: number
): PhrasingContent[] {
  let newChildren: PhrasingContent[] = [];

  if (node.children) {
    let i = 0;
    while (i < node.children.length) {
      const currentChild = JSON.parse(JSON.stringify(toJS(node.children[i])));
      const nodeLength = getNodeLength(currentChild);
      const endingIndex = currentIndex + nodeLength;

      if (
        (range.start.block === blockIndex &&
          range.end.block === blockIndex &&
          range.start.offset <= currentIndex &&
          range.end.offset >= endingIndex) ||
        (range.start.block === blockIndex &&
          range.end.block !== blockIndex &&
          range.start.offset <= currentIndex) ||
        (range.end.block === blockIndex &&
          range.start.block !== blockIndex &&
          range.end.offset >= endingIndex)
      ) {
        newChildren.push(currentChild);
      } else if (
        (range.start.block === blockIndex &&
          range.end.block === blockIndex &&
          ((range.start.offset >= currentIndex &&
            range.start.offset <= endingIndex) ||
            (range.end.offset >= currentIndex &&
              range.end.offset <= endingIndex))) ||
        (range.start.block === blockIndex &&
          range.end.block !== blockIndex &&
          range.start.offset < endingIndex) ||
        (range.end.block === blockIndex &&
          range.start.block !== blockIndex &&
          range.end.offset > currentIndex)
      ) {
        if (currentChild.value) {
          currentChild.value = cloneRangeFromText(
            currentChild,
            range,
            blockIndex,
            currentIndex
          );

          newChildren.push(currentChild);
        } else if (currentChild.children) {
          const clonedChildren = cloneRangeFromBlock(
            currentChild,
            range,
            blockIndex,
            currentIndex
          );

          currentChild.children = clonedChildren;
          newChildren.push(currentChild);
        }
      }

      currentIndex = endingIndex;
      i++;
    }
  }

  return newChildren;
}

function isNodeEmpty(node: Content): boolean {
  let nodeIsEmpty = true;

  if (node.children !== undefined && node.children.length > 0) {
    let i = 0;
    while (i < node.children.length) {
      const currentChild = node.children[i];

      const childIsEmpty = isNodeEmpty(currentChild);

      if (!childIsEmpty) {
        nodeIsEmpty = false;
        break;
      }
      i++;
    }
  } else if (node.value) {
    nodeIsEmpty = false;
  }

  return nodeIsEmpty;
}

function cloneRangeFromList(
  list: List,
  range: SelectionRange,
  blockIndex: number
): List {
  const copiedList = createEmptyList(list.ordered);
  let i = 0;

  while (i < list.children.length) {
    const currentListItem = list.children[i];
    const newListItem = createNewListItem(
      [],
      currentListItem.checked,
      currentListItem.spread
    );

    let j = 0;
    while (j < currentListItem.children.length) {
      const currentListItemChild = currentListItem.children[j];

      if (currentListItemChild.type === mdNodeType.LIST) {
        const listBlocks = flattenList(currentListItemChild);
        const lastBlockIndex = blockIndex + listBlocks.length - 1;

        if (
          range.start.block < blockIndex &&
          range.end.block > lastBlockIndex
        ) {
          newListItem.children.push(currentListItemChild);
        } else {
          // recurse on copying the list
          const copiedSublist = cloneRangeFromList(
            currentListItemChild,
            range,
            blockIndex
          );

          newListItem.children.push(copiedSublist);
        }

        blockIndex = lastBlockIndex + 1;
      } else if (
        currentListItemChild.type === mdNodeType.HEADING ||
        currentListItemChild.type === mdNodeType.PARAGRAPH
      ) {
        if (range.start.block < blockIndex && range.end.block > blockIndex) {
          newListItem.children.push(currentListItemChild);
        } else if (
          range.start.block === blockIndex ||
          range.end.block === blockIndex
        ) {
          const newChildren = cloneRangeFromBlock(
            currentListItemChild,
            range,
            blockIndex,
            -1
          );
          currentListItemChild.children = newChildren;
          newListItem.children.push(currentListItemChild);
        }

        blockIndex += 1;
      }

      j++;
    }

    if (!isNodeEmpty(newListItem)) {
      if (
        newListItem.children.length === 1 &&
        newListItem.children[0].type === mdNodeType.LIST
      ) {
        copiedList.children.splice(
          copiedList.children.length - 1,
          0,
          ...newListItem.children[0].children
        );
      } else {
        copiedList.children.push(newListItem);
      }
    }

    i++;
  }

  return copiedList;
}

// eslint-disable-next-line
export function cloneRange(
  root: DocumentRoot,
  range: SelectionRange,
  blockIndex: number
): TopLevelContent[] {
  let copiedBlocks: TopLevelContent[] = [];

  if (
    range.start.block !== range.end.block ||
    range.start.offset !== range.end.offset
  ) {
    let i = 0;
    while (i < root.children.length) {
      const currentBlock = JSON.parse(JSON.stringify(toJS(root.children[i])));

      if (currentBlock.type === mdNodeType.LIST) {
        const listBlocks = flattenList(currentBlock);
        const lastBlockIndex = blockIndex + listBlocks.length - 1;

        if (
          (range.start.block >= blockIndex &&
            range.start.block <= lastBlockIndex) ||
          (range.end.block >= blockIndex &&
            range.end.block <= lastBlockIndex) ||
          (range.start.block <= blockIndex && range.end.block >= lastBlockIndex)
        ) {
          const result = cloneRangeFromList(currentBlock, range, blockIndex);

          if (result.children.length > 0) {
            copiedBlocks.push(result);
          }
        }

        blockIndex = lastBlockIndex;
      } else if (
        currentBlock.type === mdNodeType.HEADING ||
        currentBlock.type === mdNodeType.PARAGRAPH
      ) {
        if (range.start.block < blockIndex && range.end.block > blockIndex) {
          copiedBlocks.push(currentBlock);
        } else if (
          range.start.block === blockIndex ||
          range.end.block === blockIndex
        ) {
          const newChildren = cloneRangeFromBlock(
            currentBlock,
            range,
            blockIndex,
            -1
          );
          currentBlock.children = newChildren;
          copiedBlocks.push(currentBlock);
        }
      }

      blockIndex += 1;
      i++;
    }
  }
  return copiedBlocks;
}

function listCarriageReturn(
  list: List,
  range: SelectionRange,
  blockIndex: number
) {
  let i = 0;

  while (i < list.children.length) {
    const currentListItem = list.children[i];
    let j = 0;
    while (j < currentListItem.children.length) {
      const currentChild = currentListItem.children[j];

      if (currentChild.type === mdNodeType.LIST) {
        const listBlocks = flattenList(currentChild);
        const lastBlockIndex = blockIndex + listBlocks.length - 1;

        if (
          blockIndex <= range.start.block &&
          lastBlockIndex >= range.start.block
        ) {
          listCarriageReturn(currentChild, range, blockIndex);
        }

        blockIndex = lastBlockIndex + 1;
      } else if (
        currentChild.type === mdNodeType.PARAGRAPH ||
        currentChild.type === mdNodeType.HEADING
      ) {
        if (range.start.block === blockIndex) {
          range.end.offset = getNodeLength(currentChild) - 1;

          const newElements = cloneRangeFromBlock(
            currentChild,
            range,
            blockIndex,
            -1
          );

          const newBlocks: BlockContent[] = [
            createParagraphFromApp(newElements),
          ];

          if (j < currentListItem.children.length - 1) {
            for (let k = j + 1; k < currentListItem.children.length; k++) {
              newBlocks.push(currentListItem.children[k]);
            }
            currentListItem.children.splice(
              j + 1,
              currentListItem.children.length - j
            );
          }

          deleteRangeFromNode(currentChild, range, blockIndex, -1);

          list.children.splice(
            i + 1,
            0,
            createNewListItem(
              // @ts-ignore
              newBlocks,
              currentListItem.checked,
              currentListItem.spread
            )
          );

          // The deed is done, exit the loop
          j = currentListItem.children.length;
          i = list.children.length;
        }

        blockIndex += 1;
      }

      j++;
    }
    i++;
  }
}

export function carriageReturn(
  root: DocumentRoot,
  range: SelectionRange
): void {
  let i = 0;
  let currentBlockIndex = 0;

  while (i < root.children.length) {
    const currentTopLevelBlock = root.children[i];

    if (currentTopLevelBlock.type === mdNodeType.LIST) {
      const listBlocks = flattenList(currentTopLevelBlock);
      const lastBlockIndex = currentBlockIndex + listBlocks.length - 1;

      if (
        currentBlockIndex <= range.start.block &&
        lastBlockIndex >= range.start.block
      ) {
        listCarriageReturn(currentTopLevelBlock, range, currentBlockIndex);
      }

      currentBlockIndex = lastBlockIndex + 1;
    } else if (
      currentTopLevelBlock.type === mdNodeType.HEADING ||
      currentTopLevelBlock.type === mdNodeType.PARAGRAPH
    ) {
      if (currentBlockIndex === range.start.block) {
        range.end.offset = getNodeLength(currentTopLevelBlock) - 1;

        const newChildren = cloneRangeFromBlock(
          currentTopLevelBlock,
          range,
          currentBlockIndex,
          -1
        );

        deleteRange(root, range);

        // create new element and splice in here on root
        const newParagraph = createParagraphFromApp(newChildren);

        root.children.splice(i + 1, 0, newParagraph);

        i = root.children.length;
      }

      currentBlockIndex += 1;
    }

    i++;
  }

  range.start.block += 1;
  range.end.block += 1;

  range.start.offset = -1;
  range.end.offset = -1;
}

function insertContentToBlock(
  parent: DocumentRoot | ListItem,
  parentChildIndex: number,
  rootToInsert: DocumentRoot,
  currentBlock: Paragraph | Heading,
  range: SelectionRange,
  blockIndex: number
) {
  // begin inserting children here
  const nodeLength = getNodeLength(currentBlock);
  range.start.offset = -1;
  const firstHalf = cloneRangeFromBlock(currentBlock, range, blockIndex, -1);
  range.start.offset = range.end.offset;
  range.end.offset = nodeLength;
  const secondHalf = cloneRangeFromBlock(currentBlock, range, blockIndex, -1);

  if (rootToInsert.children.length === 1) {
    const firstChildToInsert = rootToInsert.children[0];

    if (
      firstChildToInsert.type === mdNodeType.PARAGRAPH ||
      firstChildToInsert.type === mdNodeType.HEADING
    ) {
      currentBlock.children = [
        ...firstHalf,
        ...firstChildToInsert.children,
        ...secondHalf,
      ];

      const newChildLength = getNodeLength(firstChildToInsert);
      range.start.offset += newChildLength;
      range.end.offset = range.start.offset;
    } else if (firstChildToInsert.type === mdNodeType.LIST) {
      const listBlocks = flattenList(firstChildToInsert);
      const firstListBlock = listBlocks[0];
      const lastListBlock = listBlocks[listBlocks.length - 1];
      const newCursorOffset = getNodeLength(lastListBlock) - 1;

      if (range.start.offset === -1) {
        lastListBlock.children = [...lastListBlock.children, ...secondHalf];
        parent.children.splice(parentChildIndex, 1, firstChildToInsert);
        range.start.block = blockIndex + listBlocks.length - 1;
        range.start.offset = newCursorOffset;
        range.end = { ...range.start };
      } else {
        if (listBlocks.length > 1) {
          currentBlock.children = [...firstHalf, ...firstListBlock.children];
          lastListBlock.children = [...lastListBlock.children, ...secondHalf];

          listBlocks[0].children = [];

          parent.children.splice(parentChildIndex + 1, 0, firstChildToInsert);
          range.start.block = blockIndex + listBlocks.length - 1;
          range.start.offset = newCursorOffset;
          range.end = { ...range.start };
        } else {
          currentBlock.children = [
            ...firstHalf,
            ...firstListBlock.children,
            ...secondHalf,
          ];
          range.start.offset += newCursorOffset;
          range.end = { ...range.start };
        }
      }
    }
  } else if (rootToInsert.children.length > 1) {
    const firstChildToInsert = rootToInsert.children[0];
    const lastChildToInsert =
      rootToInsert.children[rootToInsert.children.length - 1];
    const restOfChildren = rootToInsert.children.slice(
      1,
      rootToInsert.children.length - 1
    );

    if (
      firstChildToInsert.type === mdNodeType.PARAGRAPH ||
      firstChildToInsert.type === mdNodeType.HEADING
    ) {
      currentBlock.children = [...firstHalf, ...firstChildToInsert.children];
    } else if (firstChildToInsert.type === mdNodeType.LIST) {
      // TODO: Need to extract contents and paste
      const listBlocks = flattenList(firstChildToInsert);
    }

    let lastChildLength = 0;
    if (
      lastChildToInsert.type === mdNodeType.PARAGRAPH ||
      lastChildToInsert.type === mdNodeType.HEADING
    ) {
      lastChildLength = getNodeLength(lastChildToInsert);
      lastChildToInsert.children = [
        ...lastChildToInsert.children,
        ...secondHalf,
      ];
    } else if (lastChildToInsert.type === mdNodeType.LIST) {
      // TODO: Need to extract contents and paste
      const listBlocks = flattenList(lastChildToInsert);
    }

    parent.children.splice(
      parentChildIndex + 1,
      0,
      ...restOfChildren,
      lastChildToInsert
    );

    range.start.block = blockIndex + restOfChildren.length + 1;
    range.start.offset = lastChildLength - 1;
    range.end = { ...range.start };
  }
}

function insertContentInList(
  list: List,
  rootToInsert: DocumentRoot,
  range: SelectionRange,
  blockIndex: number
) {
  let i = 0;
  while (i < list.children.length) {
    const currentListItem = list.children[i];

    let j = 0;
    while (j < currentListItem.children.length) {
      const currentChild = currentListItem.children[j];

      if (currentChild.type === mdNodeType.LIST) {
        let listBlocks = flattenList(currentChild);
        let lastBlockIndex = blockIndex + listBlocks.length - 1;

        if (
          range.start.block >= blockIndex &&
          range.start.block <= lastBlockIndex
        ) {
          insertContentInList(currentChild, rootToInsert, range, blockIndex);
        }

        listBlocks = flattenList(currentChild);
        lastBlockIndex = blockIndex + listBlocks.length - 1;
        blockIndex = lastBlockIndex + 1;
      } else if (
        currentChild.type === mdNodeType.PARAGRAPH ||
        currentChild.type === mdNodeType.HEADING
      ) {
        if (
          blockIndex === range.start.block &&
          range.end.block === blockIndex
        ) {
          insertContentToBlock(
            currentListItem,
            j,
            rootToInsert,
            currentChild,
            range,
            blockIndex
          );
          blockIndex = range.start.block;
        }

        blockIndex += 1;
      }
      j++;
    }
    i++;
  }
}

export function insertContentToRoot(
  root: DocumentRoot,
  rootToInsert: DocumentRoot,
  range: SelectionRange
) {
  if (rootToInsert.children.length > 0) {
    let blockIndex = 0;
    let i = 0;

    while (i < root.children.length) {
      const currentBlock = root.children[i];

      if (currentBlock.type === mdNodeType.LIST) {
        let listBlocks = flattenList(currentBlock);
        let lastBlockIndex = blockIndex + listBlocks.length - 1;

        if (
          range.start.block >= blockIndex &&
          range.start.block <= lastBlockIndex
        ) {
          insertContentInList(currentBlock, rootToInsert, range, blockIndex);
          blockIndex = range.start.block;
        }

        listBlocks = flattenList(currentBlock);
        lastBlockIndex = blockIndex + listBlocks.length - 1;
        blockIndex = lastBlockIndex + 1;
      } else if (
        currentBlock.type === mdNodeType.HEADING ||
        currentBlock.type === mdNodeType.PARAGRAPH
      ) {
        if (
          range.start.block === blockIndex &&
          range.end.block === blockIndex
        ) {
          insertContentToBlock(
            root,
            i,
            rootToInsert,
            currentBlock,
            range,
            blockIndex
          );
          blockIndex = range.start.block;
        }

        blockIndex += 1;
      }

      i++;
    }
  }

  pruneEmptyNodes(root);

  consolidateListNodes(root);

  consolidateTextNodes(root);
}
