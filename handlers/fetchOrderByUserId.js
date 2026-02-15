const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.Region });

exports.fetchOrderByUserId = async () => {
  const tableName = process.env.DYNAMO_TABLE_ECOMM;

  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#pk = :pkVal AND begins_with(#sk, :skVal)",
      ExpressionAttributeNames: {
        "#pk": "pk",     // partition key
        "#sk": "sk", // sort key
      },
      ExpressionAttributeValues: {
        ":pkVal": { S: "user#1" },   // partition key value
        ":skVal": { S: "order" },   // sort key value
      },
      
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Query successful",
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