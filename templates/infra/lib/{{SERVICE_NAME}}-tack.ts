import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class {{SERVICE_CLASS_NAME}}Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const serviceName = '{{SERVICE_NAME}}';

    const handler = new lambda.Function(this, `${serviceName}-handler`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('../services/' + serviceName),
      handler: 'src/index.handler', // later you can adapt to Lambda style
      environment: {
        SERVICE_NAME: serviceName
      }
    });

    const api = new apigw.RestApi(this, `${serviceName}-api`, {
      restApiName: `${serviceName} Service API`,
      deployOptions: {
        stageName: 'dev'
      }
    });

    const base = api.root.addResource(serviceName);
    base.addMethod('GET', new apigw.LambdaIntegration(handler));

    const health = api.root.addResource('healthz');
    health.addMethod('GET', new apigw.LambdaIntegration(handler));
  }
}
