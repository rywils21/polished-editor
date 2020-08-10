/** @jsx jsx */
import { jsx } from "theme-ui";
import { ReactNode } from "react";
import { useTransition, animated } from "react-spring";

interface ModalProps {
  shown: boolean;
  close: () => void;
  children: ReactNode;
}

export function Modal({ shown, close, children }: ModalProps) {
  const outerTransition = useTransition(shown, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    unique: true
  });
  const innerTransition = useTransition(shown, null, {
    from: { marginTop: "100%" },
    enter: { marginTop: "0%" },
    leave: { marginTop: "100%" },
    unique: true
  });

  return (
    <div>
      {outerTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              style={props}
              key={key}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100vh",
                width: "100vw",
                background: "rgba(0, 0, 0, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={close}
            >
              {innerTransition.map(
                ({ item, key, props }) =>
                  item && (
                    <animated.div
                      key={key}
                      style={props}
                      sx={{
                        background: "white",
                        borderRadius: 2,
                        opacity: 1
                      }}
                      onClick={evt => {
                        evt.stopPropagation();
                      }}
                    >
                      {children}
                    </animated.div>
                  )
              )}
            </animated.div>
          )
      )}
    </div>
  );
}
