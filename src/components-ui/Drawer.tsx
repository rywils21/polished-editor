/** @jsx jsx */
import { jsx } from "theme-ui";
import { ReactNode } from "react";
import { useTransition, animated } from "react-spring";

interface DrawerProps {
  shown: boolean;
  close: () => void;
  children: ReactNode;
}

export function Drawer({ shown, close, children }: DrawerProps) {
  const outerTransition = useTransition(shown, null, {
    from: { marginLeft: "-100%" },
    enter: { marginLeft: "0%" },
    leave: { marginLeft: "-100%" }
  });

  return (
    <div>
      {outerTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div style={props} key={key} onClick={close}>
              {children}
            </animated.div>
          )
      )}
    </div>
  );
}
