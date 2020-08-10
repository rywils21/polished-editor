import React from "react";

import { ReactComponent as ArrowLeft } from "1-assets/arrow-left.svg";
import { ReactComponent as ArrowRight } from "1-assets/arrow-right.svg";
import { ReactComponent as Browser } from "1-assets/window-tab.svg";
import { ReactComponent as BubbleText } from "1-assets/bubble-text.svg";
import { ReactComponent as Chart } from "1-assets/chart.svg";
import { ReactComponent as ChevronDown } from "1-assets/chevron-down.svg";
import { ReactComponent as ChevronUp } from "1-assets/chevron-up.svg";
import { ReactComponent as ChevronRight } from "1-assets/chevron-right.svg";
import { ReactComponent as ChevronLeft } from "1-assets/chevron-left.svg";
import { ReactComponent as Cross } from "1-assets/cross.svg";
import { ReactComponent as Download } from "1-assets/download.svg";
import { ReactComponent as DrawerDownload } from "1-assets/drawer-download.svg";
import { ReactComponent as Expand } from "1-assets/expand.svg";
import { ReactComponent as Duplicate } from "1-assets/external2.svg";
import { ReactComponent as FilePlus } from "1-assets/file-plus.svg";
import { ReactComponent as FloppyDisk } from "1-assets/floppy-disk.svg";
import { ReactComponent as FolderPlus } from "1-assets/folder-plus.svg";
import { ReactComponent as Gear } from "1-assets/gear3.svg";
import { ReactComponent as Home } from "1-assets/home3.svg";
import { ReactComponent as LineSpacing } from "1-assets/line-spacing.svg";
import { ReactComponent as CanvasCenter } from "1-assets/canvas-center.svg";
import { ReactComponent as Hamburger } from "1-assets/menu.svg";
import { ReactComponent as Menu } from "1-assets/menu2.svg";
import { ReactComponent as Minus } from "1-assets/minus.svg";
import { ReactComponent as Moon } from "1-assets/moon.svg";
import { ReactComponent as Move } from "1-assets/move.svg";
import { ReactComponent as MustacheMonocle } from "1-assets/mustache-monocle.svg";
import { ReactComponent as Paper } from "1-assets/paper.svg";
import { ReactComponent as Plus } from "1-assets/plus.svg";
import { ReactComponent as RadioChecked } from "1-assets/check-circle.svg";
import { ReactComponent as RadioUnchecked } from "1-assets/radio-unchecked.svg";
import { ReactComponent as Shrink } from "1-assets/shrink.svg";
import { ReactComponent as Sun } from "1-assets/sun.svg";
import { ReactComponent as TextSize } from "1-assets/text-size.svg";
import { ReactComponent as Trash } from "1-assets/trash.svg";
import { ReactComponent as User } from "1-assets/user.svg";
import { ReactComponent as BrowserPlus } from "1-assets/window-tab-plus.svg";
import { ReactComponent as ZoomIn } from "1-assets/zoom-in.svg";
import { ReactComponent as ZoomOut } from "1-assets/zoom-out.svg";

export enum Icons {
  ARROW_LEFT,
  ARROW_RIGHT,
  BROWSER,
  BROWSER_PLUS,
  BUBBLE_TEXT,
  CHART,
  CHEVRON_DOWN,
  CHEVRON_UP,
  CHEVRON_RIGHT,
  CHEVRON_LEFT,
  CROSS,
  DOWNLOAD,
  DRAWER_DOWNLOAD,
  DUPLICATE,
  EXPAND,
  FILE_PLUS,
  FOLDER_PLUS,
  GEAR,
  HAMBURGER,
  HOME,
  LINE_SPACING,
  LOCATE,
  MENU,
  MINUS,
  MOON,
  MOVE,
  MUSTACE_MONOCLE,
  PAPER,
  PLUS,
  RADIO_CHECKED,
  RADIO_UNCHECKED,
  SAVE,
  SHRINK,
  SUN,
  TEXT_SIZE,
  TRASH,
  USER,
  ZOOM_IN,
  ZOOM_OUT
}

interface PropTypes {
  icon: Icons;
  fill?: string;
  [x: string]: any;
}

