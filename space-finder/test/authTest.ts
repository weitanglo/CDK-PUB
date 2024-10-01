import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(   
            'weitang',
            'xR9Z36.8'    
    )
    console.log(loginResult);
    const idToken = await service.getIdToken();
    console.log(idToken);
    const a = 5;   //use to put break point
    const credentials = await service.generateTemporaryCredentials();
    const b = 5;   //use to put break point 
    // console.log(credentials);
    const buckets = await listBuckets(credentials);
    console.log(buckets);
}

async function listBuckets(credentials: any) {
    const client = new S3Client({
        credentials: credentials
    });
    const command = new ListBucketsCommand({});
    const result = await client.send(command);
    return result;
}

testAuth();