const withLiveActivities = (config) => {
  if (!config.ios) {
    config.ios = {}
  }
  if (!config.ios.infoPlist) {
    config.ios.infoPlist = {}
  }
  config.ios.infoPlist.NSSupportsLiveActivities = true
  return config
}

module.exports = withLiveActivities
