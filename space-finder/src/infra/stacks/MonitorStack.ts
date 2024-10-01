import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Alarm, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { join } from 'path';

export class MonitorStack extends Stack {

    constructor(scop: Construct, id: string, props?: StackProps) {
        super(scop, id, props);

        const webHookLambda = new NodejsFunction(this, 'webHookLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry:(join(__dirname, '..', '..', 'services', 'monitor', 'handler.ts'))
        });

        const alarmTopic = new Topic(this, 'alarmTopic', {
            displayName: 'alarmTopic',
            topicName: 'alarmTopic'
        });
        alarmTopic.addSubscription(new LambdaSubscription(webHookLambda));

        const spacesApi4xxAlarm = new Alarm(this, 'spacesApi4xxAlarm', {
            metric: new Metric({
                metricName: '4XXError',
                namespace: 'AWS/ApiGateway',
                period: Duration.minutes(1),
                statistic: 'Sum',
                unit: Unit.COUNT,
                dimensionsMap: {
                    "ApiName": "SpacesApi"
                }
            }),
            evaluationPeriods: 1,
            threshold: 5,
            alarmName: 'spacesApi4xxAlarm'
        });
        const topicAction = new SnsAction(alarmTopic);
        spacesApi4xxAlarm.addAlarmAction(topicAction);
        spacesApi4xxAlarm.addOkAction(topicAction);
    }
}

