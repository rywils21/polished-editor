/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";
import { observer } from "mobx-react-lite";
import { Icon, Icons } from "components-ui/Icon";

export interface ToggleOption<T> {
  title: string;
  description: string;
  value: T;
}

interface Props {
  options2?: ToggleOption<any>[];
  options?: any;
  current: any;
  valueKey: string;
}

export const OptionToggle = observer(function OptionToggle({
  options2,
  options,
  current,
  valueKey
}: Props) {
  const currentValue = current[valueKey];

  if (options2) {
    return (
      <div sx={{ display: "flex", flexDirection: "column" }}>
        {options2.map((option: ToggleOption<any>) => {
          const selected = currentValue === option.value;
          return (
            <button
              key={option.value}
              sx={{
                cursor: "pointer",
                width: "100%",
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                padding: 2,
                margin: 1,
                background: selected ? "hsl(0, 0%, 92%)" : "transparent",
                border: selected
                  ? "1px solid transparent"
                  : "1px solid hsl(0, 0%, 18%)",
                ":hover": {
                  background: selected ? "hsl(0, 0%, 92%)" : "hsl(0, 0%, 95%)",
                  border: "1px solid transparent"
                }
              }}
              onClick={() => {
                current[valueKey] = option.value;
              }}
            >
              <div sx={{ padding: 2 }}>
                {selected ? (
                  <Icon icon={Icons.RADIO_CHECKED} />
                ) : (
                  <Icon icon={Icons.RADIO_UNCHECKED} />
                )}
              </div>
              <div
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left"
                }}
              >
                <div sx={{ fontSize: 3 }}>{option.title}</div>
                <div sx={{ fontSize: 1 }}>{option.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <React.Fragment>
      {Object.keys(options).map((value: string) => {
        const selected = currentValue === options[value];
        return (
          <button
            key={value}
            sx={{
              padding: 2,
              margin: 1,
              background: "none",
              border: selected ? "1px solid black" : "1px solid transparent",
              ":hover": {
                background: selected ? "none" : "hsl(0, 0%, 95%)"
              }
            }}
            onClick={() => {
              current[valueKey] = options[value];
            }}
          >
            {options[value]}
          </button>
        );
      })}
    </React.Fragment>
  );
});
