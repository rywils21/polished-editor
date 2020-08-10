/** @jsx jsx */
import { jsx } from "theme-ui";
import { MenuItemKey, ModeMenuItem } from "types";
import { menuItemDescriptions } from "./MenuItems";
import { Icon, Icons } from "components-ui/Icon";
import { observer } from "mobx-react-lite";

interface Props {
  menuItems: ModeMenuItem[];
  handleClick: (k: MenuItemKey) => void;
}

export const MenuItemChooser = observer(function MenuItemChooser({
  menuItems,
  handleClick
}: Props) {
  const menuItemKeys = Object.keys(MenuItemKey).filter((key: string) => {
    // @ts-ignore
    const item = MenuItemKey[key];
    let included = false;
    menuItems.forEach((modeMenuItem: ModeMenuItem) => {
      if (item === modeMenuItem.key) {
        included = true;
      }
    });
    return !included;
  });

  return (
    <div sx={{ marginTop: 3 }}>
      {menuItemKeys.length > 0 ? (
        menuItemKeys.map((key: string) => {
          // @ts-ignore
          const item = MenuItemKey[key];
          // @ts-ignore
          const description = menuItemDescriptions[item] || "";
          return (
            <button
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "none",
                border: "1px solid black",
                margin: 0,
                marginTop: 2,
                marginBottom: 2,
                padding: 3,
                fontSize: 2,
                borderRadius: 2,
                textAlign: "left",
                boxSizing: "border-box"
              }}
              key={key}
              onClick={() => {
                handleClick(item);
              }}
            >
              <Icon icon={Icons.PLUS} />
              <div sx={{ paddingLeft: 2 }}>
                <div sx={{ fontSize: 3 }}>{item}</div>
                <div sx={{ fontSize: 1 }}>{description}</div>
              </div>
            </button>
          );
        })
      ) : (
        <div sx={{ textAlign: "center" }}>
          All available menu items have been added.
        </div>
      )}
    </div>
  );
});
