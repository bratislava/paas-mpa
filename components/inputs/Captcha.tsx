import WebView from 'react-native-webview'

import { environment } from '@/environment'

type Props = {
  onSuccess: (token: string) => void
  onFail: () => void
}

const Captcha = ({ onSuccess, onFail }: Props) => {
  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    const { data } = event.nativeEvent

    if (data === 'error') {
      onFail()
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
                    <div>aaaa</div>
                    <div id="turnstileWidget"></div>
                    <div>aaa</div>
                    <script>
                        // The function name matches the "onload=..." parameter.
                        function _renderCaptcha() {
                            turnstile.render('#turnstileWidget', {
                                sitekey: '${environment.captchaSiteKey}',
                                callback: function (token) {
                                    window.ReactNativeWebView.postMessage(token);
                                },
                                'error-callback': function (error) {
                                    window.ReactNativeWebView.postMessage('error');
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
