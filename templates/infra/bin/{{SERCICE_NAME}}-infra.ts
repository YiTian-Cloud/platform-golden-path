#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { {{SERVICE_CLASS_NAME}}Stack } from '../lib/{{SERVICE_NAME}}-stack';

const app = new cdk.App();
new {{SERVICE_CLASS_NAME}}Stack(app, '{{SERVICE_CLASS_NAME}}Stack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
