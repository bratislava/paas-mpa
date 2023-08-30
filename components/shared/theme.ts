import { createTheme } from '@rneui/themed'

export const paasTheme = createTheme({
  mode: 'light',
  lightColors: {
    primary: '#579636',
    secondary: '#16254C',
    error: '#D00000',
  },
  radius: {
    r4: 4,
    r8: 8,
  },
  borderWidth: {
    default: 2,
    thin: 1,
  },
  components: {
    Text: {
      style: {
        fontFamily: 'BelfastGrotesk_Black',
      },
    },
    Button: (props, theme) => ({
      raised: false,
      buttonStyle: {
        // borderRadius: theme.radius.r8,
        // borderWidth: theme.borderWidth.default,
      },
      titleStyle: {
        fontSize: 16,
        fontFamily: 'BelfastGrotesk_Black',
      },
      radius: 'md',
    }),
    // ListItem: {
    //   Component: {
    //
    //   },
    // },
  },
})
