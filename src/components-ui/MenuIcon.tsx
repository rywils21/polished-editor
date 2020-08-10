/** @jsx jsx */
import { jsx } from "theme-ui";

import { ReactComponent as Copywriting } from "1-menu-assets/copywriting.svg";
import { ReactComponent as Feather } from "1-menu-assets/feather.svg";
import { ReactComponent as Folder } from "1-menu-assets/folder.svg";
// import { ReactComponent as Home } from "1-menu-assets/home.svg";
import { ReactComponent as IdeaGear } from "1-menu-assets/idea-gear.svg";
import { ReactComponent as Idea } from "1-menu-assets/idea.svg";
// import { ReactComponent as Lock } from "1-menu-assets/lock.svg";
import { ReactComponent as Notebook } from "1-menu-assets/notebook.svg";
import { ReactComponent as Rocket } from "1-menu-assets/rocket.svg";
import { ReactComponent as SearchFile } from "1-menu-assets/search-file.svg";
import { ReactComponent as Search } from "1-menu-assets/search.svg";
// import { ReactComponent as Speed } from "1-menu-assets/speed.svg";
// import { ReactComponent as Tesseract } from "1-menu-assets/tesseract.svg";
import { ReactComponent as Writing } from "1-menu-assets/writing.svg";

export enum MenuIcons {
  COPYWRITING = "Copywriting",
  FEATHER = "Feather",
  FOLDER = "Folder",
  // HOME = "Home",
  IDEA_GEAR = "Idea Gear",
  IDEA = "Idea",
  // LOCK = "Lock",
  NOTEBOOK = "Notebook",
  ROCKET = "Rocket",
  SEARCH_FILE = "Search File",
  SEARCH = "Search",
  // SPEED = "Speed",
  // TESSERACT = "Tesseract",
  WRITING = "Writing"
}

interface PropTypes {
  icon: MenuIcons;
  color?: string;
  thickness?: string;
  [x: string]: any;
}

export const MenuIcon = ({
  icon,
  color = "#707070",
  thickness = "3px",
  ...rest
}: PropTypes) => {
  if (icon === MenuIcons.COPYWRITING) {
    return (
      <Copywriting
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        width="32px"
        height="32px"
        {...rest}
      />
    );
  } else if (icon === MenuIcons.FEATHER) {
    return (
      <Feather
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
  } else if (icon === MenuIcons.FOLDER) {
    return (
      <Folder
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
    // } else if (icon === MenuIcons.HOME) {
    //   return <Home fill={color} width="32px" height="32px" {...rest} />;
  } else if (icon === MenuIcons.IDEA_GEAR) {
    return (
      <IdeaGear
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
  } else if (icon === MenuIcons.IDEA) {
    return (
      <Idea
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
    // } else if (icon === MenuIcons.LOCK) {
    //   return <Lock fill={color} width="32px" height="32px" {...rest} />;
  } else if (icon === MenuIcons.NOTEBOOK) {
    return (
      <Notebook
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
  } else if (icon === MenuIcons.ROCKET) {
    return (
      <Rocket
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
  } else if (icon === MenuIcons.SEARCH_FILE) {
    return (
      <SearchFile
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
  } else if (icon === MenuIcons.SEARCH) {
    return (
      <Search
        fill={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
    // } else if (icon === MenuIcons.SPEED) {
    //   return <Speed fill={color} width="32px" height="32px" {...rest} />;
    // } else if (icon === MenuIcons.TESSERACT) {
    //   return <Tesseract stroke={color} width="32px" height="32px" {...rest} />;
  } else if (icon === MenuIcons.WRITING) {
    return (
      <Writing
        stroke={color}
        width="32px"
        height="32px"
        sx={{
          "path, line, polyline, circle, rect": {
            stroke: color,
            strokeWidth: thickness
          }
        }}
        {...rest}
      />
    );
  } else {
    throw new Error(`No such icon: ${icon}`);
  }
};
