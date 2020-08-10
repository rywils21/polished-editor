import { TextStyle } from "types/index";
import { useThemeUI } from "theme-ui";
import { Paragraph, Heading } from "../types/appTypes";
import { mdNodeType } from "types/mdastTypes";

/*
useTextStyle

This is a hook designed for SVG elements to pull style information
from theme-ui so that that can be used for size calculation information
in the components.

Currently (may-11-2020), it is only used for heading and paragraph styles, and the default style
is still embedded in the document component code at the top. But ideally that could be brought
into here so the style is not prop-drilled.

*/

export function useTextStyle(
  node: Paragraph | Heading,
  initialTextStyle: TextStyle
): TextStyle {
  const { theme } = useThemeUI();

  let textStyle: TextStyle = { ...initialTextStyle };

  let headerDepth = 0;
  if (node.type === mdNodeType.HEADING && node.depth !== undefined) {
    headerDepth = node.depth;
  }

  if (
    theme.styles &&
    theme.styles.h1 &&
    theme.fontSizes &&
    theme.fontWeights &&
    theme.lineHeights
  ) {
    if (headerDepth === 1) {
      // @ts-ignore
      textStyle.fontSize = theme.fontSizes[theme.styles.h1.fontSize];
      // @ts-ignore
      textStyle.fontWeight = theme.fontWeights[theme.styles.h1.fontWeight];
      // @ts-ignore
      textStyle.lineHeight = theme.lineHeights[theme.styles.h1.lineHeight];
    } else if (headerDepth === 2) {
      // @ts-ignore
      textStyle.fontSize = theme.fontSizes[theme.styles.h2.fontSize];
      // @ts-ignore
      textStyle.fontWeight = theme.fontWeights[theme.styles.h2.fontWeight];
      // @ts-ignore
      textStyle.lineHeight = theme.lineHeights[theme.styles.h2.lineHeight];
    } else if (headerDepth === 3) {
      // @ts-ignore
      textStyle.fontSize = theme.fontSizes[theme.styles.h3.fontSize];
      // @ts-ignore
      textStyle.fontWeight = theme.fontWeights[theme.styles.h3.fontWeight];
      // @ts-ignore
      textStyle.lineHeight = theme.lineHeights[theme.styles.h3.lineHeight];
    } else if (headerDepth === 4) {
      // @ts-ignore
      textStyle.fontSize = theme.fontSizes[theme.styles.h4.fontSize];
      // @ts-ignore
      textStyle.fontWeight = theme.fontWeights[theme.styles.h4.fontWeight];
      // @ts-ignore
      textStyle.lineHeight = theme.lineHeights[theme.styles.h4.lineHeight];
    } else if (headerDepth === 5) {
      // @ts-ignore
      textStyle.fontSize = theme.fontSizes[theme.styles.h5.fontSize];
      // @ts-ignore
      textStyle.fontWeight = theme.fontWeights[theme.styles.h5.fontWeight];
      // @ts-ignore
      textStyle.lineHeight = theme.lineHeights[theme.styles.h5.lineHeight];
    } else if (headerDepth === 6) {
      // @ts-ignore
      textStyle.fontSize = theme.fontSizes[theme.styles.h6.fontSize];
      // @ts-ignore
      textStyle.fontWeight = theme.fontWeights[theme.styles.h6.fontWeight];
      // @ts-ignore
      textStyle.lineHeight = theme.lineHeights[theme.styles.h6.lineHeight];
    }
  }

  return textStyle;
}
