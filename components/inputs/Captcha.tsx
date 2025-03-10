import * as Sentry from '@sentry/react-native'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { View } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'

import { environment } from '@/environment'

type Props = {
  onSuccess: (token: string) => void
  onFail: (errorCode: string) => void
}

const CAPTCHA_ERROR_START_MESSAGE = 'error_'

export type CaptchaRef = {
  initializeCaptcha: () => void
}

/**
 * Captcha component handles Cloudflare's managed captcha. The webview is opened with user interaction. The user is aware of the captcha, and the token is sent to the onSuccess callback.
 * @param onSuccess Callback function that is called when the captcha is successfully solved. The token is passed as an argument.
 * @param onFail Callback function that is called when the captcha fails. The error code is passed as an argument.
 */
const Captcha = forwardRef<CaptchaRef, Props>(({ onSuccess, onFail }, ref) => {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    initializeCaptcha: () => {
      setShowCaptcha(true)
    },
  }))

  const handleMessage = (event: WebViewMessageEvent) => {
    const { data } = event.nativeEvent
    if (data.startsWith(CAPTCHA_ERROR_START_MESSAGE)) {
      const errorCode = data.split('_')[1]

      onFail(errorCode)

      if (environment.deployment === 'production') {
        Sentry.captureException('Turnstile Captcha failed', {
          extra: { errorCode },
          level: 'info',
        })
      }
    } else {
      onSuccess(data)
    }

    setShowCaptcha(false)
  }

  return showCaptcha ? (
    <View className="h-[100px] w-full flex-1">
      <WebView
        originWhitelist={['*']}
        onMessage={handleMessage}
        className="w-full flex-1"
        source={{
          baseUrl: 'https://bratislava.sk',
          html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_renderCaptcha" async defer></script>
                    <style>
                        html, body {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                        #turnstileWidget {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            transform: scale(2);
                        }
                    </style>
                </head>
                <body>
                    <div id="turnstileWidget"></div>

                    <script>
                        // The function name matches the "onload=..." parameter.
                        function _renderCaptcha() {
                            turnstile.render('#turnstileWidget', {
                                sitekey: '${environment.turnstileSiteKey}',
                                callback: function (token) {
                                    window.ReactNativeWebView.postMessage(token);
                                },
                                'error-callback': function (errorCode) {
                                    window.ReactNativeWebView.postMessage("${CAPTCHA_ERROR_START_MESSAGE}" + errorCode);
                                }
                            });
                        }
                    </script>
                </body>
            </html>
        `,
        }}
      />
    </View>
  ) : null
})

export default Captcha
