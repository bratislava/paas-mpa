import '@rneui/themed'

declare module '@rneui/themed' {
  export interface Theme {
    radius: {
      r4: number
      r8: number
    }
    borderWidth: {
      default: number
      thin: number
    }
  }
}
