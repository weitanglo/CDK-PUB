import { Amplify } from 'aws-amplify';
import { SignInOutput, fetchAuthSession, signIn, signOut } from '@aws-amplify/auth';
import { AuthStack } from '../../../space-finder/outputs.json'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'ap-northeast-1';

Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: AuthStack.SpaceUserPoolId,
        userPoolClientId: AuthStack.SpaceUserPoolClientId,
        identityPoolId: AuthStack.SpaceIdentityPoolRef
      },
    },
  });
export class AuthService {

    private user: SignInOutput | undefined;
    private userName: string | undefined;
    public jwtToken: string | undefined;
    private temporaryCredentials: object | undefined;

    public isAuthorized(){
        if (this.jwtToken) {
            return true;
        }
        return false;
    }

    public async toSignOut(){
        await signOut();
        this.jwtToken = undefined;
        this.user = undefined;
        this.userName = undefined;
        return true;
    }

    public async isSingOut(){
        const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
        if(idToken) {
            await signOut();
            this.jwtToken = undefined;
            this.user = undefined;
            this.userName = undefined;
            return idToken;
        }
        return idToken;
    }

    public async login(userName: string, password: string):Promise<Object | undefined> {
        try {
            const signInOutput: SignInOutput = await signIn({
                username: userName,
                password: password,
                options: {
                    authFlowType: 'USER_PASSWORD_AUTH'
                }
            });
            this.user = signInOutput;
            this.userName = userName;
            await this.generateIdToken();
            return this.user;
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    public async getTemporaryCredentials(){
        if (this.temporaryCredentials) {
            return this.temporaryCredentials
        }
        this.temporaryCredentials = await this.generateTempCredentials()
        return this.temporaryCredentials;
    }

    private async generateTempCredentials(){
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                clientConfig: {
                    region: awsRegion
                },
                identityPoolId: AuthStack.SpaceIdentityPoolRef,
                logins: {
                    [cognitoIdentityPool]: this.jwtToken!
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials
    }

    private async generateIdToken(){
        const session = await fetchAuthSession();
        this.jwtToken = session.tokens?.idToken?.toString();
    }

    // public getIdToken(){
    //     return this.jwtToken;
    // } 

    public getUserName(){
        return this.userName
    }
}