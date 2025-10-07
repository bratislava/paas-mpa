# PAAS app

In general, follow https://docs.expo.dev/, below are some quick references.

## Product specification

[Product specification](https://magistratba.sharepoint.com/:w:/r/sites/InnovationTeam/_layouts/15/Doc.aspx?sourcedoc=%7B76D1D09F-49C5-412E-81DD-C2498CBCD903%7D&file=Produktov%25u00e1%20a%20technick%25u00e1%20%25u0161pecifik%25u00e1cia%20bratislavsk%25u00e1%20parkovacej%20aplik%25u00e1cie.docx&action=default&mobileredirect=true)

## Develop

We are using eas-development builds - read more here https://docs.expo.dev/develop/development-builds/introduction/

Quick reference:

```bash
# you'll want eas-cli installed globally
# install local packages
yarn

# local development once you have build installed and are changing only javascript
yarn start

# list existing builds (most of the time, you'll install the latest matching from here)
east build:list

# Android emulator or device build
eas build --profile development --platform android

# iOs simulator build
eas build --profile development-simulator --platform ios

# iOs device build
eas build --profile development --platform ios

# register new iOs device
eas device:create
```

### Communication with Backend

The BE has it's OpenAPI specification with Swagger.
We use the `@openapitools/openapi-generator-cli` by which we can generate typesafe code to communicate with Rest API.

To generate fresh types just run this command:

```bash
yarn generate-clients
```

## Deploy

### Build

Follow https://docs.expo.dev/deploy/build-project/

Quick reference:

```bash
eas build --platform all

# optionally, by platform
eas build --platform android
eas build --platform ios
```

## Release

We have release pipelines so when we want to release production we create release in this repo with `prod*.*.*` tag. The pipeline will build app and submit it to the both stores.
https://docs.expo.dev/deploy/submit-to-app-stores/

### Release - Android

Rest of the flow is done in Google Play Console.

> [!IMPORTANT]  
> Google reviewers are from India and this country is blocked by AWS WAF. Country can change at any moment.

### Release - iOs

Rest of the flow is done in App Store Connect.

> [!IMPORTANT]  
> Apple reviewers are from Ireland and this country is blocked by AWS WAF. Country can change at any moment.

## Environment variables

Public ones available in the final frontend package go to `.env` prefixed with `EXPO_PUBLIC_`. Access them using `environment.ts`. Release envs are set in `eas.json` file for each build profile separately. Secrets go to Expo secrets (and are afterwards available in app.config.js - and probably elsewhere - as environment variables) - see Expo secrets docs.

You can create the usual array of .env files (`.env.local`, `.env.development`). Expect for `.env*.local`, the are all committed to git.
