/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { AppData } from "types";

interface Props {
  data: AppData;
}

export const ModeName = observer(function ModeName({ data }: Props) {
  return <div sx={{ padding: 2 }}>{data.activeProfile.activeMode.name}</div>;
});
