import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { vailateAsSpaceEntry } from "../shared/validator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { createRandomId, parseJSON } from "../shared/Util";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    const randomId = createRandomId();
    const item = parseJSON(event.body);
    item.id = randomId;
    vailateAsSpaceEntry(item);

    const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
        //Item:item
    }));// cannot read properties of undefined (reading '0') dynamodb
    console.log(result);
    return {
        statusCode: 201,
        body: JSON.stringify({ id: randomId })
    }
}