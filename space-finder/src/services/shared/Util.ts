import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JsonError } from "./validator";
import { randomUUID } from "crypto"

export function parseJSON(arg: string) {
    try {
        return JSON.parse(arg);
    } catch (error) {
        throw new JsonError(error.message);
    }
}

export function createRandomId() {
    return randomUUID();
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if (groups) {
        return (groups as string).includes('admin');
    }
    return false;
}

export function addCrosHeader(arg: APIGatewayProxyResult){
    if(!arg.headers){
        arg.headers = {}
    }            //arg.headersがない場合に、空のObjectを追加し、新フィルムを追加可能になる
    arg.headers['Access-Control-Allow-Origin'] = '*' ;//usually put the website origin not *, but we dont know, allow any website from world
    arg.headers['Access-Control-Allow-Meahods'] = '*';
}


