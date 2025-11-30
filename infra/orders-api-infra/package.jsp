{
    "name": "orders-api-infra",
    "version": "1.0.0",
    "bin": {
      "orders-api-infra": "bin/orders-api-infra.js"
    },
    "scripts": {
      "build": "tsc",
      "cdk": "cdk",
      "synth": "cdk synth",
      "deploy": "cdk deploy",
      "destroy": "cdk destroy"
    },
    "dependencies": {
      "aws-cdk-lib": "2.150.0",
      "constructs": "^10.0.0"
    },
    "devDependencies": {
      "typescript": "^5.5.0"
    }
  }
  