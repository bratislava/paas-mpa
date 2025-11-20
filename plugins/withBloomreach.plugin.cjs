/* eslint-disable @typescript-eslint/no-var-requires */
const {
  withPlugins,
  withAppBuildGradle,
  withAndroidManifest,
  withAppDelegate,
  withDangerousMod,
} = require('@expo/config-plugins')
const { writeFileSync, mkdirSync, existsSync } = require('fs')

// Update android/app/build.gradle
function withExponeaBuildGradle(config) {
  return withAppBuildGradle(config, async (cfg) => {
    const { modResults } = cfg
    const { contents } = modResults
    const lines = contents.split('\n')
    const configIndex = lines.findIndex((line) => /defaultConfig {/.test(line))
    const dependenciesIndex = lines.findIndex((line) => /dependencies {/.test(line))

    modResults.contents = [
      ...lines.slice(0, configIndex + 1),
      '        multiDexEnabled true',
      ...lines.slice(configIndex + 1, dependenciesIndex + 1),
      `    implementation("com.google.firebase:firebase-messaging:24.0.0")`,
      ...lines.slice(dependenciesIndex + 1),
    ].join('\n')

    return cfg
  })
}

// Update android/app/src/main/AndroidManifest.xml
function withExponeaAndroidManifest(config) {
  return withAndroidManifest(config, async (cfg) => {
    const { manifest } = cfg.modResults

    // Add tools namespace if not present
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools'
    }

    // Add tools:replace attribute to application element
    if (!manifest.application[0].$) {
      manifest.application[0].$ = {}
    }

    const existingReplace = manifest.application[0].$['tools:replace']
    if (existingReplace) {
      // Add to existing tools:replace if it doesn't already include fullBackupContent
      if (!existingReplace.includes('android:fullBackupContent')) {
        manifest.application[0].$['tools:replace'] = `${existingReplace},android:fullBackupContent`
      }
    } else {
      manifest.application[0].$['tools:replace'] = 'android:fullBackupContent'
    }

    // Add the service
    if (!manifest.application[0].service) {
      manifest.application[0].service = []
    }

    manifest.application[0].service.push({
      $: {
        'android:name': '.MessageService',
        'android:exported': 'false',
      },
      'intent-filter': [
        {
          action: {
            $: {
              'android:name': 'com.google.firebase.MESSAGING_EVENT',
            },
          },
        },
      ],
    })

    return cfg
  })
}

// Update ios/MyApp/AppDelegate.mm or ios/MyApp/AppDelegate.swift
function withExponeaAppDelegate(config) {
  const modifyAppDelegateForObjectiveC = (cfg) => {
    const { modResults } = cfg
    const { contents } = modResults
    const lines = contents.split('\n')

    const importIndex = lines.findIndex((line) => /^#import "AppDelegate.h"/.test(line))
    const didFinishLaunchingIndex = lines.findIndex((line) =>
      /return \[super application:application didFinishLaunchingWithOptions:launchOptions\]/.test(
        line,
      ),
    )
    const continueUserActivityIndex = lines.findIndex((line) =>
      /return \[super application:application continueUserActivity:userActivity restorationHandler:restorationHandler\]/.test(
        line,
      ),
    )
    const didRegisterForRemoteNotificationsWithDeviceTokenIndex = lines.findIndex((line) =>
      /return \[super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken\]/.test(
        line,
      ),
    )
    const didReceiveRemoteNotificationIndex = lines.findIndex((line) =>
      /return \[super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler\]/.test(
        line,
      ),
    )
    const endIndex = lines.findIndex((line) => /@end/.test(line))

    modResults.contents = [
      ...lines.slice(0, importIndex),
      `#import <ExponeaRNAppDelegate.h>
  #import <UserNotifications/UserNotifications.h>`,
      ...lines.slice(importIndex, didFinishLaunchingIndex),
      `  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;`,
      ...lines.slice(didFinishLaunchingIndex, continueUserActivityIndex),
      `  [Exponea continueUserActivity: userActivity];`,
      ...lines.slice(
        continueUserActivityIndex,
        didRegisterForRemoteNotificationsWithDeviceTokenIndex,
      ),
      `  [Exponea handlePushNotificationToken: deviceToken];`,
      ...lines.slice(
        didRegisterForRemoteNotificationsWithDeviceTokenIndex,
        didReceiveRemoteNotificationIndex,
      ),
      `  [Exponea handlePushNotificationOpenedWithUserInfo:userInfo];`,
      ...lines.slice(didReceiveRemoteNotificationIndex, endIndex),
      `- (void)userNotificationCenter:(UNUserNotificationCenter *)center
      didReceiveNotificationResponse:(UNNotificationResponse *)response
      withCompletionHandler:(void (^)(void))completionHandler
  {
    [Exponea handlePushNotificationOpenedWithResponse: response];
    completionHandler();
  }`,
      ...lines.slice(endIndex),
    ].join('\n')

    return cfg
  }
  const modifyAppDelegateForSwift = (cfg) => {
    let contents = cfg.modResults.contents
    // Step 1: import ExponeaSDK
    if (!contents.includes('import ExponeaSDK')) {
      contents = 'import ExponeaSDK\n' + contents
    }
    // Step 2: Register as UNUserNotificationCenterDelegate
    contents = contents.replace(
      'class AppDelegate: ExpoAppDelegate {',
      'class AppDelegate: ExpoAppDelegate, UNUserNotificationCenterDelegate {',
    )
    const launchRegex =
      /func application\([\s\S]*?didFinishLaunchingWithOptions[\s\S]*?\)\s*-> Bool\s*{([\s\S]*?)return super\.application/m
    if (
      launchRegex.test(contents) &&
      !contents.includes('UNUserNotificationCenter.current().delegate = self')
    ) {
      contents = contents.replace(launchRegex, (match, body) => {
        const newBody =
          body.trim() + '\n    UNUserNotificationCenter.current().delegate = self\n    '
        return match.replace(body, '\n    ' + newBody)
      })
    }
    // Step 3: Receive UserNotificationCenter event
    const didReceiveRegexp =
      /func userNotificationCenter\([\s\S]*?didReceive[\s\S]*?\)\s*{([\s\S]*?)}/m
    if (!didReceiveRegexp.test(contents)) {
      contents = contents.replace(
        /\n}\s*$/m,
        `\n
  public func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    completionHandler()
  }
\n}`,
      )
    }
    if (
      didReceiveRegexp.test(contents) &&
      !contents.includes('Exponea.shared.handlePushNotificationOpened(response: response)')
    ) {
      contents = contents.replace(didReceiveRegexp, (match, body) => {
        const newBody = 'Exponea.shared.handlePushNotificationOpened(response: response)    ' + body
        return match.replace(body, '\n    ' + newBody)
      })
    }
    // Step 4: Will present UserNotificationCenter event
    const willPresentRegexp =
      /func userNotificationCenter\([\s\S]*?willPresent[\s\S]*?\)\s*{([\s\S]*?)}/m
    if (!willPresentRegexp.test(contents)) {
      contents = contents.replace(
        /\n}\s*$/m,
        `\n  public func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .list, .sound])
  }
\n}`,
      )
    }
    // Step 5: Register Token
    const registerTokenRegexp =
      /(func application\([^\)]*?didRegisterForRemoteNotificationsWithDeviceToken[\s\S]*?\)\s*{)([\s\S]*?)(})/m
    if (!registerTokenRegexp.test(contents)) {
      contents = contents.replace(
        /\n}\s*$/m,
        `\n  public override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
  }
  \n}`,
      )
    }
    if (
      registerTokenRegexp.test(contents) &&
      !contents.includes('Exponea.shared.handlePushNotificationToken')
    ) {
      contents = contents.replace(registerTokenRegexp, (match, funcDef, body, funcEnd) => {
        return (
          funcDef +
          body +
          '    Exponea.shared.handlePushNotificationToken(deviceToken: deviceToken)\n  ' +
          funcEnd
        )
      })
    }
    // Step 6: Receive PushNotification
    const receivePushRegexp =
      /(func application\([^\)]*?didReceiveRemoteNotification[\s\S]*?\)\s*{)([\s\S]*?)(completionHandler[\s\S]*?})/m
    if (!receivePushRegexp.test(contents)) {
      contents = contents.replace(
        /\n}\s*$/m,
        `\n  public override func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    completionHandler(.newData)
  }
  \n}`,
      )
    }
    if (
      receivePushRegexp.test(contents) &&
      !contents.includes('Exponea.shared.handlePushNotificationOpened(userInfo: userInfo)')
    ) {
      contents = contents.replace(receivePushRegexp, (match, funcDef, body, funcEnd) => {
        return (
          funcDef +
          body +
          'Exponea.shared.handlePushNotificationOpened(userInfo: userInfo)\n    ' +
          funcEnd
        )
      })
    }

    cfg.modResults.contents = contents
    return cfg
  }
  return withAppDelegate(config, (cfg) => {
    if (cfg.modResults.language === 'swift') {
      return modifyAppDelegateForSwift(cfg)
    } else {
      return modifyAppDelegateForObjectiveC(cfg)
    }
  })
}

