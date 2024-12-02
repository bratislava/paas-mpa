// Inspired by https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
// Secures typesafe access to environmental variables.
// In browser process.env is an empty object, the values are replaced during the build time, so they need to be accessed
// via process.env.NEXT_PUBLIC_...

/* eslint-disable no-process-env */
function assertEnv<T>(variable: string, value: T) {
  if (!value) {
    throw new Error(`Missing environment variable: ${variable}`)
  }

  return value
}

export const environment = {
  nodeEnv: assertEnv('NODE_ENV', process.env.NODE_ENV),
  deployment: assertEnv('EXPO_PUBLIC_DEPLOYMENT', process.env.EXPO_PUBLIC_DEPLOYMENT),
  mapboxPublicKey: assertEnv('EXPO_PUBLIC_MAPBOX_KEY', process.env.EXPO_PUBLIC_MAPBOX_KEY),
  cognitoUserPoolId: assertEnv(
    'EXPO_PUBLIC_COGNITO_USER_POOL_ID',
    process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
  ),
  cognitoClientId: assertEnv(
    'EXPO_PUBLIC_COGNITO_CLIENT_ID',
    process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
  ),
  awsRegion: assertEnv('EXPO_PUBLIC_AWS_REGION', process.env.EXPO_PUBLIC_AWS_REGION),
  apiUrl: assertEnv('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL),
  minioBucket: assertEnv('EXPO_PUBLIC_MINIO_BUCKET', process.env.EXPO_PUBLIC_MINIO_BUCKET),
  sentryDns: assertEnv('EXPO_PUBLIC_SENTRY_DNS', process.env.EXPO_PUBLIC_SENTRY_DNS),
  turnstileSiteKey: assertEnv(
    'EXPO_PUBLIC_TURNSTILE_SITE_KEY',
    process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY,
  ),
}
