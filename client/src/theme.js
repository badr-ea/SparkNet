const colorTokens = {
  primary: {
    100: "#DCDAF2",
    200: "#A49DF2",
    300: "#7065E3",
    400: "#4739DC",
    500: "#3628D2",
    600: "#21169C",
    700: "#0F0764",
    800: "#0D0751",
    900: "#08033D",
  },
  secondary: {
    100: "#F2DFC2",
    200: "#F0D1A3",
    300: "#F6C274",
    400: "#E8A545",
    500: "#DD9224",
    600: "#B47009",
    700: "#835207",
    800: "#613C04",
    900: "#1A1001",
  },
  tertiary: {
    100: "#D5E0DF",
    300: "#81DBD2",
    500: "#34C8BA",
    900: "#031A17",
  },
  neutralVariant: {
    100: "#E1E1E5",
    200: "#A9A7BA",
    300: "#7A788F",
    400: "#5B5975",
    500: "#474466",
    600: "#252246",
    700: "#100E29",
    800: "#070618",
    900: "#030212",
  },
  grey: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              dark: colorTokens.primary[900],
              main: colorTokens.primary[500],
              light: colorTokens.primary[200],
            },
            neutral: {
              dark: colorTokens.grey[900],
              main: colorTokens.grey[800],
              mediumMain: colorTokens.grey[600],
              medium: colorTokens.grey[500],
              light: colorTokens.grey[400],
            },
            backgroud: {
              default: colorTokens.grey[200],
              alt: colorTokens.grey[300],
            },
          }
        : {
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[100],
            },
            neutral: {
              dark: colorTokens.grey[300],
              main: colorTokens.grey[400],
              mediumMain: colorTokens.grey[500],
              medium: colorTokens.grey[600],
              light: colorTokens.grey[700],
            },
            backgroud: {
              default: colorTokens.grey[800],
              alt: colorTokens.grey[900],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: "0.4%",
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 64,
        lineHeight: 44,
        letterSpacing: "0%",
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 57,
        lineHeight: 40,
        letterSpacing: "0%",
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 45,
        lineHeight: 36,
        letterSpacing: "0%",
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: "0%",
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: "0.25%",
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: "0.25%",
      },
    },
  };
};
