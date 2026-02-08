const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");


const client =
  new DynamoDBClient({ region: process.env.Region })
;

exports.scanWithAttr = async (event) => {
  const tableName = process.env.DYNAMO_TABLE_BOOKS_COMP;

  // Expecting event like:
  // { attributeName: "publisher", attributeValue: "Diamond" }
  const { attributeName, attributeValue } = JSON.parse(event.body);

  try {
    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: "#attr = :val",
      ExpressionAttributeNames: {
        "#attr": "price",
      },
      ExpressionAttributeValues: {
        ":val": {S:"369.369"},
      },
    });
    console.log(JSON.stringify({command}));
    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Scan successful with filter",
        items: response.Items,
        count: response.Count,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};