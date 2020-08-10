/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import React, { useContext, useLayoutEffect } from "react";
import { PARAGRAPH_BREAK, DOCUMENT_CONTROLS_HEIGHT } from "misc/constants";
import { DocumentRoot, List } from "types/appTypes";
import { mdNodeType } from "types/mdastTypes";
import { TextStyle, AppData } from "types";
import { SVGControlDocumentMenu } from "./SVGControlDocumentMenu";
import { AppContext } from "../index";
import {
  DocumentEffectVisibility,
  DocumentHeight,
  Autoscroll,
  WheelEffect,
} from "types/editorEffects";
import { useWheel } from "react-use-gesture";
import { SVGElementBlock } from "./SVGElementBlock";
import { SVGElementListItemLabel } from "./SVGElementListItemLabel";
import { ReactNode } from "react";
import { BlockContent, Padding, ListItem } from "../types/appTypes";
import {
  FullGestureState,
  Coordinates,
  ReactEventHandlers,
} from "react-use-gesture/dist/types";
import { LIST_INDENT } from "../misc/constants";

interface PropTypes {
  document: DocumentRoot;
  documentIndex: number;
  isSelected: boolean;
  data: AppData;
}

export interface DocumentContextModel {
  documentIndex: number;
  documentScrollBind: (...args: any[]) => ReactEventHandlers | void;
}

export const DocumentContext = React.createContext<DocumentContextModel>({
  documentIndex: 0,
  documentScrollBind: () => {},
});

const defaultTextStyle: TextStyle = {
  color: "hsl(210, 13%, 12%)",
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
  fontSize: 20,
  fontWeight: 400,
  lineHeight: 1.5,
  fontStyle: "normal",
  textDecoration: "none",
  opacity: 1,
};

export const SVGDocument = observer(function SVGDocument({
  document,
  documentIndex,
  isSelected,
  data,
}: PropTypes) {
  let pageWidth =
    document.width + document.padding.left + document.padding.right;

  const appData = useContext(AppContext);

  useLayoutEffect(() => {
    if (
      appData.activeProfile.activeMode.editorEffects.canvas.autoscroll.value ===
        Autoscroll.TYPEWRITER &&
      isSelected &&
      appData.activeWorkspace
    ) {
      appData.activeWorkspace.view.x =
        window.innerWidth / 2 -
        (document.width * appData.activeWorkspace.view.zoom) / 2 -
        document.padding.left * appData.activeWorkspace.view.zoom -
        document.position.x * appData.activeWorkspace.view.zoom;
    }
  });

  let pageHeight = document.height;
  let paperY = 0;
  if (
    appData.activeProfile.activeMode.editorEffects.document.height.value ===
      DocumentHeight.FULLSCREEN &&
    appData.activeProfile.activeMode.editorEffects.canvas.autoscroll.value ===
      Autoscroll.TYPEWRITER &&
    isSelected &&
    appData.activeWorkspace
  ) {
    pageHeight += (window.innerHeight / appData.activeWorkspace.view.zoom) * 2;
    paperY -= window.innerHeight / appData.activeWorkspace.view.zoom;
  } else if (
    appData.activeProfile.activeMode.editorEffects.document.height.value ===
    DocumentHeight.CUSTOM
  ) {
    pageHeight = document.scrollContainerHeight;
  }

  const isScrollableInPlace =
    appData.activeProfile.activeMode.editorEffects.document.height.value ===
      DocumentHeight.CUSTOM &&
    appData.activeProfile.activeMode.editorEffects.controls.Wheel ===
      WheelEffect.SCROLL_DOCUMENT;
  const isScrollabeOnCanvas =
    appData.activeProfile.activeMode.editorEffects.document.height.value !==
      DocumentHeight.CUSTOM &&
    appData.activeProfile.activeMode.editorEffects.controls.Wheel ===
      WheelEffect.SCROLL_DOCUMENT;
  const documentScrollBind = useWheel(
    ({ event, delta }: FullGestureState<"wheel">) => {
      if (isScrollableInPlace) {
        if (event) {
          event.stopPropagation();
        }
        // eslint-disable-next-line
        const [dx, dy] = delta;
        let newOffset = document.scrollOffset - dy;

        if (
          newOffset <
          -1 *
            (document.height -
              document.scrollContainerHeight / 4 -
              document.padding.top)
        ) {
          newOffset =
            -1 *
            (document.height -
              document.scrollContainerHeight / 4 -
              document.padding.top);
        }

        if (newOffset > 0) {
          newOffset = 0;
        }

        document.scrollOffset = newOffset;
      } else if (isScrollabeOnCanvas) {
        if (event) {
          event.stopPropagation();
        }
        // eslint-disable-next-line
        const [dx, dy] = delta;

        if (appData.activeWorkspace) {
          // appData.activeWorkspace.view.x -= dx;
          appData.activeWorkspace.view.y -= dy;
        }
      }
    }
  );

  return (
    <DocumentContext.Provider value={{ documentIndex, documentScrollBind }}>
      <g
        className="SVGDocument"
        transform={`translate(${document.position.x} ${document.position.y})`}
      >
        <rect
          y={paperY}
          height={pageHeight + DOCUMENT_CONTROLS_HEIGHT}
          width={pageWidth}
          stroke="transparent"
          fill="white"
          filter="url(#shadow)"
          {...documentScrollBind()}
        />
        {appData.activeProfile.activeMode.editorEffects.document.menu
          .visibility === DocumentEffectVisibility.VISIBLE && (
          <SVGControlDocumentMenu
            document={document}
            documentIndex={documentIndex}
          />
        )}
        <clipPath id={`paper-${documentIndex}`}>
          <rect
            y={paperY + DOCUMENT_CONTROLS_HEIGHT}
            height={pageHeight}
            width={pageWidth}
            fill="transparent"
          />
        </clipPath>

        <g clipPath={`url(#paper-${documentIndex}-10)`}>
          <g
            transform={`translate(0 ${
              isScrollableInPlace ? document.scrollOffset : 0
            })`}
          >
            <DocumentErrorBoundary>
              {renderDocument(document)}
            </DocumentErrorBoundary>
          </g>
        </g>
      </g>
    </DocumentContext.Provider>
  );
});

class DocumentErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <text>Encountered an error loading this document.</text>;
    }

    return this.props.children;
  }
}

function renderDocument(document: DocumentRoot) {
  let dy = document.padding.top;

  let display: ReactNode[] = [];

  if (document.children.length > 0) {
    let blockIndex = 0;
    let i = 0;
    let currentBlock: any = document.children[i];

    while (currentBlock !== null) {
      const renderedBlock = renderBlock(
        currentBlock,
        blockIndex,
        dy,
        document.padding,
        document.width
      );

      display = [...display, ...renderedBlock.display];

      blockIndex = renderedBlock.blockIndex;
      dy = renderedBlock.dy;

      i++;
      if (document.children.length > i) {
        currentBlock = document.children[i];
      } else {
        currentBlock = null;
      }
    }
  }

  return display;
}

/*
 Recursive function to render blocks

 if it's a heading or paragraph - return the ReactNode

 if it's a list, call this on the list children
*/
function renderBlock(
  block: BlockContent,
  blockIndex: number,
  dy: number,
  padding: Padding,
  width: number
): {
  display: ReactNode[];
  blockIndex: number;
  dy: number;
} {
  let display: ReactNode[] = [];

  if (
    block.type === mdNodeType.PARAGRAPH ||
    block.type === mdNodeType.HEADING
  ) {
    display.push(
      <g
        key={blockIndex}
        transform={`translate(${padding.left} ${dy})`}
        className="SVGElementContent"
      >
        <SVGElementBlock
          node={block}
          width={width}
          padding={padding}
          textStyle={{ ...defaultTextStyle }}
          blockIndex={blockIndex}
        />
      </g>
    );

    if (block.type === mdNodeType.HEADING) {
      dy += block.height + 16;
    } else {
      dy += block.height + 8;
    }
    blockIndex += 1;
  } else if (block.type === mdNodeType.LIST) {
    // TODO: render the list knowing that each child is a list item
    const listResult = renderList(block, blockIndex, dy, padding, width);

    display.push(listResult.display);
    blockIndex = listResult.blockIndex;
    dy = listResult.dy;
  }

  return { display, blockIndex, dy };
}

const childPadding: Padding = {
  top: 0,
  bottom: 0,
  left: LIST_INDENT * 3,
  right: 0,
};

// TODO re-enable this code to fade bullets when a list item is not focused
// const fadeBullets =
// appData.activeProfile.activeMode.editorEffects.document.text.fade.value ===
// FadeTextValue.UNSELECTED_PARAGRAPH;

function renderList(
  list: List,
  blockIndex: number,
  dy: number,
  padding: Padding,
  width: number
): {
  display: ReactNode;
  blockIndex: number;
  dy: number;
} {
  const display = (
    <g
      key={`list-${blockIndex}`}
      transform={`translate(${padding.left} ${0})`}
      className="SVGElementContent"
    >
      {list.children.map((childNode: ListItem, i: number) => (
        <g key={i}>
          <SVGElementListItemLabel
            ordered={list.ordered}
            number={i + 1}
            dy={dy + PARAGRAPH_BREAK}
            textStyle={{ ...defaultTextStyle }}
          />
          <g className="SVGElementListItem" transform={`translate(0 ${0})`}>
            {childNode.children.map(
              (listItemChildNode: BlockContent, j: number) => {
                const renderedListItem = renderBlock(
                  listItemChildNode,
                  blockIndex,
                  dy,
                  childPadding,
                  width
                );

                blockIndex = renderedListItem.blockIndex;
                dy = renderedListItem.dy;

                return renderedListItem.display;
              }
            )}
          </g>
        </g>
      ))}
    </g>
  );

  return { display, blockIndex, dy };
}
