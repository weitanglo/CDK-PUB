import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (event.queryStringParameters && ('id' in event.queryStringParameters) && event.body) {

        const parsedBody = JSON.parse(event.body);
        const spaceId = event.queryStringParameters['id'];
        const requestBodyKey = Object.keys(parsedBody)[0];    //最初のkey-valueだけevent.bodyから値を取るのほうが理解できる、bodyの第一key(location)を取得
        const requestBodyValue = parsedBody[requestBodyKey];  //複雑なクリエには他のリクエストと区別のためにkeyが必要、第一key(location)の内容を取得

        const updateResult = await ddbClient.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {                                        //DynamoDb has a lot of reserved keywords and we are updating things dynamically so
                'id': { S: spaceId }                      //we won't know what keyword exactly or what field is updated like right here
            },
            UpdateExpression: 'set #zzzNew = :new',       //if an reserved keyword is used as an update field, then we will have error
            ExpressionAttributeValues: {                  //use UpdateExpression to prevent this problem
                ':new': {
                    S: requestBodyValue
                }
            },
            ExpressionAttributeNames: {
                '#zzzNew': requestBodyKey
            },
            ReturnValues: "UPDATED_NEW"                 //if something was updated, then this query will tell us what exactly was updated
        }));
        return {
            statusCode: 204,
            body: JSON.stringify(updateResult.Attributes)
        }

    }
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide right args!!')
    }
}