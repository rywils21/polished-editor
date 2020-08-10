/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { AppData, ModeMenuItem, MenuItemKey } from "types";
import { Icons, Icon } from "components-ui/Icon";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { MenuItemChooser } from "./MenuItemChooser";

interface Props {
  data: AppData;
}

export const menuItemDescriptions = {
  [MenuItemKey.VIEW_CONTROLS]:
    "Reset the canvas to pan to (0, 0). Adjust zoom. Toggle fullscreen.",
  [MenuItemKey.WORKSPACE_CHOOSER]:
    "Easily switch between your different workspaces.",
  [MenuItemKey.OPEN_EDITORS]:
    "See the open documents and browsers in your workspace. Click them to jump to them in the canvas.",
  [MenuItemKey.FILE_EXPLORER]: "Explore files in your workspace.",
  [MenuItemKey.MODE_NAME]: "View the current mode name.",
  [MenuItemKey.DOCUMENT_OUTLINE]: "Show the outline of a selected document."
};

export const MenuItems = observer(function MenuItems({ data }: Props) {
  const [addMenuItemOpen, setAddMenuItemOpen] = useState(false);

  // hack to get the component to rerender when using the garbage can.
  // Could probably do without this if broken up into multiple components
  useEffect(() => {}, [data.activeProfile.activeMode.menu.items.length]);

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2
      }}
    >
      <div
        sx={{
          paddingLeft: 3,
          fontSize: 4,
          marginTop: 3,
          fontWeight: 700
        }}
      >
        Menu Items
      </div>
      <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1, marginBottom: 2 }}>
        Control which menu items and the order they appear in the left menu bar.
        Drag an item to reorder them.
      </div>
      <DragDropContext
        onDragEnd={result => {
          const { destination, source } = result;

          if (!destination) {
            return;
          }

          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return;
          }

          const menuItem = data.activeProfile.activeMode.menu.items.splice(
            source.index,
            1
          );
          data.activeProfile.activeMode.menu.items.splice(
            destination.index,
            0,
            menuItem[0]
          );
        }}
      >
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: 2
          }}
        >
          <Droppable droppableId="menuItems">
            {provided => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    padding: 2,
                    boxShadow: "menuItem",
                    background: "hsl(0, 0%, 90%)"
                  }}
                >
                  {data.activeProfile.activeMode.menu.items.map(
                    (item: ModeMenuItem, i: number) => {
                      return (
                        <Draggable
                          key={`${item.key}`}
                          draggableId={`${item.key}`}
                          index={i}
                        >
                          {provided => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <div
                                sx={{
                                  borderRadius: 2,
                                  boxShadow: "menuItem",
                                  margin: 2,
                                  padding: 3,
                                  background: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  fontSize: 1,
                                  ":hover": {
                                    button: {
                                      visibility: "visible"
                                    }
                                  },
                                  button: {
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    visibility: "hidden",
                                    borderRadius: "50%",
                                    ":hover": {
                                      background: "hsl(0, 100%, 80%)"
                                    }
                                  }
                                }}
                              >
                                <Icon icon={Icons.MENU} />
                                <div
                                  sx={{
                                    flex: 1,
                                    textAlign: "left",
                                    paddingLeft: 2
                                  }}
                                >
                                  <div sx={{ fontSize: 3 }}>{item.key}</div>
                                  <div sx={{ fontSize: 1 }}>
                                    {menuItemDescriptions[item.key]}
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    data.activeProfile.activeMode.menu.items.splice(
                                      i,
                                      1
                                    );
                                  }}
                                >
                                  <Icon icon={Icons.TRASH} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    }
                  )}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>

          {addMenuItemOpen && (
            <MenuItemChooser
              menuItems={data.activeProfile.activeMode.menu.items}
              handleClick={(key: MenuItemKey) => {
                data.activeProfile.activeMode.menu.items.push({
                  key
                });
                setAddMenuItemOpen(false);
              }}
            />
          )}
          {addMenuItemOpen ? (
            <button
              sx={{
                background: "none",
                border: "1px solid black",
                width: "100%",
                marginTop: 3,
                padding: 2,
                boxSizing: "border-box",
                fontSize: 2
              }}
              onClick={() => {
                setAddMenuItemOpen(false);
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              sx={{
                background: "none",
                border: "1px solid black",
                width: "100%",
                marginTop: 3,
                padding: 2,
                boxSizing: "border-box",
                fontSize: 2
              }}
              onClick={() => {
                setAddMenuItemOpen(true);
              }}
            >
              Add Menu Item
            </button>
          )}
        </div>
      </DragDropContext>
    </div>
  );
});
