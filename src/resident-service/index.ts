import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda';

export const handler: Handler =
  async ( event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {

  const testEnvVar: string = process.env.TEST_VALUE || '';

  console.log(`Env var: ${testEnvVar}`);
  console.log(event);

  const headers = {
    'Content-Type': 'application/json',
  };

  let response;
  switch (event.routeKey) {
    case "GET /residents":
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify([
          { id: 1, firstName: 'John', lastName: 'Doe', age: 32, weight: 185.3, stateId: 1 },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 31, weight: 142.7, stateId: 1 },
        ]),
      };

      return response;

    case "POST /residents":
      response = {
        statusCode: 201,
        headers: headers,
        body: JSON.stringify({
          id: 1, firstName: 'John', lastName: 'Doe', age: 32, weight: 185.3, stateId: 1
        }),
      };

      return response;

    case "GET /residents/{id}":
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          id: 1, firstName: 'John', lastName: 'Doe', age: 32, weight: 185.3, stateId: 1
        }),
      };

      return response;

    case "PUT /residents/{id}":
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          id: 1, firstName: 'John', lastName: 'Doe', age: 32, weight: 185.3, stateId: 1
        }),
      };

      return response;

    case "DELETE /residents/{id}":
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          message: `ID: ${event.pathParameters?.id || '?'} deleted successfully`
        }),
      };

      return response;
  }

  throw new Error(`Unsupported route: "${event.routeKey}"`);
};
