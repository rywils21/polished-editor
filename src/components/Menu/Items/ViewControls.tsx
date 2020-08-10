/** @jsx jsx */
import { jsx } from "theme-ui";
import { AppData } from "types";
import { Icon, Icons } from "components-ui/Icon";
import { observer } from "mobx-react-lite";

interface Props {
  data: AppData;
}

export const ViewControls = observer(function ViewControls({ data }: Props) {
  return (
    <div
      sx={{
        padding: 3,
        display: "flex"
      }}
    >
      <button
        sx={{ border: "none", background: "none" }}
        onClick={() => {
          if (data.activeWorkspace) {
            data.activeWorkspace.view.x = 0;
            data.activeWorkspace.view.y = 0;
            data.activeWorkspace.view.zoom = 1;
          }
        }}
      >
        <Icon icon={Icons.LOCATE} />
      </button>
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: 3,
          marginLeft: 3,
          button: {
            background: "none",
            border: "1px solid #707070",
            boxSizing: "border-box",
            padding: 1,
            width: "36px",
            height: "36px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }
        }}
      >
        <button
          sx={{ borderTopLeftRadius: 1, borderBottomLeftRadius: 1 }}
          onClick={() => {
            if (data.activeWorkspace) {
              data.activeWorkspace.view.zoom -= 0.1;
              if (data.activeWorkspace.view.zoom < 0.1) {
                data.activeWorkspace.view.zoom = 0.1;
              }
            }
          }}
        >
          <Icon icon={Icons.MINUS} />
        </button>
        <div
          sx={{
            padding: 1,
            boxSizing: "border-box",
            border: "1px solid #707070",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "70px"
          }}
          onClick={() => {
            // open zoom dropdown
          }}
        >
          {data.activeWorkspace
            ? Math.round(data.activeWorkspace.view.zoom * 100)
            : 100}
          %
        </div>
        <button
          sx={{ borderTopRightRadius: 1, borderBottomRightRadius: 1 }}
          onClick={() => {
            if (data.activeWorkspace) {
              data.activeWorkspace.view.zoom += 0.1;
            }
          }}
        >
          <Icon icon={Icons.PLUS} />
        </button>
      </div>
      <button
        sx={{ border: "none", background: "transparent" }}
        onClick={() => {
          data.fullScreen = !data.fullScreen;
        }}
      >
        {data.fullScreen ? (
          <Icon icon={Icons.SHRINK} />
        ) : (
          <Icon icon={Icons.EXPAND} />
        )}
      </button>
    </div>
  );
});
