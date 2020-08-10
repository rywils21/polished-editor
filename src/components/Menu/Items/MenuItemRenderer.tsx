/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";
import { observer } from "mobx-react-lite";
import { ModeMenuItem, MenuItemKey, AppData } from "types";
import { OpenEditors } from "./OpenEditors";
import { FileExplorer } from "./FileExplorer";
import { WorkspaceChooser } from "./WorkspaceChooser";
import { ModeName } from "./ModeName";
import { ViewControls } from "./ViewControls";

interface Props {
  menuItems: ModeMenuItem[];
  data: AppData;
}

export const MenuItemRenderer = observer(function MenuItemRenderer({
  menuItems,
  data
}: Props) {
  return (
    <div sx={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {menuItems.map((item: ModeMenuItem, i: number) => {
        let element: any = null;
        if (item.key === MenuItemKey.OPEN_EDITORS) {
          element = <OpenEditors data={data} />;
        } else if (item.key === MenuItemKey.FILE_EXPLORER) {
          element = <FileExplorer data={data} />;
        } else if (item.key === MenuItemKey.WORKSPACE_CHOOSER) {
          element = <WorkspaceChooser data={data} />;
        } else if (item.key === MenuItemKey.DOCUMENT_OUTLINE) {
        } else if (item.key === MenuItemKey.MODE_NAME) {
          element = <ModeName data={data} />;
        } else if (item.key === MenuItemKey.VIEW_CONTROLS) {
          element = <ViewControls data={data} />;
        } else {
          throw new Error(`Unsupported menu item: ${item.key}`);
        }

        return (
          <React.Fragment key={`${item.key}-${i}`}>{element}</React.Fragment>
        );
      })}
    </div>
  );
});
