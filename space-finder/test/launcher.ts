import { handler } from "../src/services/spaces/handler";

// process.env.AWS_REGION = "ap-northeast-1";
// process.env.TABLE_NAME = "SpaceTable-0e5b9dcae185";

// handler({
//     httpMethod: 'POST',
//     body: JSON.stringify({
//         location: 'taiwan',
//         name:'C'
//     })
// } as any, {} as any).then(result =>{
//     console.log(result)
// });

// handler({
//     httpMethod: 'GET',
//     queryStringParameters: {
//         id : '33abd789-7645-4262-a88a-26b5e21e1388'
//     }
// } as any, {} as any).then(result =>{
//     console.log(result)
// });


handler({
    httpMethod: 'DELETE',
    queryStringParameters: {
        id: '33abd789-7645-4262-a88a-26b5e21e1388'
    },
} as any, {} as any).then(result =>{
    console.log(result)
});

// handler({
//     httpMethod: 'PUT',
//     queryStringParameters: {
//         id: '260088cd-ewiie-3e33-3jdf'
//     },
//     body: JSON.stringify({
//         location: 'London2'
//     })
// } as any, {} as any);