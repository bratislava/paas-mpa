import WebView, { WebViewMessageEvent } from 'react-native-webview'

import { environment } from '@/environment'

type Props = {
  onSuccess: (token: string) => void
  onFail: (errorCode: string) => void
}

/**
 * Captcha component handles Cloudflare's invisible captcha. The webview is opened without any user interaction. The user is not aware of the captcha, but the token is sent to the onSuccess callback.
 * TODO: For now the captcha is not required by cognito, we need the number of users who failed the captcha and why. After that the errors will be handled and the captcha can be enabled in cognito.
 * @param onSuccess Callback function that is called when the captcha is successfully solved. The token is passed as an argument.
 * @param onFail Callback function that is called when the captcha fails. The error code is passed as an argument and sent to the cognito.
 */
const Captcha = ({ onSuccess, onFail }: Props) => {
  const handleMessage = (event: WebViewMessageEvent) => {
    const { data } = event.nativeEvent

    if (data.split('_')[0] === 'error') {
      onFail(data.split('_')[1])
    } else {
      onSuccess(data)
    }
  }

  return (
    <WebView
      originWhitelist={['*']}
      onMessage={handleMessage}
      source={{
        baseUrl: 'https://bratislava.sk',
        html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_renderCaptcha" async defer></script>
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
                                'error-callback': function (error) {
                                    window.ReactNativeWebView.postMessage("error_" + error);
                                }
                            });
                        }
                    </script>
                </body>
            </html>
        `,
      }}
    />
  )
}

export default Captcha
