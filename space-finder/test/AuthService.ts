import { Amplify } from 'aws-amplify'
import { fetchAuthSession, signIn, SignInInput, SignInOutput, type AuthTokens } from 'aws-amplify/auth'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { AuthStack } from '../outputs.json'

const awsRegion = 'ap-northeast-1'

Amplify.configure({
    Auth: {
        Cognito: {// region: awsRegion,
            userPoolId: AuthStack.SpaceUserPoolId,
            userPoolClientId: AuthStack.SpaceUserPoolClientId,
            identityPoolId: AuthStack.SpaceIdentityPoolRef,
        }
        // authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})

export class AuthService {
    public async login(userName: string, password: string){
        const singnInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        })
        return singnInOutput;
    }

    public async getIdToken(){
        const authSession = await fetchAuthSession();
        return authSession.tokens?.idToken?.toString();
    }
    
    public async generateTemporaryCredentials(){
        const idToken = await this.getIdToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-northeast-1_EW3wIFbTX`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'ap-northeast-1:afc48090-d4ea-47fe-9e9e-5d589324ccc1',
                logins: {
                    [cognitoIdentityPool]: idToken
                }
            })
        })
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }

    // public async login({ username, password }: SignInInput) {
    //     const result = await signIn({ username, password });
    //     const { idToken, accessToken } = (await fetchAuthSession()).tokens ?? {} as AuthTokens;
    //     // console.log(idToken.toString());
    //     return { idToken, accessToken };
    // }

    // public async generateTemporaryCredentials(token: AuthTokens) {   //To pass the token to general credentials 
    //     const jwtToken = token.idToken.toString(); //v6
    //     const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-northeast-1_uwz1sHhC5`;    //orgenizatize cognito identity pool using userpool(provider). use cognitoUsepool is better than cognitoIdentityPool
    //     const cognitoIdentity = new CognitoIdentityClient({
    //         credentials: fromCognitoIdentityPool({
    //             identityPoolId: 'ap-northeast-1:9dadfda7-6920-4bac-a8a3-06a1fd577ba4',
    //             logins: {
    //                 [cognitoIdentityPool]: jwtToken
    //             }
    //         })
    //     })
    //     const credentials = await cognitoIdentity.config.credentials();
    //     return credentials;
    // }
}

