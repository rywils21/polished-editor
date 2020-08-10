/** @jsx jsx */
import { jsx } from "theme-ui";

import { TextStyle } from "types";

interface ListItemLabelProps {
  ordered?: boolean;
  number: number;
  dy: number;
  textStyle: TextStyle;
}

export function SVGElementListItemLabel({
  ordered,
  number,
  dy,
  textStyle,
}: ListItemLabelProps) {
  if (ordered) {
    return (
      <text sx={{ userSelect: "none", opacity: textStyle.opacity }} y={dy - 2}>
        {number}.
      </text>
    );
  } else {
    return <circle opacity={textStyle.opacity} r={4} cy={dy - 8} cx={4} />;
  }
}
