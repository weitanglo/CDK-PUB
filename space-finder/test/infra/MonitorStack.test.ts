import { App } from "aws-cdk-lib";
import { MonitorStack } from "../../src/infra/stacks/MonitorStack";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";


describe('initial tes suite', () => {

    // arrange step ,when preparing our step environment
    let monitorStackTemplate: Template;

    beforeAll(() => {
        const testApp = new App({
            outdir: 'cdk.out'
        });
        const monitorStack = new MonitorStack(testApp, 'MonitorStack');
        monitorStackTemplate = Template.fromStack(monitorStack);
    })

    test('Lambda properties', () => {
        // act step ,when acting with our classes or our system under test
        // assert step ,when making sure that thing are the right way or they are not
        monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.handler',
            Runtime: 'nodejs18.x'
        });
        // expect(true).toBeTruthy();
    });

    test('Sns topic properties', () => {
        monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
            DisplayName: 'alarmTopic',
            TopicName: 'alarmTopic'
        });
    });
    test('Sns Subscription properties - with CDK matchers', () => {
        monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription',
            Match.objectEquals(
                {
                    Protocol: 'lambda',
                    TopicArn: {
                        Ref: Match.stringLikeRegexp('alarmTopic')
                    },
                    Endpoint: {
                        'Fn::GetAtt': [
                            Match.stringLikeRegexp('webHookLambda'),
                            'Arn'
                        ]
                    }
                }));
    });

    test('Sns Subscription properties - with exact values', () => {
        const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');
        console.log(snsTopic);
        const snsTopicName = Object.keys(snsTopic)[0];
        const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
        const lambdaName = Object.keys(lambda)[0];

        monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription',
            Match.objectEquals(
                {
                    Protocol: 'lambda',
                    TopicArn: {
                        Ref: snsTopicName
                    },
                    Endpoint: {
                        'Fn::GetAtt': [
                            lambdaName,
                            'Arn'
                        ]
                    }
                }));
    });

    test('Alarm actions - with Capture and Jest matchers', ()=> {
        const alarmActionsCapture = new Capture();
        monitorStackTemplate.hasResourceProperties('AWS::CloudWatch::Alarm', {
            AlarmActions: alarmActionsCapture
        })

        expect(alarmActionsCapture.asArray()).toEqual([{
            Ref: expect.stringMatching(/^alarmTopic/)
        }])
    });

    test('Monitor stack snapshot', () => {
        expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
    });

    test('Lambda stack snapshot', () => {
        const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
        expect(lambda).toMatchSnapshot();
    });

    test('Snstopic stack snapshot', () => {
        const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');
        expect(snsTopic).toMatchSnapshot();
    });
})