// example base theme from @theme-ui/presets
const heading = {
  fontFamily: "heading",
  lineHeight: "heading",
  fontWeight: "heading",
};

export const base = {
  breakpoints: ["40em", "52em", "64em"],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  radii: [0, 4, 8],
  fonts: {
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  shadows: {
    menuItem: "0px 3px 6px hsl(0, 0%, 85%)",
  },
  colors: {
    dark1: "hsl(0, 0%, 19%)",
    dark2: "hsl(0, 0%, 44%)",
    dark3: "hsl(0, 0%, 50%)",
    light1: "hsl(0, 0%, 99%)",
    light2: "hsl(0, 0%, 88%)",
    gray1: "hsl(0, 0%, 30%)",
    gray2: "hsl(0, 0%, 35%)",
    gray3: "hsl(0, 0%, 55%)",
    gray4: "hsl(0, 0%, 73%)",
    gray5: "hsl(0, 0%, 87%)",
    gray6: "hsl(0, 0%, 96%)",
    text: "hsl(212, 56%, 16%)",
    primary: "hsl(210, 38%, 97%)",
    background: "hsl(210, 38%, 97%)",
    secondary: "#30c",
    muted: "#f6f6f6",
    buttonPrimary: "hsl(243, 79%, 62%)",
    buttonSecondary: "hsl(0, 0%, 18%)",
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      padding: 0,
      boxSizing: "border-box",
    },
    svg: {
      width: "100vw",
      height: "100vh",
    },
    h1: {
      ...heading,
      fontSize: 7,
    },
    h2: {
      ...heading,
      fontSize: 5,
    },
    h3: {
      ...heading,
      fontSize: 4,
    },
    h4: {
      ...heading,
      fontSize: 2,
    },
    h5: {
      ...heading,
      fontSize: 1,
    },
    h6: {
      ...heading,
      fontSize: 0,
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      color: "white",
      backgroundColor: "black",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
  },
  buttons: {
    primary: {
      color: "light1",
      backgroundColor: "buttonPrimary",
      paddingTop: [3],
      paddingBottom: [3],
      paddingLeft: [4, 5],
      paddingRight: [4, 5],
      borderRadius: "button",
      fontSize: [2, 3, 4, 4],
      fontWeight: "bold",
      textDecoration: "none",
      cursor: "pointer",
    },
    primary2: {
      color: "light1",
      backgroundColor: "buttonPrimary",
      paddingTop: [2],
      paddingBottom: [2],
      paddingLeft: [4, 5],
      paddingRight: [4, 5],
      border: "none",
      fontSize: [2, 3, 4, 4],
      textDecoration: "none",
      cursor: "pointer",
      width: "100%",
    },
    secondary: {
      color: "light1",
      backgroundColor: "buttonSecondary",
      paddingTop: [2],
      paddingBottom: [2],
      paddingLeft: [4, 5],
      paddingRight: [4, 5],
      border: "none",
      fontSize: [2, 3, 4, 4],
      textDecoration: "none",
      cursor: "pointer",
      width: "100%",
    },
    link: {
      color: "light1",
      fontSize: [1, 2],
      padding: 0,
      textDecoration: "underline",
      background: "none",
      border: "none",
      cursor: "pointer",
    },
  },
  inputs: {
    singleLine: {
      width: "100%",
      padding: 2,
      boxSizing: "border-box",
      fontSize: 3,
      border: "none",
    },
  },
};