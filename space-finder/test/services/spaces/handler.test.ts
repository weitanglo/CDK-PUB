import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { handler } from "../../../src/services/spaces/handler";

const someItems = [{
    id: {
        S: '123'
    },
    location: {
        S: 'Paris'
    }
}]
// when involk Dynamodb return different what we tell to, not real SDK package
// all this effort is just to configure for this test, for mutiple test we need help function
jest.mock('@aws-sdk/client-dynamodb', () => {
    return {
        DynamoDBClient: jest.fn().mockImplementation(() => {
            return {
                send: jest.fn().mockImplementation(() => {
                    return {
                        Items: someItems // for scan command needs Items
                    }
                })
            }
        }),
        ScanCommand: jest.fn()
    }
});

describe('Spaces handler test suite', () => {

    test('Returns spaces from dynamodb', async () => {
        const result = await handler({
            httpMethod: 'GET' // event
        } as any, {} as any);
        console.log(result.body)
        expect(result.statusCode).toBe(201);
        const expectedResult = [{
            id: '123',
            location: 'Paris'
        }];
        const parseResultBody = JSON.parse(result.body);
        console.log(parseResultBody);
        expect(parseResultBody).toEqual(expectedResult);
        expect(DynamoDBClient).toHaveBeenCalledTimes(1);
        expect(ScanCommand).toHaveBeenCalledTimes(1);
        const a = 5;
    })
})

