import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "../../../src/services/spaces/GetSpaces";
import 'jest';

const someItems = {
    Items: [{
        id: {
            S: '123'
        },
        location: {
            S: 'Paris'
        }
    }]
}

const someItem = {
    Item: {
        id: {
            S: '123'
        },
        location: {
            S: 'Paris'
        }
    }
}

describe('GetSpaces test suite', () => {

    // create mock send function for not use real sdk calls 
    const ddbClientMock = {
        send: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should return spaces by scan if no queryStringParameters', async () => {
        // set data to mock dynamodb when we calling this mock, just return someItems check getSpaces
        ddbClientMock.send.mockResolvedValueOnce(someItems);
        const getResult = await getSpaces({} as any, ddbClientMock as any);
        // also we can except some paras from ddbClientMock like ScanCommand or TableName:~
        const expectedResult =  {
            statusCode: 201,
            body: JSON.stringify([{
                id: '123',
                location: 'Paris'
            }])
        }
        console.log(getResult);
        console.log(expectedResult);
        expect(getResult).toEqual(expectedResult);
    });

    test('should return 401 if no id in queryStringParameters', async () => {
        // mock send function setup is no need, no sdk call
        const getResult = await getSpaces({
            queryStringParameters: {
                noId: '123'
            }
        } as any, ddbClientMock as any);
        const expectedResult = {
            statusCode: 401,
            body: JSON.stringify('Id required!')
        }
        expect(getResult).toEqual(expectedResult);
    });

    test('should return 401 if item is not existed', async () => {
        ddbClientMock.send.mockResolvedValueOnce({});
        const getResult = await getSpaces({
            queryStringParameters: {
                id: '124'
            }
        } as any, ddbClientMock as any);
        const expectedResult = {
            statusCode: 401,
            body: JSON.stringify(`Space with id 124 not found!`)
        }
        expect(getResult).toEqual(expectedResult);
    });

    test('should return 200 if queryStringParameters with found id', async () => {
        // set data to mock function and track ddbClient that real sdk function
        ddbClientMock.send.mockResolvedValueOnce(someItem);
        const getResult = await getSpaces({
            queryStringParameters: {
                id: '123'
            }
        } as any, ddbClientMock as any);
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify({
                id: '123',
                location: 'Paris'
            })
        }
        expect(getResult).toEqual(expectedResult);
        // look inside our mock and check the arguments that have been called with 
        expect(ddbClientMock.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
        const getItemCommandInput = (ddbClientMock.send.mock.calls[0][0] as GetItemCommand).input;
        console.log(getItemCommandInput);
        expect(getItemCommandInput.TableName).toBeUndefined();
        expect(getItemCommandInput.Key).toEqual({
            id: {
                S: '123' 
            }
        })
    });

})