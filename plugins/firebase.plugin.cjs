/*
 * Plugin that fixes building with expo and firebase messaging
 * https://stackoverflow.com/questions/72289521/swift-pods-cannot-yet-be-integrated-as-static-libraries-firebasecoreinternal-lib
 */
const fs = require('fs')
const path = require('path')
const generateCode = require('@expo/config-plugins/build/utils/generateCode')
const configPlugins = require('@expo/config-plugins')

const code = `  pod 'Firebase', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true
  pod 'GoogleUtilities', :modular_headers => true
  $RNFirebaseAsStaticFramework = true`

const withReactNativeFirebase = (config) => {
  return configPlugins.withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      const contents = fs.readFileSync(filePath, 'utf-8')

      const addCode = generateCode.mergeContents({
        tag: 'withReactNativeFirebase',
        src: contents,
        newSrc: code,
        anchor: /\s*use_native_modules!\s*/i,
        offset: 2,
        comment: '#',
      })

      if (!addCode.didMerge) {
        console.error(
          "ERROR: Cannot add withReactNativeFirebase to the project's ios/Podfile because it's malformed.",
        )
        return config
      }

      fs.writeFileSync(filePath, addCode.contents)

      return config
    },
  ])
}

module.exports = withReactNativeFirebase
