import { join } from 'path';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CorsHttpMethod, HttpApi, HttpMethod as ApiGwHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

interface ApiStackProps extends StackProps {
}

export class ApiStack extends Stack {

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const stateServiceLambda = new NodejsFunction(this, 'StateServiceLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: join(__dirname, '../../../src/state-service/index.ts'),
      bundling: {
        nodeModules: ['@types/aws-lambda'],
      },
      environment: {
        TEST_VALUE: 'TEST',
      },
    });

    const stateServiceLambdaIntegration =
      new HttpLambdaIntegration('StateServiceIntegration', stateServiceLambda);

    const residentServiceLambda = new NodejsFunction(this, 'ResidentServiceLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: join(__dirname, '../../../src/resident-service/index.ts'),
      bundling: {
        nodeModules: ['@types/aws-lambda'],
      },
      environment: {
        TEST_VALUE: 'TEST',
      },
    });

    const residentServiceLambdaIntegration =
      new HttpLambdaIntegration('ResidentServiceIntegration', residentServiceLambda);

    const httpApi = new HttpApi(this, 'HttpApi', {
      createDefaultStage: false,
      corsPreflight: {
        allowHeaders: ['Authorization'],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ['*'],
        maxAge: Duration.days(10),
      },
    });

    httpApi.addStage('DefaultStage', {
      stageName: '$default',
      autoDeploy: true,
      throttle: {
        burstLimit: 2,
        rateLimit: 1,
      }
    });

    httpApi.addRoutes({
      path: '/states',
      methods: [ApiGwHttpMethod.GET, ApiGwHttpMethod.POST],
      integration: stateServiceLambdaIntegration,
    });

    httpApi.addRoutes({
      path: '/states/{id}',
      methods: [ApiGwHttpMethod.GET, ApiGwHttpMethod.PUT, ApiGwHttpMethod.DELETE],
      integration: stateServiceLambdaIntegration,
    });

    httpApi.addRoutes({
      path: '/residents',
      methods: [ApiGwHttpMethod.GET, ApiGwHttpMethod.POST],
      integration: residentServiceLambdaIntegration,
    });

    httpApi.addRoutes({
      path: '/residents/{id}',
      methods: [ApiGwHttpMethod.GET, ApiGwHttpMethod.PUT, ApiGwHttpMethod.DELETE],
      integration: residentServiceLambdaIntegration,
    });
  }
}
