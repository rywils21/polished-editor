/** @jsx jsx */
import { jsx } from "theme-ui";
import { MenuIcons, MenuIcon } from "./MenuIcon";

interface Props {
  currentIcon: MenuIcons;
  select: (icon: MenuIcons) => void;
}

export function MenuIconChooser({ currentIcon, select }: Props) {
  return (
    <div
      sx={{
        padding: 2,
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        flexFlow: "row wrap"
      }}
    >
      {Object.keys(MenuIcons).map((value: string) => {
        // @ts-ignore
        const menuIcon = MenuIcons[value];
        const icon = <MenuIcon icon={menuIcon} width={48} height={48} />;
        return (
          <button
            key={value}
            sx={{
              border:
                currentIcon === menuIcon
                  ? "1px solid black"
                  : "1px solid transparent",
              padding: 2,
              background: "none",
              cursor: currentIcon === menuIcon ? "default" : "pointer",
              ":hover": {
                background:
                  currentIcon === menuIcon ? "none" : "hsl(0, 0%, 95%)"
              }
            }}
            onClick={() => {
              // @ts-ignore
              select(MenuIcons[value]);
            }}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
