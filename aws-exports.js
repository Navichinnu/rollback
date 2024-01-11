import { Amplify, Auth } from 'aws-amplify';
const authURL = process.env.NEXT_PUBLIC_authURL;
const region = process.env.NEXT_PUBLIC_region;
const userPoolId = process.env.NEXT_PUBLIC_userPoolId;
const userPoolWebClientId = process.env.NEXT_PUBLIC_userPoolWebClientId;
const oauthdomain = process.env.NEXT_PUBLIC_oauthdomain;
// const identityPoolId = process.env.identityPoolId;
Amplify.configure({
    Auth: {
        // identityPoolId: identityPoolId,
        region: region,
        // identityPoolRegion: region,
        userPoolId: userPoolId,
        userPoolWebClientId: userPoolWebClientId,
        mandatorySignIn: false,
        signUpVerificationMethod: 'code',
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        clientMetadata: { myCustomKey: 'myCustomValue' },
        oauth: {
            domain: oauthdomain,
            scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
            redirectSignIn: authURL,
            redirectSignOut: authURL,
            responseType: 'code'
        }
    }
});
const awsconfig = Auth.configure();
export default awsconfig;