// Add the file MessageService.java
function withExponeaAndroidMessageService(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const androidProjRoot = cfg.modRequest.platformProjectRoot
      const packageName = cfg.android.package
      const pathToDir = packageName.replaceAll('.', '/')
      mkdirSync(`${androidProjRoot}/app/src/main/java/${pathToDir}`, {
        recursive: true,
      })
      writeFileSync(
        `${androidProjRoot}/app/src/main/java/${pathToDir}/MessageService.java`,
        `package ${packageName};
  
  import android.app.NotificationManager;
  import android.content.Context;
  import androidx.annotation.NonNull;
  import com.exponea.ExponeaModule;
  import com.google.firebase.messaging.FirebaseMessagingService;
  import com.google.firebase.messaging.RemoteMessage;
  
  public class MessageService extends FirebaseMessagingService {
  
      @Override
      public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
          super.onMessageReceived(remoteMessage);
          ExponeaModule.Companion.handleRemoteMessage(
                  getApplicationContext(),
                  remoteMessage.getData(),
                  (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE));
      }
  
      @Override
      public void onNewToken(@NonNull String token) {
          super.onNewToken(token);
          ExponeaModule.Companion.handleNewToken(
                  getApplicationContext(),
                  token);
      }
  }
  `,
      )
      return cfg
    },
  ])
}

// Replace AppDelegate.h
function withExponeaIosAppDelegateH(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const iosProjRoot = cfg.modRequest.platformProjectRoot
      const projectName = cfg.name
      const appDelegateH = `${iosProjRoot}/${projectName}/AppDelegate.h`
      if (!existsSync(appDelegateH)) {
        return cfg
      }
      writeFileSync(
        appDelegateH,
        `#import <RCTAppDelegate.h>
  #import <UIKit/UIKit.h>
  #import <Expo/Expo.h>
  #import <UserNotifications/UNUserNotificationCenter.h>
  
  @interface AppDelegate : EXAppDelegateWrapper <UNUserNotificationCenterDelegate>
  
  @end
  `,
      )
      return cfg
    },
  ])
}

function withExponea(config) {
  return withPlugins(config, [
    withExponeaBuildGradle,
    withExponeaAndroidManifest,
    withExponeaAppDelegate,
    withExponeaAndroidMessageService,
    withExponeaIosAppDelegateH,
  ])
}

module.exports = withExponea
