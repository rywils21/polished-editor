/** @jsx jsx */
import { usePrevious } from "hooks/usePrevious";
import { ReactNode, useState } from "react";
import { animated, useSpring } from "react-spring";
import useMeasure from "react-use-measure";
import { jsx } from "theme-ui";
import { Icon, Icons } from "./Icon";

interface Props {
  children: ReactNode;
  barComponent: ReactNode;
  shrinkHeight?: boolean;
}

export function ExpandableSection({
  children,
  barComponent,
  shrinkHeight
}: Props) {
  const [isOpen, setOpen] = useState(true);
  const previous = usePrevious(isOpen);
  const [ref, { height: viewHeight }] = useMeasure();
  const { height, opacity, transform } = useSpring({
    from: {
      height: 0,
      opacity: 0,
      transform: "rotate(0deg)"
    },

    height: isOpen ? viewHeight : 0,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)"
  });

  return (
    <div sx={{ width: "100%", minHeight: shrinkHeight ? 0 : "auto" }}>
      <div
        sx={{
          width: "100%",
          fontSize: 1,
          padding: 0,
          backgroundColor: "gray5",
          border: "none",
          display: "flex",
          alignItems: "center"
        }}
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        <animated.div style={{ transform }} sx={{ padding: 1 }}>
          <Icon icon={Icons.CHEVRON_DOWN} width={16} height={16} />
        </animated.div>
        {barComponent}
      </div>
      <div
        sx={{
          overflow: "scroll",
          minHeight: 0,
          height: "calc(100% - 30px)",
          maxHeight: "calc(100% - 30px)"
        }}
      >
        <animated.div
          style={{
            opacity,
            height: isOpen && previous === isOpen ? "auto" : height
          }}
          sx={{
            willChange: "transform opacity height",
            overflow: "hidden"
          }}
        >
          <div ref={ref}>{children}</div>
        </animated.div>
      </div>
    </div>
  );
}