export const Icon = ({ icon, fill = "#707070", ...rest }: PropTypes) => {
  if (icon === Icons.ARROW_LEFT) {
    return <ArrowLeft fill={fill} {...rest} />;
  } else if (icon === Icons.ARROW_RIGHT) {
    return <ArrowRight fill={fill} {...rest} />;
  } else if (icon === Icons.BROWSER) {
    return <Browser fill={fill} {...rest} />;
  } else if (icon === Icons.BROWSER_PLUS) {
    return <BrowserPlus fill={fill} {...rest} />;
  } else if (icon === Icons.BUBBLE_TEXT) {
    return <BubbleText fill={fill} {...rest} />;
  } else if (icon === Icons.CHART) {
    return <Chart fill={fill} {...rest} />;
  } else if (icon === Icons.CHEVRON_DOWN) {
    return <ChevronDown fill={fill} {...rest} />;
  } else if (icon === Icons.CHEVRON_UP) {
    return <ChevronUp fill={fill} {...rest} />;
  } else if (icon === Icons.CHEVRON_RIGHT) {
    return <ChevronRight fill={fill} {...rest} />;
  } else if (icon === Icons.CHEVRON_LEFT) {
    return <ChevronLeft fill={fill} {...rest} />;
  } else if (icon === Icons.CROSS) {
    return <Cross fill={fill} {...rest} />;
  } else if (icon === Icons.DOWNLOAD) {
    return <Download fill={fill} {...rest} />;
  } else if (icon === Icons.DRAWER_DOWNLOAD) {
    return <DrawerDownload fill={fill} {...rest} />;
  } else if (icon === Icons.DUPLICATE) {
    return <Duplicate fill={fill} {...rest} />;
  } else if (icon === Icons.EXPAND) {
    return <Expand fill={fill} {...rest} />;
  } else if (icon === Icons.FILE_PLUS) {
    return <FilePlus fill={fill} {...rest} />;
  } else if (icon === Icons.FOLDER_PLUS) {
    return <FolderPlus fill={fill} {...rest} />;
  } else if (icon === Icons.GEAR) {
    return <Gear fill={fill} {...rest} />;
  } else if (icon === Icons.HAMBURGER) {
    return <Hamburger fill={fill} {...rest} />;
  } else if (icon === Icons.HOME) {
    return <Home fill={fill} {...rest} />;
  } else if (icon === Icons.LINE_SPACING) {
    return <LineSpacing fill={fill} {...rest} />;
  } else if (icon === Icons.LOCATE) {
    return <CanvasCenter fill={fill} {...rest} />;
  } else if (icon === Icons.MENU) {
    return <Menu fill={fill} {...rest} />;
  } else if (icon === Icons.MINUS) {
    return <Minus fill={fill} {...rest} />;
  } else if (icon === Icons.MOON) {
    return <Moon fill={fill} {...rest} />;
  } else if (icon === Icons.MOVE) {
    return <Move fill={fill} {...rest} />;
  } else if (icon === Icons.MUSTACE_MONOCLE) {
    return <MustacheMonocle fill={fill} {...rest} />;
  } else if (icon === Icons.PAPER) {
    return <Paper fill={fill} {...rest} />;
  } else if (icon === Icons.PLUS) {
    return <Plus fill={fill} {...rest} />;
  } else if (icon === Icons.SAVE) {
    return <FloppyDisk fill={fill} {...rest} />;
  } else if (icon === Icons.RADIO_CHECKED) {
    return <RadioChecked fill={fill} {...rest} />;
  } else if (icon === Icons.RADIO_UNCHECKED) {
    return <RadioUnchecked fill={fill} {...rest} />;
  } else if (icon === Icons.SHRINK) {
    return <Shrink fill={fill} {...rest} />;
  } else if (icon === Icons.SUN) {
    return <Sun fill={fill} {...rest} />;
  } else if (icon === Icons.TEXT_SIZE) {
    return <TextSize fill={fill} {...rest} />;
  } else if (icon === Icons.TRASH) {
    return <Trash fill={fill} {...rest} />;
  } else if (icon === Icons.USER) {
    return <User fill={fill} {...rest} />;
  } else if (icon === Icons.ZOOM_IN) {
    return <ZoomIn fill={fill} {...rest} />;
  } else if (icon === Icons.ZOOM_OUT) {
    return <ZoomOut fill={fill} {...rest} />;
  } else {
    throw new Error("No such icon!");
  }
};
