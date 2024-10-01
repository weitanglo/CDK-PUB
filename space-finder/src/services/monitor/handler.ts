import { SNSEvent } from "aws-lambda";

const webHookUrl = 'url'; // slack channel url

async function handler(event: SNSEvent, context) {
    for (const record of event.Records) {
        await fetch(webHookUrl, {
            method: 'POST',
            body: JSON.stringify({
                "test": `Japan, we have a problem: ${record.Sns.Message}`
            })
        })
    }    
}

export { handler }


