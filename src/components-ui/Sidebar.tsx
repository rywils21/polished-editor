/** @jsx jsx */
import { jsx } from "theme-ui";
import { ReactNode } from "react";
import { useTransition, animated } from "react-spring";

interface SidebarProps {
  shown: boolean;
  close: () => void;
  children: ReactNode;
}

export function RightSidebar({ shown, close, children }: SidebarProps) {
  const outerTransition = useTransition(shown, null, {
    from: { right: "-800px" },
    enter: { right: "0" },
    leave: { right: "-800px" }
  });

  return (
    <div sx={{ position: "absolute", top: 0, right: 0, left: "auto" }}>
      {outerTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              style={props}
              key={key}
              sx={{ position: "absolute", top: 0, right: 0, left: "auto" }}
            >
              {children}
            </animated.div>
          )
      )}
    </div>
  );
}
