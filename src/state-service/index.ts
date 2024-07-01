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
    case "GET /states":
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify([
          { id: 1, name: 'Nebraska', symbol: 'NE' },
          { id: 2, name: 'California', symbol: 'CA' },
        ]),
      };

      return response;

    case "POST /states":
      response = {
        statusCode: 201,
        headers: headers,
        body: JSON.stringify({
          id: 1, name: 'Nebraska', symbol: 'NE'
        }),
      };

      return response;

    case "GET /states/{id}":
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          id: 1, name: 'Nebraska', symbol: 'NE'
        }),
      };

      return response;

    case "PUT /states/{id}":
      response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          id: 1, name: 'Nebraska', symbol: 'NE'
        }),
      };

      return response;

    case "DELETE /states/{id}":
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

